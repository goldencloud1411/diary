import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Check, BookOpenText, Sparkles } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import { colors, spacing } from '../theme';
import { useApp } from '../store/AppContext';
import { getDailyKorean } from '../data/korean';

export default function KoreanScreen() {
  const { state, toggleKoreanDone, dayKey } = useApp();
  const key = dayKey();
  const done = !!state.koreanDone[key];
  const daily = getDailyKorean();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="한국어 · daily" title="Coreano diario" subtitle="Una palabra y una estructura al día. Poco, pero constante." />

        <Card style={styles.hero}>
          <View style={styles.tag}><Sparkles size={14} color={colors.ink} /><Text style={styles.tagText}>오늘의 단어 · palabra</Text></View>
          <Text style={styles.word}>{daily.vocabulary.word}</Text>
          <Text style={styles.roman}>{daily.vocabulary.romanization}</Text>
          <Text style={styles.meaning}>{daily.vocabulary.meaning}</Text>
          <View style={styles.divider} />
          <Text style={styles.example}>{daily.vocabulary.example}</Text>
          <Text style={styles.translation}>{daily.vocabulary.translation}</Text>
        </Card>

        <Card style={styles.grammarCard}>
          <View style={styles.tag}><BookOpenText size={14} color={colors.ink} /><Text style={styles.tagText}>오늘의 문법 · gramática</Text></View>
          <Text style={styles.pattern}>{daily.grammar.pattern}</Text>
          <Text style={styles.grammarMeaning}>{daily.grammar.meaning}</Text>
          <Text style={styles.explanation}>{daily.grammar.explanation}</Text>
          <View style={styles.exampleBox}>
            <Text style={styles.example}>{daily.grammar.example}</Text>
            <Text style={styles.translation}>{daily.grammar.translation}</Text>
          </View>
        </Card>

        <Pressable onPress={() => toggleKoreanDone(key)} style={[styles.doneButton, done && styles.doneButtonActive]}>
          <View style={[styles.doneCheck, done && styles.doneCheckActive]}>{done ? <Check size={18} color={colors.surface} strokeWidth={2.5} /> : null}</View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.doneTitle, done && styles.doneTitleActive]}>{done ? 'Estudiado por hoy' : 'Marcar como estudiado'}</Text>
            <Text style={[styles.doneSub, done && styles.doneSubActive]}>{done ? '오늘 공부 완료 ♡' : '매일 조금씩 · un poco cada día'}</Text>
          </View>
        </Pressable>

        <Text style={styles.tip}>Tip: repite los ejemplos en voz alta y crea una oración propia antes de marcar el día como completado.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  hero: { marginBottom: 12, backgroundColor: '#EEE4D1', minHeight: 300 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  tagText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.3, color: colors.muted, textTransform: 'uppercase' },
  word: { fontSize: 56, fontWeight: '900', color: colors.ink, marginTop: 26 },
  roman: { fontSize: 14, color: colors.muted, marginTop: 2 },
  meaning: { fontSize: 21, color: colors.ink, fontWeight: '800', marginTop: 8 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 22 },
  example: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.ink },
  translation: { fontSize: 13, lineHeight: 20, color: colors.muted, marginTop: 4 },
  grammarCard: { marginBottom: 12 },
  pattern: { fontSize: 31, fontWeight: '900', color: colors.ink, marginTop: 24 },
  grammarMeaning: { fontSize: 17, fontWeight: '800', color: colors.ink, marginTop: 7 },
  explanation: { fontSize: 13, lineHeight: 20, color: colors.muted, marginTop: 10 },
  exampleBox: { backgroundColor: colors.background, borderRadius: 16, padding: 14, marginTop: 18, borderWidth: 1, borderColor: colors.border },
  doneButton: { minHeight: 76, borderRadius: 22, borderWidth: 1, borderColor: colors.ink, flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12, backgroundColor: colors.surface },
  doneButtonActive: { backgroundColor: colors.ink },
  doneCheck: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  doneCheckActive: { borderColor: colors.surface },
  doneTitle: { fontWeight: '900', color: colors.ink, fontSize: 14 },
  doneTitleActive: { color: colors.surface },
  doneSub: { color: colors.muted, fontSize: 11, marginTop: 4 },
  doneSubActive: { color: '#D8D3C9' },
  tip: { marginTop: 15, color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', paddingHorizontal: 16 },
});
