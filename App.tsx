import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useGameStore } from './src/store/useGameStore';
import { initAudio } from './src/utils/AudioManager';
import { LandingScreen } from './src/screens/LandingScreen';
import { CategoriesScreen } from './src/screens/HomeScreen';
import { LevelSelectionScreen } from './src/screens/LevelSelectionScreen';
import { GameScreen } from './src/screens/GameScreen';
import type { RootStackParamList } from './src/navigation/types';
import { glass } from './src/theme/glass';

import { SplashScreen } from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const [hydrated, setHydrated] = useState(false);
  const [minSplashTime, setMinSplashTime] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashTime(true);
    }, 2500);

    // Zustand persist v5: subscribe to hydration
    const unsubFinish = useGameStore.persist.onFinishHydration(() => {
      // Sync any categories added after the user's last install
      useGameStore.getState().syncCategories();
      
      setHydrated(true);
      initAudio();
    });

    // Fallback: if already hydrated before this component mounted
    if (useGameStore.persist.hasHydrated()) {
      useGameStore.getState().syncCategories();
      
      setHydrated(true);
      initAudio();
    }

    return () => {
      clearTimeout(timer);
      unsubFinish();
    };
  }, []);

  const isAppReady = hydrated && minSplashTime;

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: glass.bgGradient[0] }}>
      {hydrated && (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_left',
              contentStyle: { backgroundColor: glass.bgGradient[0] },
            }}
          >
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      {showSplash && (
        <SplashScreen 
          isReady={isAppReady} 
          onFinish={() => setShowSplash(false)} 
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontFamily: 'ElMessiri-Bold',
    fontSize: 32,
    color: '#fff',
    writingDirection: 'rtl',
  },
});

export default App;
