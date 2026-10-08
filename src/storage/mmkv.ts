import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'arrowwords-storage' });

export const zustandMMKVStorage = {
  getItem: (k: string): string | null => storage.getString(k) ?? null,
  setItem: (k: string, v: string): void => storage.set(k, v),
  removeItem: (k: string): void => { storage.remove(k); },
};
