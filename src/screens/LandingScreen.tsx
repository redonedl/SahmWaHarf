import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { HeroLogo } from '../components/HeroLogo';
import { glass } from '../theme/glass';

const { width } = Dimensions.get('window');

const FeatureItem = ({ icon, title, color }: { icon: string, title: string, color: string }) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIconContainer, { borderColor: color, shadowColor: color }]}>
      <LinearGradient 
        colors={[`${color}40`, `${color}10`]} 
        style={StyleSheet.absoluteFillObject}
      />
      <Icon name={icon} size={28} color={color} />
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
  </View>
);

export const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePlay = () => {
    navigation.navigate('Categories');
  };

  return (
    <LinearGradient colors={['#1F0B5A', '#0A002A']} style={styles.container}>
      <View style={styles.content}>
        <HeroLogo />
        
        <Text style={styles.title}>سهم وحرف</Text>
        <Text style={styles.subtitle}>لعبة كلمات ممتعة ومسلية</Text>

        <View style={styles.featuresRow}>
          <FeatureItem icon="bulb" title="اكتشف\nكلمات متنوعة" color="#EC4899" />
          <FeatureItem icon="trophy" title="تحدى\nمستويات جديدة" color="#F59E0B" />
          <FeatureItem icon="extension-puzzle" title="طور\nمعرفتك" color="#10B981" />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handlePlay} style={styles.playButtonWrapper}>
          <LinearGradient 
            colors={['#10B981', '#059669']} 
            start={{x: 0, y: 0}} end={{x: 0, y: 1}}
            style={styles.playButton}
          >
            <View style={styles.playButtonInner}>
              <Text style={styles.playButtonText}>ابدأ اللعب</Text>
              <Icon name="play" size={24} color="#FFF" style={{ marginLeft: 8 }} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: -20,
  },
  title: {
    fontFamily: glass.fonts.bold,
    fontSize: 48,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 242, 254, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 16,
    color: '#E2E8F0',
    marginTop: 5,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    gap: 15,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  featureTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 13,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  playButtonWrapper: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  playButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#34D399',
  },
  playButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontFamily: glass.fonts.bold,
    fontSize: 22,
    color: '#FFF',
  }
});
