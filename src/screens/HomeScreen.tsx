import { HeaderLogo } from "../components/HeaderLogo";

import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalBannerAd } from '../components/GlobalBannerAd';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { CATEGORIES } from '../data/categories';
import { DISPLAY_LEVEL_COUNT } from '../assets/levels/index';
import { useGameStore } from '../store/useGameStore';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { GlossyButton } from '../components/ui/GlossyButton';
import { CoinBadge } from '../components/ui/CoinBadge';
import { LockOverlay } from '../components/ui/LockOverlay';
import type { RootStackParamList } from '../navigation/types';
import { glass } from '../theme/glass';
import type { Category } from '../types/category';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Categories'>;

// ─── Per-category card ────────────────────────────────────────────────────────

const getCategoryStyles = (id: string) => {
  switch(id) {
    case 'general': return { bg: ['rgba(88, 68, 157, 0.95)', 'rgba(46, 32, 97, 0.95)'], accent: '#818CF8' };
    case 'animals': return { bg: ['rgba(54, 117, 78, 0.95)', 'rgba(23, 73, 44, 0.95)'], accent: '#84CC16' };
    case 'kitchen': return { bg: ['rgba(174, 98, 58, 0.95)', 'rgba(122, 60, 28, 0.95)'], accent: '#F59E0B' };
    case 'islamic': return { bg: ['rgba(32, 136, 152, 0.95)', 'rgba(18, 88, 103, 0.95)'], accent: '#06B6D4' };
    default: return { bg: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'], accent: '#94A3B8' };
  }
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = React.memo(({ category }) => {
  const navigation = useNavigation<NavProp>();
  const categoryProgress = useGameStore((s) => s.categoryProgress[category.id]);
  const totalCoins = useGameStore((s) => s.totalCoins);
  const unlockCategory = useGameStore((s) => s.unlockCategory);

  const isUnlocked = categoryProgress?.isUnlocked ?? false;
  const completedLevels = categoryProgress?.completedLevels ?? [];
  const totalLevels = DISPLAY_LEVEL_COUNT;

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const coinBadgeShake = useRef(new Animated.Value(0)).current;
  const unlockScale = useRef(new Animated.Value(1)).current;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const shakeCoinBadge = () => {
    Animated.sequence([
      Animated.timing(coinBadgeShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(coinBadgeShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(coinBadgeShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(coinBadgeShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(coinBadgeShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleConfirmUnlock = useCallback(() => {
    setConfirmVisible(false);
    const result = unlockCategory(category.id, category.cost);
    if (result.success) {
      Animated.sequence([
        Animated.spring(unlockScale, { toValue: 1.03, useNativeDriver: true }),
        Animated.spring(unlockScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
      showToast('تم فتح الفئة! 🎉');
    } else if (result.reason === 'INSUFFICIENT_COINS') {
      shakeCoinBadge();
      showToast('عملاتك غير كافية — أكمل مستويات أخرى لجمع العملات');
    }
  }, [category.id, category.cost, unlockCategory, unlockScale]);

  const handlePlay = useCallback(() => {
    navigation.navigate('LevelSelection', { categoryId: category.id });
  }, [navigation, category.id]);

  const handleLockedPress = useCallback(() => {
    setConfirmVisible(true);
  }, []);

  
  const cardTheme = getCategoryStyles(category.id);
  const progress = totalLevels > 0 ? (completedLevels.length / totalLevels) * 100 : 0;

  return (
    <>
      <Animated.View style={{ transform: [{ scale: unlockScale }], marginBottom: 20 }}>
        <TouchableOpacity
          activeOpacity={isUnlocked ? 0.85 : 1}
          onPress={isUnlocked ? handlePlay : handleLockedPress}
        >
          <View style={styles.customCardWrapper}>
            <LinearGradient colors={cardTheme.bg as [string, string]} style={styles.customCardGradient}>
              
              {/* Large BG Icon */}
              <Icon name={category.icon} size={160} color="rgba(255,255,255,0.08)" style={styles.customCardBgIcon} />

              <View style={styles.customCardTopContent}>
                {/* Right side: Icon Circle */}
                <View style={[styles.customCardIconCircle, { backgroundColor: cardTheme.accent }]}>
                   <Icon name={category.icon} size={32} color="#FFF" style={{textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}} />
                   {!isUnlocked && <LockOverlay />}
                </View>

                {/* Left of Icon: Text Content */}
                <View style={styles.customCardTextContainer}>
                  <Text style={styles.customCardTitle}>{category.title}</Text>
                  <Text style={styles.customCardDesc}>{category.description}</Text>
                  
                  {isUnlocked && totalLevels > 0 ? (
                    <>
                      <Text style={styles.customCardProgressText}>{completedLevels.length}/{totalLevels} مكتملة</Text>
                      <View style={styles.customCardProgressTrack}>
                        <View style={[styles.customCardProgressFill, { width: `${progress}%`, backgroundColor: cardTheme.accent }]} />
                      </View>
                    </>
                  ) : null}
                </View>
              </View>

              {/* Bottom: Action Button */}
              {isUnlocked ? (
                <LinearGradient colors={['#22C55E', '#15803D']} style={styles.customCardPlayBtn}>
                  <View style={{flexDirection: 'row-reverse', alignItems: 'center', gap: 6}}>
                    <Text style={styles.customCardPlayText}>العب</Text>
                    <Icon name="play" size={20} color="#FFF" />
                  </View>
                </LinearGradient>
              ) : (
                <LinearGradient colors={['#475569', '#334155']} style={styles.customCardPlayBtn}>
                  <View style={{flexDirection: 'row-reverse', alignItems: 'center', gap: 6}}>
                    <Text style={styles.customCardPlayText}>افتح مقابل {category.cost} عملة</Text>
                    <Icon name="lock-closed" size={18} color="#FFF" />
                  </View>
                </LinearGradient>
              )}
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Confirmation modal */}
{/* Confirmation modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {`هل تريد فتح فئة "${category.title}" مقابل ${category.cost} عملة؟`}
            </Text>
            <Text style={styles.modalBalance}>رصيدك: {totalCoins} عملة</Text>
            <View style={styles.modalBtns}>
              <GlossyButton
                title="تأكيد"
                variant="unlock"
                onPress={handleConfirmUnlock}
                style={styles.modalBtn}
              />
              <GlossyButton
                title="إلغاء"
                variant="disabled"
                onPress={() => setConfirmVisible(false)}
                style={styles.modalBtn}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </>
  );
});


// ─── CategoriesScreen ─────────────────────────────────────────────────────────

const AudioControls = () => {
  const isMusicEnabled = useGameStore(s => s.isMusicEnabled);
  const isSfxEnabled = useGameStore(s => s.isSfxEnabled);
  const toggleMusic = useGameStore(s => s.toggleMusic);
  const toggleSfx = useGameStore(s => s.toggleSfx);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <TouchableOpacity onPress={toggleMusic} style={styles.audioBtn}>
        <LinearGradient colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']} style={styles.audioBtnGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
          <Icon name={isMusicEnabled ? "musical-notes" : "musical-notes-outline"} size={20} color={isMusicEnabled ? "#4ade80" : "#94a3b8"} />
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSfx} style={styles.audioBtn}>
        <LinearGradient colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']} style={styles.audioBtnGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
          <Icon name={isSfxEnabled ? "volume-medium" : "volume-mute"} size={20} color={isSfxEnabled ? "#4ade80" : "#94a3b8"} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export const CategoriesScreen: React.FC = () => (
  <ScreenBackground>
    {/* Header */}
    <View style={styles.header}>
      <View style={{ flexDirection: 'column', gap: 10 }}>
        <HeaderLogo width={140} height={60} />
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <CoinBadge />
        <AudioControls />
      </View>
    </View>
    <Text style={styles.subtitle}>اختر فئة لتبدأ</Text>

    <ScrollView style={{ flex: 1 }}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      {CATEGORIES.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </ScrollView>
    <GlobalBannerAd />
  </ScreenBackground>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  customCardWrapper: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  customCardGradient: {
    padding: 16,
    paddingBottom: 20,
  },
  customCardBgIcon: {
    position: 'absolute',
    left: -20,
    top: 10,
    opacity: 0.8,
  },
  customCardTopContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
  },
  customCardIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginLeft: 15,
  },
  customCardTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  customCardTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 22,
    color: '#FFF',
    textAlign: 'right',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  customCardDesc: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: '#E2E8F0',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 2,
    marginBottom: 10,
  },
  customCardProgressText: {
    fontFamily: glass.fonts.regular,
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
    alignSelf: 'flex-start'
  },
  customCardProgressTrack: {
    width: '95%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  customCardProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  customCardPlayBtn: {
    width: '95%',
    alignSelf: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  customCardPlayText: {
    fontFamily: glass.fonts.bold,
    fontSize: 20,
    color: '#FFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: glass.space.lg,
    paddingTop: glass.space.md,
    paddingBottom: glass.space.sm,
  },
  headerTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 22,
    color: glass.textPrimary,
  },
  subtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: glass.textSecondary,
    textAlign: 'right',
    paddingHorizontal: glass.space.lg,
    marginBottom: glass.space.md,
    writingDirection: 'rtl',
  },
  audioBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    ...glass.shadow,
  },
  audioBtnGradient: {
    padding: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: glass.space.lg,
    paddingBottom: glass.space.xxl,
  },
  card: {
    marginBottom: glass.space.lg,
    padding: glass.space.lg,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: glass.space.md,
    gap: glass.space.md,
  },
  iconBubbleWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    alignItems: 'flex-start',
  },
  catTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 20,
    color: glass.textPrimary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  catDesc: {
    fontFamily: glass.fonts.regular,
    fontSize: 13,
    color: glass.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 2,
  },
  progressRow: {
    width: '100%',
    marginTop: glass.space.sm,
    alignItems: 'flex-start',
  },
  progressLabel: {
    fontFamily: glass.fonts.regular,
    fontSize: 12,
    color: glass.textSecondary,
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  btnRow: {
    alignItems: 'stretch',
  },
  actionBtn: {
    width: '100%',
  },
  // Toast
  toastBar: {
    backgroundColor: 'rgba(74,222,128,0.25)',
    borderRadius: 12,
    padding: glass.space.sm,
    marginBottom: glass.space.sm,
    borderWidth: 1,
    borderColor: glass.success + '66',
  },
  toastText: {
    color: glass.textPrimary,
    fontFamily: glass.fonts.regular,
    fontSize: 13,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: glass.space.xl,
  },
  modalCard: {
    width: '100%',
    padding: glass.space.xl,
  },
  modalTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 18,
    color: glass.textPrimary,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: glass.space.sm,
  },
  modalBalance: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: glass.textSecondary,
    textAlign: 'center',
    marginBottom: glass.space.lg,
    writingDirection: 'rtl',
  },
  modalBtns: {
    gap: glass.space.sm,
  },
  modalBtn: {
    width: '100%',
  },
});
