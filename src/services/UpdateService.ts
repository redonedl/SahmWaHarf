import firestore from '@react-native-firebase/firestore';
import { Linking, Platform } from 'react-native';

export const CURRENT_APP_VERSION = '1.0.6';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sahmwaharf.game';
export const MARKET_URL = 'market://details?id=com.sahmwaharf.game';

/**
 * Compares two semantic version strings like "1.0.7" vs "1.0.6"
 * Returns true if remote is strictly greater than current.
 */
export const isNewerVersion = (remote: string, current: string): boolean => {
  if (!remote || !current) return false;
  const r = remote.split('.').map((n) => parseInt(n, 10) || 0);
  const c = current.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(r.length, c.length); i++) {
    const rv = r[i] ?? 0;
    const cv = c[i] ?? 0;
    if (rv > cv) return true;
    if (rv < cv) return false;
  }
  return false;
};

export interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
}

/**
 * Checks Firestore collection 'settings', doc 'updates' for the 'version' field.
 */
export const checkForAppUpdate = async (): Promise<UpdateInfo> => {
  try {
    const doc = await firestore().collection('settings').doc('updates').get();
    if (!doc.exists) {
      return { hasUpdate: false, latestVersion: CURRENT_APP_VERSION };
    }

    const data = doc.data();
    const remoteVersion = (data?.version ?? '').toString().trim();

    if (remoteVersion && isNewerVersion(remoteVersion, CURRENT_APP_VERSION)) {
      return {
        hasUpdate: true,
        latestVersion: remoteVersion,
      };
    }
  } catch (err) {
    console.warn('[UpdateService] Failed to check for updates from Firestore:', err);
  }

  return { hasUpdate: false, latestVersion: CURRENT_APP_VERSION };
};

export const openPlayStore = () => {
  if (Platform.OS === 'android') {
    Linking.openURL(MARKET_URL).catch(() => {
      Linking.openURL(PLAY_STORE_URL);
    });
  } else {
    Linking.openURL(PLAY_STORE_URL);
  }
};
