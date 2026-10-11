import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard } from './ui/GlassCard';
import { GlossyButton } from './ui/GlossyButton';
import { openPlayStore } from '../services/UpdateService';
import { glass } from '../theme/glass';

interface Props {
  visible: boolean;
  version: string;
}

export const UpdateModal: React.FC<Props> = ({ visible, version }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <GlassCard style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="cloud-download" size={38} color="#4ADE80" />
          </View>

          <Text style={styles.title}>تحديث جديد متوفر 🚀</Text>
          
          <Text style={styles.description}>
            {`يتوفر إصدار جديد من لعبة سهم وحرف (الإصدار ${version}).\nيرجى التحديث الآن لمتابعة اللعب والاستمتاع بأحدث المستويات والميزات!`}
          </Text>

          <GlossyButton
            title="تحديث الآن عبر Google Play"
            variant="play"
            onPress={openPlayStore}
            style={styles.btn}
          />
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: glass.space.xl,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: glass.space.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: glass.space.md,
  },
  title: {
    fontFamily: glass.fonts.bold,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: glass.space.sm,
  },
  description: {
    fontFamily: glass.fonts.regular,
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 22,
    marginBottom: glass.space.xl,
  },
  btn: {
    width: '100%',
  },
});
