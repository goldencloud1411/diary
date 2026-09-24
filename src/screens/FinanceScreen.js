import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Trash2, X } from 'lucide-react-native';
import Card from '../components/Card';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme';
import { useApp } from '../store/AppContext';

export default function FinanceScreen({ navigation }) {
  const { state, addFinance, deleteFinance } = useApp();
  const [modal, setModal] = useState(false);
  const [type, setType] = useState('Gasto');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const entries = useMemo(() => state.finances.filter(e => {
    const d = new Date(e.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === monthKey;
  }), [state.finances, monthKey]);
  const income = entries.filter(e => e.type === 'Ingreso').reduce((s, e) => s + Number(e.amount || 0), 0);
  const expense = entries.filter(e => e.type === 'Gasto').reduce((s, e) => s + Number(e.amount || 0), 0);
  const balance = income - expense;

  const submit = () => {
    const n = Number(String(amount).replace(',', '.'));
    if (!n || n <= 0) return;
    addFinance({ type, amount: n, description: description.trim() || category, category });
    setAmount(''); setDescription(''); setCategory('General'); setType('Gasto'); setModal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color={colors.ink} /><Text style={styles.backText}>Más</Text></Pressable>
        <Text style={styles.eyebrow}>가계부 · MONEY</Text>
        <Text style={styles.heading}>Finanzas</Text>
        <Text style={styles.subtitle}>Una vista simple de tus movimientos del mes.</Text>

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>BALANCE DEL MES</Text>
          <Text style={styles.balance}>S/ {balance.toFixed(2)}</Text>
          <View style={styles.statRow}>
            <View style={styles.stat}><TrendingUp size={17} color={colors.success} /><View><Text style={styles.statLabel}>Ingresos</Text><Text style={styles.statValue}>S/ {income.toFixed(2)}</Text></View></View>
            <View style={styles.stat}><TrendingDown size={17} color={colors.danger} /><View><Text style={styles.statLabel}>Gastos</Text><Text style={styles.statValue}>S/ {expense.toFixed(2)}</Text></View></View>
          </View>
        </Card>

        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Movimientos</Text><Pressable onPress={() => setModal(true)} style={styles.addSmall}><Plus size={18} color={colors.surface} /><Text style={styles.addText}>Agregar</Text></Pressable></View>

        {entries.map(e => (
          <Card key={e.id} style={styles.entry}>
            <View style={[styles.entryIcon, e.type === 'Ingreso' ? styles.incomeIcon : styles.expenseIcon]}>{e.type === 'Ingreso' ? <TrendingUp size={18} color={colors.ink} /> : <TrendingDown size={18} color={colors.ink} />}</View>
            <View style={{ flex: 1 }}><Text style={styles.entryTitle}>{e.description}</Text><Text style={styles.entrySub}>{e.category} · {new Date(e.createdAt).toLocaleDateString('es-PE')}</Text></View>
            <Text style={[styles.entryAmount, e.type === 'Gasto' && { color: colors.danger }]}>{e.type === 'Ingreso' ? '+' : '−'} S/ {Number(e.amount).toFixed(2)}</Text>
            <Pressable onPress={() => deleteFinance(e.id)} hitSlop={8}><Trash2 size={16} color={colors.muted} /></Pressable>
          </Card>
        ))}
        {entries.length === 0 && <Text style={styles.empty}>Aún no tienes movimientos este mes.</Text>}
      </ScrollView>

      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.sheetTop}><View><Text style={styles.sheetTitle}>Nuevo movimiento</Text><Text style={styles.sheetSub}>새 기록</Text></View><Pressable onPress={() => setModal(false)}><X size={24} color={colors.ink} /></Pressable></View>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.wrapRow}>{['Gasto', 'Ingreso'].map(v => <Chip key={v} label={v} active={type === v} onPress={() => setType(v)} />)}</View>
            <Text style={styles.label}>Monto (S/)</Text>
            <TextInput keyboardType="decimal-pad" value={amount} onChangeText={setAmount} placeholder="0.00" placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.label}>Descripción</Text>
            <TextInput value={description} onChangeText={setDescription} placeholder="Ej. supermercado" placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.wrapRow}>{['General', 'Casa', 'Transporte', 'Comida', 'Estudio'].map(v => <Chip key={v} label={v} active={category === v} onPress={() => setCategory(v)} />)}</View>
            <PrimaryButton title="Guardar movimiento" onPress={submit} style={{ marginTop: 22 }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 80 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 20 },
  backText: { color: colors.ink, fontWeight: '700' },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, color: colors.muted, fontWeight: '800' },
  heading: { fontSize: 31, fontWeight: '900', color: colors.ink, marginTop: 5 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 5, marginBottom: 20 },
  balanceCard: { backgroundColor: '#EDE5D5', marginBottom: 22 },
  balanceLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.6, color: colors.muted },
  balance: { fontSize: 39, fontWeight: '900', color: colors.ink, marginTop: 10 },
  statRow: { flexDirection: 'row', gap: 18, marginTop: 18 },
  stat: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center' },
  statLabel: { fontSize: 10, color: colors.muted },
  statValue: { fontSize: 13, fontWeight: '800', color: colors.ink, marginTop: 2 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: colors.ink },
  addSmall: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.ink, paddingHorizontal: 12, height: 36, borderRadius: 18 },
  addText: { color: colors.surface, fontSize: 12, fontWeight: '800' },
  entry: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.md, marginBottom: 9, padding: 13 },
  entryIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  incomeIcon: { backgroundColor: colors.sage },
  expenseIcon: { backgroundColor: '#E9D3CE' },
  entryTitle: { fontSize: 13, fontWeight: '800', color: colors.ink },
  entrySub: { fontSize: 10, color: colors.muted, marginTop: 4 },
  entryAmount: { fontSize: 12, fontWeight: '900', color: colors.success },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 12, paddingVertical: 40 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,25,22,0.35)' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 22, paddingBottom: 34 },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: colors.ink },
  sheetSub: { color: colors.muted, fontSize: 11, marginTop: 2 },
  label: { fontSize: 11, letterSpacing: 1.2, fontWeight: '900', color: colors.muted, marginBottom: 8, marginTop: 15, textTransform: 'uppercase' },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, color: colors.ink, fontSize: 15 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
