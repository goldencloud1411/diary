import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Plus, Check, Trash2, X } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Chip from '../components/Chip';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme';
import { useApp } from '../store/AppContext';

const categories = ['Todas', 'Trabajo', 'Estudio', 'Personal'];
const priorities = ['Baja', 'Media', 'Alta'];

export default function TasksScreen() {
  const { state, addTask, toggleTask, deleteTask } = useApp();
  const [filter, setFilter] = useState('Todas');
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Trabajo');
  const [priority, setPriority] = useState('Media');

  const tasks = useMemo(() => {
    const arr = filter === 'Todas' ? state.tasks : state.tasks.filter(t => t.category === filter);
    return [...arr].sort((a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt);
  }, [state.tasks, filter]);

  const submit = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), category, priority });
    setTitle('');
    setCategory('Trabajo');
    setPriority('Media');
    setModal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <ScreenHeader eyebrow="할 일 · to-do" title="Pendientes" subtitle="Trabajo, estudio y vida personal en un solo lugar." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categories.map(c => <Chip key={c} label={c} active={filter === c} onPress={() => setFilter(c)} />)}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tasks.map(task => (
          <Card key={task.id} style={[styles.taskCard, task.done && styles.doneCard]}>
            <Pressable onPress={() => toggleTask(task.id)} style={[styles.check, task.done && styles.checkDone]}>
              {task.done ? <Check size={17} color={colors.surface} strokeWidth={2.5} /> : null}
            </Pressable>
            <View style={styles.taskBody}>
              <Text style={[styles.taskTitle, task.done && styles.doneText]}>{task.title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{task.category}</Text>
                <View style={styles.metaDot} />
                <Text style={styles.meta}>{task.priority}</Text>
              </View>
            </View>
            <Pressable onPress={() => deleteTask(task.id)} hitSlop={10}><Trash2 size={18} color={colors.muted} strokeWidth={1.7} /></Pressable>
          </Card>
        ))}
        {tasks.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyKorean}>비어 있어요</Text>
            <Text style={styles.empty}>No hay pendientes en esta categoría.</Text>
          </View>
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setModal(true)}>
        <Plus size={26} color={colors.surface} />
      </Pressable>

      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.sheetTop}>
              <View>
                <Text style={styles.sheetTitle}>Nuevo pendiente</Text>
                <Text style={styles.sheetSub}>새로운 할 일</Text>
              </View>
              <Pressable onPress={() => setModal(false)}><X size={24} color={colors.ink} /></Pressable>
            </View>
            <Text style={styles.label}>Título</Text>
            <TextInput autoFocus value={title} onChangeText={setTitle} placeholder="Ej. preparar material de clase" placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.wrapRow}>{categories.filter(c => c !== 'Todas').map(c => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}</View>
            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.wrapRow}>{priorities.map(p => <Chip key={p} label={p} active={priority === p} onPress={() => setPriority(p)} />)}</View>
            <PrimaryButton title="Guardar pendiente" onPress={submit} style={{ marginTop: 22 }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingTop: 6 },
  chips: { gap: 8, paddingBottom: 16 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 130 },
  taskCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderRadius: radius.md },
  doneCard: { opacity: 0.62 },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkDone: { backgroundColor: colors.ink },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 15, color: colors.ink, fontWeight: '700' },
  doneText: { textDecorationLine: 'line-through', color: colors.muted },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  meta: { fontSize: 11, color: colors.muted },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.muted },
  fab: { position: 'absolute', right: 22, bottom: 26, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { paddingVertical: 70, alignItems: 'center' },
  emptyKorean: { fontSize: 25, fontWeight: '800', color: colors.ink },
  empty: { marginTop: 8, color: colors.muted, fontSize: 13 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,25,22,0.35)' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 22, paddingBottom: 34 },
  sheetTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: colors.ink },
  sheetSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  label: { fontSize: 12, letterSpacing: 1.1, fontWeight: '800', color: colors.muted, marginBottom: 8, marginTop: 14, textTransform: 'uppercase' },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, color: colors.ink, fontSize: 15 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
