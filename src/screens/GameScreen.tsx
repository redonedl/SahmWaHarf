import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getLevel, getActualFileCount, DISPLAY_LEVEL_COUNT } from '../assets/levels/index';
import { getCategoryById } from '../data/categories';
import { useGameStore } from '../store/useGameStore';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { GlossyButton } from '../components/ui/GlossyButton';
import { CoinBadge } from '../components/ui/CoinBadge';
import { GameBoard } from '../components/GameBoard';
import { CustomArabicKeyboard } from '../components/CustomArabicKeyboard';
import type { RootStackParamList } from '../navigation/types';
import { glass } from '../theme/glass';
import { useRewardedHintAd } from '../hooks/useRewardedHintAd';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type RouteType = RouteProp<RootStackParamList, 'Game'>;


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

export const GameScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { categoryId, levelId } = route.params;
  const mappedLevelId = useGameStore((s) => s.playlists?.[categoryId]?.[levelId - 1] ?? levelId);
  const levelData = getLevel(categoryId, mappedLevelId);

  const category = getCategoryById(categoryId);

  const loadLevel = useGameStore((s) => s.loadLevel);
  const earnCoins = useGameStore((s) => s.earnCoins);
  const buyHint = useGameStore((s) => s.buyHint);
  const inputLetter = useGameStore((s) => s.inputLetter);
  const backspaceLetter = useGameStore((s) => s.backspaceLetter);
  const totalCoins = useGameStore((s) => s.totalCoins);
  const isLevelCompleted = useGameStore((s) => s.isLevelCompleted);
  const showSuccessModal = useGameStore((s) => s.showSuccessModal);
  const dismissSuccessModal = useGameStore((s) => s.dismissSuccessModal);
  const wasAlreadyCompleted = useGameStore((s) => s.wasAlreadyCompleted);
  const isLevelUnlocked = useGameStore((s) => s.isLevelUnlocked);

  const { isLoaded, showAd } = useRewardedHintAd(earnCoins);

  // Guard: not unlocked
  useEffect(() => {
    if (!isLevelUnlocked(categoryId, levelId)) {
      navigation.goBack();
    }
  }, [categoryId, levelId, isLevelUnlocked, navigation]);

  // Load level data
  useEffect(() => {
    
    if (!levelData) {
      // Level file not found — stay on screen but show error state
      return;
    }
    // The board is keyed with `${categoryId}-${levelId}` so it resets on navigate
    loadLevel(levelData as any, categoryId, levelId);
  }, [categoryId, levelId, mappedLevelId, loadLevel]);

  const handleBuyHint = () => {
    const success = buyHint();
    if (!success) {
      Alert.alert('رصيد غير كافٍ', 'ليس لديك ما يكفي من العملات.');
    }
  };

  const handleNextLevel = () => {
    dismissSuccessModal();
    navigation.replace('Game', { categoryId, levelId: levelId + 1 });
  };

  const handleLevelList = () => {
    dismissSuccessModal();
    navigation.navigate('LevelSelection', { categoryId });
  };

  const handleCategories = () => {
    dismissSuccessModal();
    navigation.navigate('Categories');
  };

  
  const totalLevels = DISPLAY_LEVEL_COUNT;
  const hasNextLevel = levelId + 1 <= totalLevels;

  if (!levelData) {
    return (
      <ScreenBackground>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>المستوى غير موجود</Text>
          <GlossyButton title="رجوع" icon="arrow-forward" onPress={() => navigation.goBack()} />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-forward" size={22} color={glass.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category?.title ?? categoryId} — المستوى {levelId}
        </Text>
        <CoinBadge />
      </View>

      {/* Board — keyed so it resets when level changes */}
      <View style={styles.boardWrapper} key={`${categoryId}-${levelId}`}>
        <GameBoard />
      </View>

      {/* Actions or completed banner */}
      {!isLevelCompleted ? (
        <>
          <View style={styles.hintRow}>
            <AudioControls />
            <TouchableOpacity style={styles.hintBtn} onPress={handleBuyHint}>
              <LinearGradient
                colors={[glass.btnPlay[0], glass.btnPlay[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.hintGradient}
              >
                <Icon name="sparkles" size={16} color="#fff" />
                <Text style={styles.hintLabel}>كشف حرف</Text>
                <View style={styles.costTag}>
                  <Text style={styles.costText}>-20</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hintBtn, !isLoaded && styles.hintBtnDisabled]}
              onPress={showAd}
              disabled={!isLoaded}
            >
              <LinearGradient
                colors={isLoaded ? ['#10b981', '#059669'] : glass.btnDisabled}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.hintGradient}
              >
                <Icon name="play-circle" size={16} color="#fff" />
                <Text style={styles.hintLabel}>شاهد إعلان</Text>
                <View style={styles.costTag}>
                  <Text style={styles.costText}>+50</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.keyboardWrapper}>
            <CustomArabicKeyboard
              onKeyPress={inputLetter}
              onBackspace={backspaceLetter}
              onHintPress={handleBuyHint}
            />
          </View>
        </>
      ) : (
        <View style={styles.completedBanner}>
          <Icon name="checkmark-circle" size={36} color={glass.success} />
          <Text style={styles.completedText}>المرحلة مكتملة!</Text>
          <GlossyButton
            title="التالي"
            icon="arrow-back"
            onPress={() => navigation.replace('Game', { categoryId, levelId: levelId + 1 })}
            variant="play"
            style={styles.completedBtn}
          />
        </View>
      )}

      {/* Level Complete Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassCard style={styles.successModal}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>أحسنت!</Text>
            <Text style={styles.successCoins}>
              {wasAlreadyCompleted
                ? 'مستوى مُعاد — لا عملات إضافية'
                : '+50 عملة'}
            </Text>
            <Text style={styles.successBalance}>رصيدك: {totalCoins} عملة</Text>

            <View style={styles.successBtns}>
              {hasNextLevel && (
                <GlossyButton
                  title="المستوى التالي"
                  icon="arrow-back"
                  variant="play"
                  onPress={handleNextLevel}
                  style={styles.successBtn}
                />
              )}
              <GlossyButton
                title="قائمة المستويات"
                icon="list"
                variant="unlock"
                onPress={handleLevelList}
                style={styles.successBtn}
              />
              <GlossyButton
                title="الفئات"
                icon="grid"
                variant="disabled"
                onPress={handleCategories}
                style={styles.successBtn}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  audioBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    ...glass.shadow,
  },
  audioBtnGradient: {
    padding: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: glass.space.lg,
    paddingVertical: glass.space.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 16,
    color: glass.textPrimary,
    flex: 1,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginHorizontal: glass.space.sm,
  },
  boardWrapper: {
    flex: 1,
  },
  hintRow: {
    flexDirection: 'row',
    paddingHorizontal: glass.space.lg,
    gap: glass.space.sm,
    marginBottom: glass.space.sm,
  },
  hintBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hintBtnDisabled: { opacity: 0.6 },
  hintGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  hintLabel: {
    fontFamily: glass.fonts.bold,
    color: '#fff',
    fontSize: 14,
  },
  costTag: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  costText: {
    color: glass.gold,
    fontFamily: glass.fonts.bold,
    fontSize: 12,
  },
  keyboardWrapper: {
    height: 230,
    width: '100%',
  },
  // Completed inline banner
  completedBanner: {
    alignItems: 'center',
    padding: glass.space.lg,
    gap: glass.space.md,
  },
  completedText: {
    fontFamily: glass.fonts.bold,
    fontSize: 22,
    color: glass.success,
  },
  completedBtn: {
    width: 200,
  },
  // Error state
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: glass.space.lg,
  },
  errorText: {
    fontFamily: glass.fonts.bold,
    fontSize: 20,
    color: glass.danger,
    writingDirection: 'rtl',
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: glass.space.xl,
  },
  successModal: {
    width: '100%',
    padding: glass.space.xl,
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: glass.space.sm,
  },
  successTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 26,
    color: glass.textPrimary,
    marginBottom: glass.space.xs,
    writingDirection: 'rtl',
  },
  successCoins: {
    fontFamily: glass.fonts.bold,
    fontSize: 18,
    color: glass.gold,
    marginBottom: glass.space.xs,
    writingDirection: 'rtl',
  },
  successBalance: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: glass.textSecondary,
    marginBottom: glass.space.lg,
    writingDirection: 'rtl',
  },
  successBtns: {
    width: '100%',
    gap: glass.space.sm,
  },
  successBtn: {
    width: '100%',
  },
});
