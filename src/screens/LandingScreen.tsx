import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { glass } from '../theme/glass';

const { width } = Dimensions.get('window');

export const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1800, useNativeDriver: false }),
      ])
    ).start();
  }, [glowAnim]);

  const glowRadius = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 22] });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  const handlePlay = () => {
    navigation.navigate('Categories');
  };

  return (
    <ImageBackground 
      source={require('../assets/images/landing_bg.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          
          <View style={styles.contentWrapper}>
            
            {/* TOP SECTION */}
            <View style={styles.topSection}>
              <Image 
                source={require('../assets/images/logo.png')}
                style={styles.mainLogo}
                resizeMode="contain"
              />
              <Text style={styles.title}>ألعاب متنوعة للمبتدئين</Text>
              <Text style={styles.subtitle}>اكتشف الكلمات • نمي معرفتك • استمتع بالتحدي</Text>
            </View>

            {/* MIDDLE: 3D Center Logo */}
            <View style={styles.middleSection}>
              <Image 
                source={require('../assets/images/center_logo.jpg')}
                style={styles.centerLogoImage}
                resizeMode="contain"
              />
            </View>

            {/* BOTTOM SECTION */}
            <View style={styles.bottomSection}>
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
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B26',
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  middleSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  centerLogoImage: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: 20,
  },
  mainLogo: {
    width: width * 0.75,
    height: 110,
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
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: '#E2E8F0',
    textAlign: 'center',
  },
  playButtonWrapper: {
    width: '85%',
    marginBottom: 25,
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
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesImage: {
    width: '100%',
    height: '100%',
  },
});
