import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Droplets, BookOpen, Headphones, WalletCards, ListChecks, Languages, NotebookPen } from 'lucide-react-native';
import Card from '../components/Card';
import { colors, radius, spacing } from '../theme';
import { useApp } from '../store/AppContext';
import { getDailyKorean } from '../data/korean';

const week = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function formatLong(key) {
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parseKey(key));
}

function timestampDay(timestamp) {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function entryDay(entry) {
  return entry.dateKey || timestampDay(entry.createdAt);
}

function monthCells(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1);
  const days = new Date(y, m + 1, 0).getDate();
  const mondayIndex = (first.getDay() + 6) % 7;
  const cells = Array(mondayIndex).fill(null);
  for (let i = 1; i <= days; i += 1) cells.push(new Date(y, m, i));
  while (cells.length % 7) cells.push(null);
  return cells;
}

function calcKoreanStreak(doneMap, todayKey) {
  let streak = 0;
  let d = parseKey(todayKey);
  while (true) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    if (!doneMap[key]) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function MiniRow({ icon: Icon, title, children }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}><Icon size={17} color={colors.ink} strokeWidth={1.8} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.detailTitle}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

export default function HistoryScreen({ navigation }) {
  const { state, dayKey } = useApp();
  const today = new Date();
  const todayKey = dayKey(today);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(todayKey);
  const cells = useMemo(() => monthCells(month), [month]);

  const sessionsByDate = useMemo(() => {
    const map = {};
    (state.readingSessions || []).forEach((s) => {
      if (!map[s.dateKey]) map[s.dateKey] = [];
      map[s.dateKey].push(s);
    });
    return map;
  }, [state.readingSessions]);

  const financeByDate = useMemo(() => {
    const map = {};
    state.finances.forEach((f) => {
      const k = entryDay(f);
      if (!k) return;
      if (!map[k]) map[k] = [];
      map[k].push(f);
    });
    return map;
  }, [state.finances]);

  const tasksByDate = useMemo(() => {
    const map = {};
    state.tasks.forEach((t) => {
      const k = t.completedDay || timestampDay(t.completedAt);
      if (!k) return;
      if (!map[k]) map[k] = [];
      map[k].push(t);
    });
    return map;
  }, [state.tasks]);

  const hasActivity = (key) => !!(
    state.koreanDone[key]
    || state.health[key]
    || (sessionsByDate[key] && sessionsByDate[key].length)
    || (financeByDate[key] && financeByDate[key].length)
    || (tasksByDate[key] && tasksByDate[key].length)
    || (state.notes[key] && state.notes[key].trim())
  );

  const monthPrefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
  const activeDays = new Set([
    ...Object.keys(state.koreanDone).filter((k) => state.koreanDone[k]),
    ...Object.keys(state.health),
    ...Object.keys(sessionsByDate),
    ...Object.keys(financeByDate),
    ...Object.keys(tasksByDate),
    ...Object.keys(state.notes).filter((k) => state.notes[k]?.trim()),
  ].filter((k) => k.startsWith(monthPrefix))).size;

  const selectedHealth = state.health[selected];
  const selectedSessions = sessionsByDate[selected] || [];
  const selectedFinance = financeByDate[selected] || [];
  const selectedTasks = tasksByDate[selected] || [];
  const selectedNote = state.notes[selected] || '';
  const selectedDaily = getDailyKorean(parseKey(selected));
  const streak = calcKoreanStreak(state.koreanDone, todayKey);

  const moveMonth = (delta) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color={colors.ink} /><Text style={styles.backText}>Más</Text></Pressable>
        <Text style={styles.eyebrow}>기록 · TRACKER</Text>
        <Text style={styles.heading}>Registro diario</Text>
        <Text style={styles.subtitle}>Tu historial de hábitos, lectura, tareas, finanzas y coreano, día por día.</Text>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}><Text style={styles.statNumber}>{activeDays}</Text><Text style={styles.statLabel}>días activos este mes</Text></Card>
          <Card style={styles.statCard}><Text style={styles.statNumber}>{streak}</Text><Text style={styles.statLabel}>racha de coreano</Text></Card>
        </View>

        <Card style={styles.calendarCard}>
          <View style={styles.calendarHead}>
            <Pressable onPress={() => moveMonth(-1)} style={styles.arrow}><ChevronLeft size={20} color={colors.ink} /></Pressable>
            <Text style={styles.monthTitle}>{monthNames[month.getMonth()]} {month.getFullYear()}</Text>
            <Pressable onPress={() => moveMonth(1)} style={styles.arrow}><ChevronRight size={20} color={colors.ink} /></Pressable>
          </View>
          <View style={styles.weekRow}>{week.map((w) => <Text key={w} style={styles.weekDay}>{w}</Text>)}</View>
          <View style={styles.calendarGrid}>
            {cells.map((date, i) => {
              if (!date) return <View key={`e-${i}`} style={styles.dayCell} />;
              const key = dayKey(date);
              const isSelected = key === selected;
              const isToday = key === todayKey;
              const active = hasActivity(key);
              return (
                <Pressable key={key} onPress={() => setSelected(key)} style={[styles.dayCell, isSelected && styles.daySelected]}>
                  <Text style={[styles.dayText, isSelected && styles.dayTextSelected, isToday && !isSelected && styles.todayText]}>{date.getDate()}</Text>
                  <View style={[styles.activityDot, active && styles.activityDotOn, isSelected && active && styles.activityDotSelected]} />
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.legend}>• El punto indica que registraste alguna actividad ese día.</Text>
        </Card>

        <Text style={styles.selectedDate}>{formatLong(selected)}</Text>

        <Card style={styles.detailCard}>
          <MiniRow icon={Languages} title="Coreano">
            <Text style={styles.detailText}>{selectedDaily.vocabulary.word} · {selectedDaily.vocabulary.meaning}</Text>
            <Text style={styles.detailSub}>{selectedDaily.grammar.pattern} · {state.koreanDone[selected] ? 'Estudiado ✓' : 'No marcado'}</Text>
          </MiniRow>

          <View style={styles.sep} />
          <MiniRow icon={Droplets} title="Salud">
            {selectedHealth ? (
              <Text style={styles.detailText}>{selectedHealth.water || 0} vasos · {selectedHealth.sleep || 0} h sueño · {selectedHealth.movement || 0} min movimiento · ánimo {selectedHealth.mood || 3}/5{selectedHealth.medication ? ' · medicación ✓' : ''}</Text>
            ) : <Text style={styles.detailSub}>Sin registro.</Text>}
          </MiniRow>

          <View style={styles.sep} />
          <MiniRow icon={BookOpen} title="Lectura / audiolibro">
            {selectedSessions.length ? selectedSessions.map((s) => {
              const b = state.books.find((x) => x.id === s.bookId);
              const amount = s.type === 'audiobook' ? `${Math.abs(s.delta)} min` : `${Math.abs(s.delta)} pág.`;
              return <Text key={s.id} style={styles.detailText}>{b?.title || 'Lectura eliminada'} · {s.delta >= 0 ? '+' : '−'}{amount} · {s.percentAfter}%</Text>;
            }) : <Text style={styles.detailSub}>Sin avance registrado.</Text>}
          </MiniRow>

          <View style={styles.sep} />
          <MiniRow icon={ListChecks} title="Tareas completadas">
            {selectedTasks.length ? selectedTasks.map((t) => <Text key={t.id} style={styles.detailText}>✓ {t.title}</Text>) : <Text style={styles.detailSub}>Sin tareas completadas registradas.</Text>}
          </MiniRow>

          <View style={styles.sep} />
          <MiniRow icon={WalletCards} title="Finanzas">
            {selectedFinance.length ? selectedFinance.map((f) => <Text key={f.id} style={styles.detailText}>{f.type === 'Ingreso' ? '+' : '−'} S/ {Number(f.amount).toFixed(2)} · {f.description}</Text>) : <Text style={styles.detailSub}>Sin movimientos.</Text>}
          </MiniRow>

          <View style={styles.sep} />
          <MiniRow icon={NotebookPen} title="Nota del día">
            <Text style={selectedNote ? styles.detailText : styles.detailSub}>{selectedNote || 'Sin nota.'}</Text>
          </MiniRow>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 90 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 20 },
  backText: { color: colors.ink, fontWeight: '700' },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, color: colors.muted, fontWeight: '800' },
  heading: { fontSize: 31, fontWeight: '900', color: colors.ink, marginTop: 5 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 5, marginBottom: 18 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: { flex: 1, minHeight: 105, justifyContent: 'center' },
  statNumber: { fontSize: 31, fontWeight: '900', color: colors.ink },
  statLabel: { fontSize: 11, color: colors.muted, lineHeight: 15, marginTop: 4 },
  calendarCard: { marginBottom: 20 },
  calendarHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  arrow: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  monthTitle: { fontSize: 16, fontWeight: '900', color: colors.ink, textTransform: 'capitalize' },
  weekRow: { flexDirection: 'row', marginBottom: 5 },
  weekDay: { width: '14.285%', textAlign: 'center', fontSize: 10, fontWeight: '800', color: colors.muted },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.285%', height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: colors.ink },
  dayText: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  dayTextSelected: { color: colors.surface },
  todayText: { textDecorationLine: 'underline', fontWeight: '900' },
  activityDot: { width: 4, height: 4, borderRadius: 2, marginTop: 4, backgroundColor: 'transparent' },
  activityDotOn: { backgroundColor: colors.accent },
  activityDotSelected: { backgroundColor: colors.surface },
  legend: { color: colors.muted, fontSize: 10, marginTop: 10 },
  selectedDate: { color: colors.ink, fontSize: 17, fontWeight: '900', marginBottom: 10, textTransform: 'capitalize' },
  detailCard: { paddingVertical: 8 },
  detailRow: { flexDirection: 'row', gap: 10, paddingVertical: 11 },
  detailIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  detailTitle: { color: colors.ink, fontSize: 13, fontWeight: '900', marginBottom: 4 },
  detailText: { color: colors.ink, fontSize: 11.5, lineHeight: 18 },
  detailSub: { color: colors.muted, fontSize: 11.5, lineHeight: 18 },
  sep: { height: 1, backgroundColor: colors.border },
  legendIcon: { color: colors.muted },
});
