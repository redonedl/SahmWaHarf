import React, { useCallback, useRef } from 'react';
import {
  View,
  Dimensions,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getCategoryById } from '../data/categories';
import { getActualFileCount, DISPLAY_LEVEL_COUNT } from '../assets/levels/index';
import { useGameStore } from '../store/useGameStore';
import { GlobalBannerAd } from '../components/GlobalBannerAd';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { CoinBadge } from '../components/ui/CoinBadge';
import { LockOverlay } from '../components/ui/LockOverlay';
import type { RootStackParamList } from '../navigation/types';
import { glass } from '../theme/glass';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'LevelSelection'>;
type RouteType = RouteProp<RootStackParamList, 'LevelSelection'>;

interface TileProps {
  levelId: number;
  categoryId: string;
  isFirst: boolean;
}

const LevelTile: React.FC<TileProps> = React.memo(({ levelId, categoryId, isFirst }) => {
  const navigation = useNavigation<NavProp>();
  const isUnlocked = useGameStore((s) => s.isLevelUnlocked(categoryId, levelId));
  const isCompleted = useGameStore((s) => s.hasCompletedLevel(categoryId, levelId));
  const category = getCategoryById(categoryId);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for the next level to play
  React.useEffect(() => {
    if (isUnlocked && !isCompleted && isFirst) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [isUnlocked, isCompleted, isFirst, pulseAnim]);

  const handlePress = useCallback(() => {
    if (!isUnlocked) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      return;
    }
    navigation.navigate('Game', { categoryId, levelId });
  }, [isUnlocked, navigation, categoryId, levelId, shakeAnim]);

  const tileContent = isUnlocked ? (
    <LinearGradient
      colors={
        isCompleted
          ? (category?.gradient ?? [glass.btnPlay[0], glass.btnPlay[1]])
          : [glass.surface.backgroundColor, 'rgba(255,255,255,0.08)']
      }
      style={[styles.tile, isFirst && !isCompleted && styles.tilePulse]}
    >
      <Text style={[styles.levelNum, isCompleted && styles.levelNumCompleted]}>
        {levelId}
      </Text>
      {isCompleted && (
        <Icon
          name="checkmark-circle"
          size={14}
          color={glass.success}
          style={styles.checkIcon}
        />
      )}
    </LinearGradient>
  ) : (
    <View style={[styles.tile, styles.tileLocked]}>
      <LockOverlay />
      <Text style={styles.levelNumLocked}>{levelId}</Text>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.tileWrapper,
        { transform: [{ scale: isFirst && isUnlocked && !isCompleted ? pulseAnim : new Animated.Value(1) }] },
        { transform: [{ translateX: shakeAnim }] },
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        {tileContent}
      </TouchableOpacity>
    </Animated.View>
  );
});

export const LevelSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { categoryId } = route.params;

  const category = getCategoryById(categoryId);
  const categoryProgress = useGameStore((s) => s.categoryProgress[categoryId]);
  const isUnlocked = categoryProgress?.isUnlocked ?? false;
  const ensurePlaylist = useGameStore(s => s.ensurePlaylist);

  React.useEffect(() => {
    if (isUnlocked) {
      ensurePlaylist(categoryId, getActualFileCount(categoryId));
    }
  }, [isUnlocked, categoryId, ensurePlaylist]);

  // Guard: unknown or locked category
  React.useEffect(() => {
    if (!category || !isUnlocked) {
      navigation.goBack();
    }
  }, [category, isUnlocked, navigation]);

  if (!category || !isUnlocked) return null;

  const totalLevels = Math.min(getActualFileCount(categoryId), DISPLAY_LEVEL_COUNT);
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);
  const completedLevels = categoryProgress?.completedLevels ?? [];
  const unlockedLevels = categoryProgress?.unlockedLevels ?? [];

  // Find the first unlocked-not-completed level
  const firstNextLevelId = unlockedLevels.find((id) => !completedLevels.includes(id)) ?? -1;

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <LevelTile
        levelId={item}
        categoryId={categoryId}
        isFirst={item === firstNextLevelId}
      />
    ),
    [categoryId, firstNextLevelId],
  );

  return (
    <ScreenBackground>
      {/* Glass header */}
      <View style={styles.header}>
        {/* Back button (arrow points right = go back in RTL) */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-forward" size={22} color={glass.textPrimary} />
        </TouchableOpacity>

        {/* Category icon + title in center */}
        <View style={[styles.headerCenter, { gap: 8 }]}>
          <Icon name={category.icon} size={22} color={glass.textPrimary} />
          <Text style={styles.headerTitle}>{category.title}</Text>
        </View>

        <CoinBadge />
      </View>

      {/* Level grid — RTL: level 1 at top-right */}
      <FlatList style={{ flex: 1 }}
        data={levels}
        keyExtractor={(item) => item.toString()}
        numColumns={4}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.column}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Text style={styles.footer}>
            {completedLevels.length} من {totalLevels} مستويات مكتملة
          </Text>
        }
      />
    </ScreenBackground>
  );
};

const { width } = Dimensions.get('window');
const TILE_SIZE = (width - (glass.space.lg * 2) - (12 * 4)) / 4;

const styles = StyleSheet.create({
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 18,
    color: glass.textPrimary,
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: glass.space.lg,
    paddingBottom: glass.space.xl,
  },
  column: {
    flexDirection: 'row', // level 1 at top-right
    justifyContent: 'center',
    marginBottom: 0, // removed to balance vertical margins (tileWrapper already has margin: 6)
  },
  tileWrapper: {
    margin: 6,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: glass.surface.borderColor,
    overflow: 'hidden',
  },
  tilePulse: {
    borderColor: glass.textPrimary,
    borderWidth: 2,
  },
  tileLocked: {
    backgroundColor: 'rgba(0,0,0,0.25)', // Better filled square background to match active squares
  },
  levelNum: {
    fontFamily: glass.fonts.bold,
    fontSize: 24,
    color: glass.textPrimary,
  },
  levelNumCompleted: {
    color: '#fff',
  },
  levelNumLocked: {
    fontFamily: glass.fonts.bold,
    fontSize: 24,
    color: 'rgba(255,255,255,0.2)',
    
  },
  checkIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  footer: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: glass.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginTop: glass.space.md,
    paddingBottom: glass.space.xl,
  },
});
