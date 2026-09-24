import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BriefcaseBusiness, GraduationCap, WalletCards, BookOpen, Droplets, CheckCircle2, Cat } from 'lucide-react-native';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { colors, radius, spacing } from '../theme';
import { useApp } from '../store/AppContext';
import { getDailyKorean } from '../data/korean';

function formatDate(date) {
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

export default function HomeScreen({ navigation }) {
  const { state, updateHealth, dayKey, setNote } = useApp();
  const key = dayKey();
  const todayHealth = { water: 0, ...(state.health[key] || {}) };
  const pending = state.tasks.filter(t => !t.done);
  const done = state.tasks.filter(t => t.done).length;
  const total = state.tasks.length || 1;
  const daily = getDailyKorean();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthEntries = state.finances.filter(e => {
    const d = new Date(e.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === monthKey;
  });
  const balance = monthEntries.reduce((sum, e) => sum + (e.type === 'Ingreso' ? Number(e.amount) : -Number(e.amount)), 0);

  const quick = [
    { label: 'Trabajo', sub: `${state.tasks.filter(t => t.category === 'Trabajo' && !t.done).length} pendientes`, icon: BriefcaseBusiness, onPress: () => navigation.navigate('Tareas') },
    { label: 'Estudio', sub: `${state.tasks.filter(t => t.category === 'Estudio' && !t.done).length} pendientes`, icon: GraduationCap, onPress: () => navigation.navigate('Tareas') },
    { label: 'Finanzas', sub: `S/ ${balance.toFixed(2)}`, icon: WalletCards, onPress: () => navigation.navigate('Más', { screen: 'Finanzas' }) },
    { label: 'Lectura', sub: `${state.books.length} libro${state.books.length === 1 ? '' : 's'}`, icon: BookOpen, onPress: () => navigation.navigate('Más', { screen: 'Lectura' }) },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.brand}>HARU</Text>
            <Text style={styles.korean}>오늘 · hoy</Text>
          </View>
          <View style={styles.catBadge}><Cat size={24} color={colors.ink} strokeWidth={1.8} /></View>
        </View>

        <Text style={styles.hello}>안녕, 오늘도 천천히.</Text>
        <Text style={styles.date}>{formatDate(new Date())}</Text>

        <Card style={styles.focusCard}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardEyebrow}>FOCUS · 오늘의 할 일</Text>
              <Text style={styles.bigNumber}>{pending.length}</Text>
              <Text style={styles.muted}>pendientes en total</Text>
            </View>
            <View style={styles.circleStat}>
              <Text style={styles.circleMain}>{Math.round((done / total) * 100)}%</Text>
              <Text style={styles.circleSub}>hecho</Text>
            </View>
          </View>
          <ProgressBar value={(done / total) * 100} />
          {pending.slice(0, 3).map(t => (
            <View key={t.id} style={styles.miniTask}>
              <View style={styles.dot} />
              <Text numberOfLines={1} style={styles.miniTaskText}>{t.title}</Text>
              <Text style={styles.miniTaskCat}>{t.category}</Text>
            </View>
          ))}
          {pending.length === 0 && <Text style={styles.empty}>Todo listo por hoy ♡</Text>}
        </Card>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Mi día</Text>
          <Text style={styles.sectionKorean}>정리</Text>
        </View>
        <View style={styles.grid}>
          {quick.map(({ label, sub, icon: Icon, onPress }) => (
            <Pressable key={label} onPress={onPress} style={styles.quickCard}>
              <View style={styles.quickIcon}><Icon size={21} color={colors.ink} strokeWidth={1.8} /></View>
              <Text style={styles.quickLabel}>{label}</Text>
              <Text style={styles.quickSub}>{sub}</Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.healthStrip}>
          <View style={styles.rowBetween}>
            <View style={styles.healthLeft}>
              <View style={styles.quickIcon}><Droplets size={20} color={colors.ink} strokeWidth={1.8} /></View>
              <View>
                <Text style={styles.quickLabel}>Agua de hoy</Text>
                <Text style={styles.quickSub}>{todayHealth.water}/8 vasos</Text>
              </View>
            </View>
            <View style={styles.counterRow}>
              <Pressable style={styles.counterBtn} onPress={() => updateHealth({ water: Math.max(0, todayHealth.water - 1) })}><Text style={styles.counterText}>−</Text></Pressable>
              <Pressable style={[styles.counterBtn, styles.counterDark]} onPress={() => updateHealth({ water: Math.min(12, todayHealth.water + 1) })}><Text style={[styles.counterText, { color: colors.surface }]}>+</Text></Pressable>
            </View>
          </View>
        </Card>

        <Pressable onPress={() => navigation.navigate('Coreano')}>
          <Card style={styles.koreanCard}>
            <Text style={styles.cardEyebrow}>KOREAN DAILY · 오늘의 단어</Text>
            <View style={styles.koreanWordRow}>
              <Text style={styles.koreanWord}>{daily.vocabulary.word}</Text>
              <Text style={styles.koreanMeaning}>{daily.vocabulary.meaning}</Text>
            </View>
            <Text style={styles.example}>{daily.vocabulary.example}</Text>
            <Text style={styles.translation}>{daily.vocabulary.translation}</Text>
          </Card>
        </Pressable>

        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.cardEyebrow}>NOTA DEL DÍA · 메모</Text>
            <CheckCircle2 size={18} color={colors.muted} strokeWidth={1.7} />
          </View>
          <TextInput
            multiline
            placeholder="Algo que no quiero olvidar hoy…"
            placeholderTextColor={colors.muted}
            value={state.note}
            onChangeText={setNote}
            style={styles.noteInput}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  brand: { color: colors.ink, fontSize: 20, fontWeight: '900', letterSpacing: 5 },
  korean: { marginTop: 3, color: colors.muted, fontSize: 11, letterSpacing: 1.5 },
  catBadge: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  hello: { fontSize: 28, lineHeight: 35, fontWeight: '800', color: colors.ink },
  date: { marginTop: 5, marginBottom: spacing.lg, color: colors.muted, fontSize: 14, textTransform: 'capitalize' },
  focusCard: { marginBottom: spacing.lg },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardEyebrow: { fontSize: 11, letterSpacing: 1.6, fontWeight: '800', color: colors.muted },
  bigNumber: { fontSize: 54, lineHeight: 60, fontWeight: '900', color: colors.ink, marginTop: 10 },
  muted: { color: colors.muted, fontSize: 13, marginBottom: 14 },
  circleStat: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.ink },
  circleMain: { fontWeight: '900', fontSize: 20, color: colors.ink },
  circleSub: { fontSize: 11, color: colors.muted, marginTop: 1 },
  miniTask: { minHeight: 42, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.ink, marginRight: 10 },
  miniTaskText: { flex: 1, fontSize: 13, color: colors.ink },
  miniTaskCat: { fontSize: 10, color: colors.muted, marginLeft: 8 },
  empty: { paddingVertical: 16, color: colors.muted, fontStyle: 'italic' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: colors.ink },
  sectionKorean: { fontSize: 12, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  quickCard: { width: '48.5%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 15, marginBottom: 12 },
  quickIcon: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  quickLabel: { color: colors.ink, fontSize: 15, fontWeight: '800', marginTop: 12 },
  quickSub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  healthStrip: { marginBottom: 12 },
  healthLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterRow: { flexDirection: 'row', gap: 8 },
  counterBtn: { width: 39, height: 39, borderRadius: 20, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  counterDark: { backgroundColor: colors.ink },
  counterText: { fontSize: 22, color: colors.ink, lineHeight: 24 },
  koreanCard: { marginBottom: 12, backgroundColor: '#F0E7D7' },
  koreanWordRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginTop: 14 },
  koreanWord: { fontSize: 34, fontWeight: '900', color: colors.ink },
  koreanMeaning: { fontSize: 15, color: colors.ink, fontWeight: '700' },
  example: { marginTop: 12, fontSize: 14, color: colors.ink },
  translation: { marginTop: 4, fontSize: 12, color: colors.muted },
  noteInput: { minHeight: 95, marginTop: 10, textAlignVertical: 'top', color: colors.ink, fontSize: 14, lineHeight: 20 },
});
