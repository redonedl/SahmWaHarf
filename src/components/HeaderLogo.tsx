import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  width?: number;
  height?: number;
  style?: any;
}

export const HeaderLogo: React.FC<Props> = ({ width = 180, height = 80, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
