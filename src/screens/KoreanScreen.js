import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Check, BookOpenText, Sparkles, Flame, CalendarDays } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import { colors, spacing } from '../theme';
import { useApp } from '../store/AppContext';
import { getDailyKorean } from '../data/korean';

function streakCount(done, dayKey) {
  let count = 0;
  const d = new Date();
  while (true) {
    const key = dayKey(d);
    if (!done[key]) break;
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export default function KoreanScreen({ navigation }) {
  const { state, toggleKoreanDone, dayKey } = useApp();
  const key = dayKey();
  const done = !!state.koreanDone[key];
  const daily = getDailyKorean();
  const streak = streakCount(state.koreanDone, dayKey);

  const lastSeven = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const k = dayKey(date);
    const content = getDailyKorean(date);
    return { date, key: k, done: !!state.koreanDone[k], content };
  }), [state.koreanDone]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="한국어 · daily" title="Coreano diario" subtitle="Una palabra y una estructura distintas cada día, guardadas en tu historial." />

        <View style={styles.statsRow}>
          <Card style={styles.stat}><Flame size={19} color={colors.ink} /><Text style={styles.statNumber}>{streak}</Text><Text style={styles.statText}>días de racha</Text></Card>
          <Card style={styles.stat}><CalendarDays size={19} color={colors.ink} /><Text style={styles.statNumber}>{Object.values(state.koreanDone).filter(Boolean).length}</Text><Text style={styles.statText}>días estudiados</Text></Card>
        </View>

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

        <Text style={styles.sectionTitle}>Últimos 7 días · 지난 기록</Text>
        <Card style={styles.historyCard}>
          {lastSeven.map((item, index) => (
            <View key={item.key} style={[styles.historyRow, index < lastSeven.length - 1 && styles.historyBorder]}>
              <View style={[styles.historyCheck, item.done && styles.historyCheckDone]}>{item.done ? <Check size={13} color={colors.surface} /> : null}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyDate}>{item.date.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit' })}</Text>
                <Text style={styles.historyContent}>{item.content.vocabulary.word} · {item.content.vocabulary.meaning}</Text>
                <Text style={styles.historyGrammar}>{item.content.grammar.pattern}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Pressable style={styles.fullHistory} onPress={() => navigation.navigate('Más', { screen: 'Registro' })}>
          <Text style={styles.fullHistoryText}>Ver tracker completo</Text>
        </Pressable>

        <Text style={styles.tip}>El contenido cambia según la fecha del celular. El banco local de esta versión tiene más de 50 palabras y más de 40 estructuras antes de repetir.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stat: { flex: 1, minHeight: 105 },
  statNumber: { fontSize: 27, fontWeight: '900', color: colors.ink, marginTop: 8 },
  statText: { color: colors.muted, fontSize: 10.5, marginTop: 2 },
  hero: { marginBottom: 12, backgroundColor: '#EEE4D1', minHeight: 300 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  tagText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.3, color: colors.muted, textTransform: 'uppercase' },
  word: { fontSize: 56, fontWeight: '900', color: colors.ink, marginTop: 24 },
  roman: { color: colors.muted, fontSize: 12, marginTop: 3 },
  meaning: { color: colors.ink, fontSize: 20, fontWeight: '800', marginTop: 10 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 22 },
  example: { color: colors.ink, fontSize: 14, fontWeight: '700', lineHeight: 21 },
  translation: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 },
  grammarCard: { marginBottom: 12 },
  pattern: { fontSize: 31, fontWeight: '900', color: colors.ink, marginTop: 18 },
  grammarMeaning: { fontSize: 14, fontWeight: '800', color: colors.ink, marginTop: 8 },
  explanation: { fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: 8 },
  exampleBox: { marginTop: 18, backgroundColor: colors.accentSoft, borderRadius: 16, padding: 14 },
  doneButton: { minHeight: 70, borderRadius: 24, borderWidth: 1, borderColor: colors.ink, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12, marginBottom: 22 },
  doneButtonActive: { backgroundColor: colors.ink },
  doneCheck: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  doneCheckActive: { borderColor: colors.surface },
  doneTitle: { color: colors.ink, fontWeight: '900', fontSize: 14 },
  doneTitleActive: { color: colors.surface },
  doneSub: { color: colors.muted, fontSize: 10.5, marginTop: 3 },
  doneSubActive: { color: '#D8D3C8' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.ink, marginBottom: 10 },
  historyCard: { paddingVertical: 4 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  historyBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  historyCheck: { width: 25, height: 25, borderRadius: 13, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  historyCheckDone: { backgroundColor: colors.ink, borderColor: colors.ink },
  historyDate: { fontSize: 10, fontWeight: '800', color: colors.muted, textTransform: 'capitalize' },
  historyContent: { fontSize: 12, fontWeight: '800', color: colors.ink, marginTop: 2 },
  historyGrammar: { fontSize: 10.5, color: colors.muted, marginTop: 2 },
  fullHistory: { marginTop: 10, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  fullHistoryText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  tip: { color: colors.muted, fontSize: 10.5, lineHeight: 17, textAlign: 'center', paddingHorizontal: 12, marginTop: 18 },
});
