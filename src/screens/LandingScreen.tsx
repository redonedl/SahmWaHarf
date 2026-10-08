import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { glass } from '../theme/glass';

export const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePlay = () => {
    navigation.navigate('Categories');
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/home_bg_new.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
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
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A002A',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // Aligns the footer to the bottom
    alignItems: 'center',
  },
  footer: {
    width: '100%',
    paddingHorizontal: 40,
    paddingBottom: 80, // High enough to clear the bottom books in the image
  },
  playButtonWrapper: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  playButton: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#34D399',
  },
  playButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontFamily: glass.fonts.bold,
    fontSize: 24,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  }
});
