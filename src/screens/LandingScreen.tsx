import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { glass } from '../theme/glass';
import { HeroLogo } from '../components/HeroLogo';

const { width } = Dimensions.get('window');

const CategoryItem = ({ icon, title, subtitle, color }: { icon: string, title: string, subtitle: string, color: string }) => (
  <View style={styles.categoryCard}>
    <View style={[styles.categoryIconContainer, { borderColor: color, shadowColor: color }]}>
      <LinearGradient 
        colors={[`${color}30`, `${color}10`]} 
        style={StyleSheet.absoluteFillObject}
      />
      <Icon name={icon} size={28} color={color} style={{
        textShadowColor: color,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      }} />
    </View>
    <Text style={styles.categoryTitle}>{title}</Text>
    <Text style={styles.categorySubtitle}>{subtitle}</Text>
  </View>
);

export const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePlay = () => {
    navigation.navigate('Categories');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#170535', '#0B1841', '#060B26']} style={StyleSheet.absoluteFillObject} />
      
      {/* Background Glowing Orbs */}
      <View style={[styles.orb, { top: -50, right: -50, width: 250, height: 250, backgroundColor: '#3B0764' }]} />
      <View style={[styles.orb, { top: 250, left: -100, width: 300, height: 300, backgroundColor: '#1E3A8A' }]} />
      <View style={[styles.orb, { bottom: -100, right: -50, width: 200, height: 200, backgroundColor: '#312E81' }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Image Logo in Middle Top */}
        <Image 
          source={require('../assets/images/logo.png')}
          style={styles.mainLogo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>ألعاب متنوعة للمبتدئين</Text>
        <Text style={styles.subtitle}>اكتشف الكلمات • نمي معرفتك • استمتع بالتحدي</Text>

        {/* 3D Podium & HeroLogo */}
        <View style={styles.podiumContainer}>
           <View style={styles.podiumBase} />
           <View style={styles.podiumTop} />
           <HeroLogo />
        </View>

        {/* Play Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handlePlay} style={styles.playButtonWrapper}>
          <LinearGradient 
            colors={['#10B981', '#059669']} 
            start={{x: 0, y: 0}} end={{x: 0, y: 1}}
            style={styles.playButton}
          >
            <View style={styles.playButtonInner}>
              <Text style={styles.playButtonText}>ابدأ اللعب</Text>
              <Icon name="play" size={24} color="#FFF" style={{ marginRight: 8 }} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Category Grid */}
        <View style={styles.categoriesRow}>
          <CategoryItem icon="bulb" title="معلومات عامة" subtitle="اختبر معرفتك" color="#FBBF24" />
          <CategoryItem icon="paw" title="عالم الحيوان" subtitle="من الأسد إلى النملة" color="#34D399" />
          <CategoryItem icon="restaurant" title="مطبخ وأكلات" subtitle="أطباق عربية وعالمية" color="#F97316" />
          <CategoryItem icon="moon" title="تاريخ إسلامي" subtitle="رحلة عبر العصور" color="#06B6D4" />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B26',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
    transform: [{ scale: 1.5 }],
  },
  mainLogo: {
    width: width * 0.75,
    height: 120,
    marginBottom: 5,
  },
  title: {
    fontFamily: glass.fonts.bold,
    fontSize: 22,
    color: '#ffffff',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: '#E2E8F0',
    marginTop: 5,
    textAlign: 'center',
  },
  podiumContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 250,
    marginTop: 15,
    marginBottom: 10,
  },
  podiumBase: {
    position: 'absolute',
    bottom: 20,
    width: 280,
    height: 60,
    borderRadius: 140,
    backgroundColor: '#1E1B4B',
    borderWidth: 2,
    borderColor: '#D946EF',
    shadowColor: '#D946EF',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  podiumTop: {
    position: 'absolute',
    bottom: 30,
    width: 230,
    height: 50,
    borderRadius: 115,
    backgroundColor: '#0B1B4D',
    borderWidth: 2,
    borderColor: '#00F2FE',
    shadowColor: '#00F2FE',
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  playButtonWrapper: {
    width: '85%',
    marginBottom: 30,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  playButton: {
    width: '100%',
    height: 65,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
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
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoriesRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  categoryTitle: {
    fontFamily: glass.fonts.bold,
    fontSize: 10,
    color: '#FFF',
    textAlign: 'center',
  },
  categorySubtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 8,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 2,
  },
});
