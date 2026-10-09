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
        colors={[`${color}20`, `${color}05`]} 
        style={StyleSheet.absoluteFillObject}
      />
      <Icon name={icon} size={32} color={color} style={{
        textShadowColor: color,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      }} />
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
    <View style={styles.container}>
      {/* Deep Background */}
      <LinearGradient colors={['#170535', '#0B1841', '#060B26']} style={StyleSheet.absoluteFillObject} />
      
      {/* Background Glowing Orbs */}
      <View style={[styles.orb, { top: -50, right: -50, width: 250, height: 250, backgroundColor: '#3B0764' }]} />
      <View style={[styles.orb, { top: 250, left: -100, width: 300, height: 300, backgroundColor: '#1E3A8A' }]} />
      <View style={[styles.orb, { bottom: -100, right: -50, width: 200, height: 200, backgroundColor: '#312E81' }]} />
      
      <View style={styles.content}>
        <View style={styles.heroWrapper}>
          <HeroLogo />
        </View>
        
        <Text style={styles.title}>سهم وحرف</Text>
        <Text style={styles.subtitle}>لعبة كلمات ممتعة ومسلية</Text>

        <LinearGradient 
          colors={['rgba(0,242,254,0)', 'rgba(0,242,254,1)', 'rgba(0,242,254,0)']} 
          start={{x: 0, y: 0}} end={{x: 1, y: 0}}
          style={styles.divider} 
        />

        <View style={styles.featuresRow}>
          <FeatureItem icon="bulb" title="اكتشف\nكلمات متنوعة" color="#F43F5E" />
          <FeatureItem icon="trophy" title="تحدى\nمستويات جديدة" color="#FBBF24" />
          <FeatureItem icon="extension-puzzle" title="طور\nمعرفتك" color="#34D399" />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handlePlay} style={styles.playButtonWrapper}>
          <LinearGradient 
            colors={['#34D399', '#10B981', '#059669']} 
            start={{x: 0, y: 0}} end={{x: 0, y: 1}}
            style={styles.playButton}
          >
            <View style={styles.playButtonInner}>
              <Text style={styles.playButtonText}>ابدأ اللعب</Text>
              <Icon name="play" size={24} color="#FFF" style={{ marginRight: 8 }} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#060B26',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
    transform: [{ scale: 1.5 }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 40,
  },
  heroWrapper: {
    marginBottom: 10,
  },
  title: {
    fontFamily: glass.fonts.bold,
    fontSize: 52,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 242, 254, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 18,
    color: '#E2E8F0',
    marginTop: 5,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  featuresRow: {
    flexDirection: 'row-reverse', // To match RTL layout from image
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    gap: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  featureTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 13,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  playButtonWrapper: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
  },
  playButton: {
    width: '100%',
    height: 65,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  playButtonInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontFamily: glass.fonts.bold,
    fontSize: 24,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  }
});
