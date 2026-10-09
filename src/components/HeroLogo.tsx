import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const HeroLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/center_logo.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    zIndex: 10,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30, // Soften the JPG corners to blend with background
  }
});
