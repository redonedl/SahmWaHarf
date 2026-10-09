import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { glass } from '../theme/glass';
import { HeroLogo } from '../components/HeroLogo';

const { width } = Dimensions.get('window');

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

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Main Image Logo in Middle Top */}
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.mainLogo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>ألعاب متنوعة للمبتدئين</Text>
          <Text style={styles.subtitle}>اكتشف الكلمات • نمي معرفتك • استمتع بالتحدي</Text>

          {/* 3D Center Image Logo */}
          <View style={styles.podiumContainer}>
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

          {/* Image Category Grid Replacement */}
          <View style={styles.categoriesImageContainer}>
            <Image 
              source={require('../assets/images/categories.png')}
              style={styles.categoriesImage}
              resizeMode="contain"
            />
          </View>

        </ScrollView>
      </SafeAreaView>
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
    transform: [{ scale: 1.5 }],
  },
  mainLogo: {
    width: width * 0.65,
    height: 90,
    marginBottom: 5,
  },
  title: {
    fontFamily: glass.fonts.bold,
    fontSize: 20,
    color: '#ffffff',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 13,
    color: '#E2E8F0',
    textAlign: 'center',
    marginBottom: 20,
  },
  podiumContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 210,
    height: 210,
    marginTop: 10,
    marginBottom: 35,
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
  categoriesImageContainer: {
    width: '95%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesImage: {
    width: '100%',
    height: '100%',
  },
});
