import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function ScreenHeader({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  eyebrow: { fontSize: 12, letterSpacing: 2, color: colors.muted, textTransform: 'uppercase', marginBottom: 7 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: 6 },
});
