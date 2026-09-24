import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

export default function PrimaryButton({ title, onPress, variant = 'dark', style }) {
  const light = variant === 'light';
  return (
    <Pressable onPress={onPress} style={[styles.button, light && styles.light, style]}>
      <Text style={[styles.text, light && styles.lightText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, backgroundColor: colors.ink },
  light: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.ink },
  text: { color: colors.surface, fontWeight: '800', fontSize: 15 },
  lightText: { color: colors.ink },
});
