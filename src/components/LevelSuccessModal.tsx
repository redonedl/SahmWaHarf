import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated, Modal, Platform } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { useGameStore } from '../store/useGameStore';
import AnalyticsManager from '../utils/AnalyticsManager';
import { useInterstitialAdManager } from '../hooks/useInterstitialAdManager';
import { theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onNextLevel: () => void;
  onMainMenu: () => void;
  coinsEarned?: number;
}

export const LevelSuccessModal = ({ visible, onNextLevel, onMainMenu, coinsEarned = 100 }: Props) => {
  const scale = useRef(new Animated.Value(0)).current;
  const { isLoaded, showAd, addClosedListener } = useInterstitialAdManager();
  const levelsPlayedSinceLastAd = useGameStore(s => s.levelsPlayedSinceLastAd);
  const incrementLevelsPlayed = useGameStore(s => s.incrementLevelsPlayed);
  const resetLevelsPlayed = useGameStore(s => s.resetLevelsPlayed);

  const handleAction = (action: () => void) => {
    if (levelsPlayedSinceLastAd >= 2 && isLoaded) {
      const unsubscribe = addClosedListener(() => {
        action();
        unsubscribe();
      });
      showAd();
      AnalyticsManager.logAdWatched('interstitial');
      resetLevelsPlayed();
    } else {
      incrementLevelsPlayed();
      action();
    }
  };
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 90,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="auto">
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(0,0,0,0.8)"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.8)' }]} />
        )}
        
        {visible && (
          <ConfettiCannon
            count={100}
            origin={{ x: width / 2, y: -20 }}
            autoStart={true}
            fadeOut={true}
            colors={[theme.colors.coinGold, theme.colors.levelUnlockedStart, '#ffffff', '#FF00FF']}
          />
        )}
        
        <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <Icon name="star" size={40} color={theme.colors.coinGold} solid style={styles.starShadow} />
            </View>
            <Text style={styles.title}>أحسنت!</Text>
            <Text style={styles.subtitle}>مرحلة مكتملة بنجاح</Text>

            <View style={styles.rewardContainer}>
              <Text style={styles.rewardText}>{coinsEarned}</Text>
              <Icon name="coins" size={28} color={theme.colors.coinGold} style={styles.starShadow} />
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.buttonWrapper} onPress={() => handleAction(onNextLevel)}>
                <LinearGradient
                  colors={[theme.colors.levelUnlockedStart, theme.colors.levelUnlockedEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>المرحلة التالية</Text>
                  <Icon name="arrow-left" size={16} color="#ffffff" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonWrapper} onPress={() => handleAction(onMainMenu)}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButton}
                >
                  <Text style={styles.menuButtonText}>القائمة الرئيسية</Text>
                  <Icon name="home" size={16} color="rgba(255, 255, 255, 0.8)" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 25, 45, 0.85)', // Solid fallback background for Android Modal
  },
  cardWrapper: {
    width: width * 0.85,
    borderRadius: 24,
    shadowColor: theme.colors.levelUnlockedStart,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // Ensure card is opaque
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  starShadow: {
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  rewardText: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.coinGold,
    marginHorizontal: 10,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  buttonsContainer: {
    width: '100%',
  },
  buttonWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: theme.colors.levelUnlockedStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});
