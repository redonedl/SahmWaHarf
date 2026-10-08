import { Platform } from 'react-native';

export const glass = {
  // Background
  bgGradient: ['#1A1446', '#3B1E6E', '#0F3D5E'] as string[],

  // Glass surface
  surface: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1,
    borderRadius: 24,
  },

  // Locked / dimmed surface
  lockedSurface: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    opacity: 0.45,
  },

  // Specular top edge
  specular: {
    borderTopColor: 'rgba(255,255,255,0.5)',
    borderTopWidth: 1,
  },

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.75)',

  // Semantic colours
  gold: '#FFD54A',
  success: '#4ADE80',
  danger: '#F87171',

  // Shadow
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  // Spacing
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  // Fonts — ElMessiri is bundled in the project
  fonts: {
    regular: 'ElMessiri-Regular',
    medium: 'ElMessiri-Medium',
    bold: 'ElMessiri-Bold',
  },

  // Button gradients
  btnPlay: ['#4ADE80', '#16A34A'] as string[],
  btnUnlock: ['#FFD54A', '#F59E0B'] as string[],
  btnDisabled: ['#6b7280', '#4b5563'] as string[],

  // Android: BlurView is unreliable inside ScrollViews — use a semi-transparent fallback
  isAndroid: Platform.OS === 'android',

  // Glass highlight gradient (top-to-bottom sheen on Android)
  glassHighlight: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)'] as string[],
};
