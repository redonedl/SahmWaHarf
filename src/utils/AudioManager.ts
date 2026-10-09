import { AppState, Platform } from 'react-native';
import Sound from 'react-native-sound';
import { useGameStore } from '../store/useGameStore';

Sound.setCategory('Playback');

const sounds: Record<string, Sound> = {};

const loadSound = (name: string, isLoop: boolean = false) => {
  const fileName = Platform.OS === 'android' ? name.replace(/\.[^/.]+$/, "") : name;
  const s = new Sound(fileName, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log(`Failed to load sound ${name} (file: ${fileName})`, error);
      return;
    }
    if (isLoop) s.setNumberOfLoops(-1);
    sounds[name] = s;
  });
};

export const initAudio = () => {
  loadSound('bgm.mp3', true);
  loadSound('tap.mp3');
  loadSound('delete.mp3');
  loadSound('word_success.mp3');
  loadSound('level_win.mp3');
  loadSound('buy.mp3');

  // Start BGM if enabled
  setTimeout(() => {
    const { isMusicEnabled } = useGameStore.getState();
    if (isMusicEnabled && sounds['bgm.mp3']) {
      sounds['bgm.mp3'].play();
    }
  }, 1000); // Small delay to let sound load
};

export const playSfx = (name: string) => {
  const { isSfxEnabled } = useGameStore.getState();
  if (isSfxEnabled && sounds[name]) {
    sounds[name].stop(() => {
      sounds[name].play();
    });
  }
};

export const playBgm = () => {
  const { isMusicEnabled } = useGameStore.getState();
  if (isMusicEnabled && sounds['bgm.mp3']) {
    sounds['bgm.mp3'].play();
  }
};

export const stopBgm = () => {
  if (sounds['bgm.mp3']) {
    sounds['bgm.mp3'].stop();
  }
};

// Subscribe to store changes to toggle BGM instantly
useGameStore.subscribe((state, prevState) => {
  if (state.isMusicEnabled !== prevState.isMusicEnabled) {
    if (state.isMusicEnabled) {
      playBgm();
    } else {
      stopBgm();
    }
  }
});

let appState = AppState.currentState;
AppState.addEventListener('change', nextAppState => {
  if (appState.match(/inactive|background/) && nextAppState === 'active') {
    // App came to foreground
    playBgm();
  } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
    // App went to background
    stopBgm();
  }
  appState = nextAppState;
});
