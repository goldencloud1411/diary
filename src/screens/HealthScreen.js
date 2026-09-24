import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Droplets, Moon, Footprints, Pill, Minus, Plus } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { colors, spacing } from '../theme';
import { useApp } from '../store/AppContext';

const moods = ['😣', '😕', '😐', '🙂', '😌'];

export default function HealthScreen() {
  const { state, updateHealth, dayKey } = useApp();
  const key = dayKey();
  const h = { water: 0, sleep: '', movement: '', mood: 3, medication: false, ...(state.health[key] || {}) };
  const [sleep, setSleep] = useState(String(h.sleep || ''));
  const [movement, setMovement] = useState(String(h.movement || ''));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="건강 · wellness" title="Salud" subtitle="Un registro sencillo para observar cómo va tu día." />

        <Card style={styles.cardGap}>
          <View style={styles.cardHead}>
            <View style={styles.icon}><Droplets size={21} color={colors.ink} /></View>
            <View style={{ flex: 1 }}><Text style={styles.title}>Agua</Text><Text style={styles.sub}>{h.water}/8 vasos</Text></View>
            <View style={styles.counter}>
              <Pressable style={styles.roundBtn} onPress={() => updateHealth({ water: Math.max(0, h.water - 1) })}><Minus size={18} color={colors.ink} /></Pressable>
              <Pressable style={[styles.roundBtn, styles.darkBtn]} onPress={() => updateHealth({ water: Math.min(12, h.water + 1) })}><Plus size={18} color={colors.surface} /></Pressable>
            </View>
          </View>
          <ProgressBar value={(h.water / 8) * 100} />
        </Card>

        <View style={styles.twoCol}>
          <Card style={styles.halfCard}>
            <Moon size={22} color={colors.ink} strokeWidth={1.8} />
            <Text style={styles.titleSmall}>Sueño</Text>
            <TextInput keyboardType="decimal-pad" value={sleep} onChangeText={setSleep} onEndEditing={() => updateHealth({ sleep })} placeholder="0" placeholderTextColor={colors.muted} style={styles.bigInput} />
            <Text style={styles.unit}>horas</Text>
          </Card>
          <Card style={styles.halfCard}>
            <Footprints size={22} color={colors.ink} strokeWidth={1.8} />
            <Text style={styles.titleSmall}>Movimiento</Text>
            <TextInput keyboardType="number-pad" value={movement} onChangeText={setMovement} onEndEditing={() => updateHealth({ movement })} placeholder="0" placeholderTextColor={colors.muted} style={styles.bigInput} />
            <Text style={styles.unit}>minutos</Text>
          </Card>
        </View>

        <Card style={styles.cardGap}>
          <Text style={styles.cardLabel}>ÁNIMO · 오늘 기분</Text>
          <View style={styles.moods}>
            {moods.map((m, i) => (
              <Pressable key={m} onPress={() => updateHealth({ mood: i + 1 })} style={[styles.mood, h.mood === i + 1 && styles.moodActive]}>
                <Text style={styles.moodEmoji}>{m}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card style={styles.cardGap}>
          <View style={styles.cardHead}>
            <View style={styles.icon}><Pill size={21} color={colors.ink} strokeWidth={1.8} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Medicación / suplemento</Text>
              <Text style={styles.sub}>Marcador genérico del día</Text>
            </View>
            <Pressable onPress={() => updateHealth({ medication: !h.medication })} style={[styles.toggle, h.medication && styles.toggleOn]}>
              <View style={[styles.knob, h.medication && styles.knobOn]} />
            </Pressable>
          </View>
        </Card>

        <Text style={styles.footer}>Haru registra estos datos solo en tu dispositivo. No reemplaza indicaciones médicas.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  cardGap: { marginBottom: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted, marginTop: 4 },
  counter: { flexDirection: 'row', gap: 7 },
  roundBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  darkBtn: { backgroundColor: colors.ink },
  twoCol: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfCard: { flex: 1, minHeight: 175 },
  titleSmall: { fontSize: 13, fontWeight: '800', color: colors.ink, marginTop: 15 },
  bigInput: { fontSize: 34, fontWeight: '900', color: colors.ink, paddingVertical: 4, marginTop: 7 },
  unit: { color: colors.muted, fontSize: 11 },
  cardLabel: { fontSize: 11, letterSpacing: 1.5, fontWeight: '800', color: colors.muted },
  moods: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  mood: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  moodActive: { borderColor: colors.ink, backgroundColor: colors.accentSoft },
  moodEmoji: { fontSize: 23 },
  toggle: { width: 50, height: 28, borderRadius: 14, backgroundColor: colors.border, padding: 3 },
  toggleOn: { backgroundColor: colors.ink },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.surface },
  knobOn: { marginLeft: 22 },
  footer: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 10, paddingHorizontal: 18 },
});
