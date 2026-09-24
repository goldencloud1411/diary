import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Plus, BookOpen, Trash2, Minus, X } from 'lucide-react-native';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme';
import { useApp } from '../store/AppContext';

export default function ReadingScreen({ navigation }) {
  const { state, addBook, updateBook, deleteBook } = useApp();
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');

  const submit = () => {
    const totalPages = Math.max(1, Number(pages) || 1);
    if (!title.trim()) return;
    addBook({ title: title.trim(), author: author.trim(), totalPages });
    setTitle(''); setAuthor(''); setPages(''); setModal(false);
  };

  const changeProgress = (book, delta) => {
    const next = Math.max(0, Math.min(Number(book.totalPages), Number(book.progress || 0) + delta));
    updateBook(book.id, { progress: next });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color={colors.ink} /><Text style={styles.backText}>Más</Text></Pressable>
        <Text style={styles.eyebrow}>독서 · READING</Text>
        <Text style={styles.heading}>Lectura</Text>
        <Text style={styles.subtitle}>Registra tus libros y avanza página a página.</Text>

        <Pressable onPress={() => setModal(true)} style={styles.addBook}>
          <Plus size={20} color={colors.surface} /><Text style={styles.addBookText}>Agregar libro</Text>
        </Pressable>

        {state.books.map(book => {
          const pct = (Number(book.progress || 0) / Number(book.totalPages || 1)) * 100;
          return (
            <Card key={book.id} style={styles.bookCard}>
              <View style={styles.bookTop}>
                <View style={styles.cover}><BookOpen size={24} color={colors.ink} strokeWidth={1.7} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.author}>{book.author || 'Sin autor'}</Text>
                </View>
                <Pressable onPress={() => deleteBook(book.id)} hitSlop={8}><Trash2 size={17} color={colors.muted} /></Pressable>
              </View>
              <View style={styles.progressRow}><Text style={styles.pages}>{book.progress || 0} / {book.totalPages} páginas</Text><Text style={styles.pct}>{Math.round(pct)}%</Text></View>
              <ProgressBar value={pct} />
              <View style={styles.controls}>
                <Pressable style={styles.control} onPress={() => changeProgress(book, -5)}><Minus size={17} color={colors.ink} /><Text style={styles.controlText}>5</Text></Pressable>
                <Pressable style={[styles.control, styles.darkControl]} onPress={() => changeProgress(book, 5)}><Plus size={17} color={colors.surface} /><Text style={[styles.controlText, { color: colors.surface }]}>5 páginas</Text></Pressable>
              </View>
            </Card>
          );
        })}
        {state.books.length === 0 && <Text style={styles.empty}>Tu estantería está vacía. Agrega el libro que estás leyendo.</Text>}
      </ScrollView>

      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.sheetTop}><View><Text style={styles.sheetTitle}>Nuevo libro</Text><Text style={styles.sheetSub}>새 책</Text></View><Pressable onPress={() => setModal(false)}><X size={24} color={colors.ink} /></Pressable></View>
            <Text style={styles.label}>Título</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Título del libro" placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.label}>Autor</Text>
            <TextInput value={author} onChangeText={setAuthor} placeholder="Autor/a" placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.label}>Número de páginas</Text>
            <TextInput keyboardType="number-pad" value={pages} onChangeText={setPages} placeholder="300" placeholderTextColor={colors.muted} style={styles.input} />
            <PrimaryButton title="Guardar libro" onPress={submit} style={{ marginTop: 22 }} />
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
  addBook: { height: 48, borderRadius: 24, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 15 },
  addBookText: { color: colors.surface, fontWeight: '900', fontSize: 14 },
  bookCard: { marginBottom: 11 },
  bookTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cover: { width: 54, height: 68, borderRadius: 10, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  bookTitle: { fontSize: 15, fontWeight: '900', color: colors.ink },
  author: { fontSize: 11, color: colors.muted, marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 7 },
  pages: { fontSize: 11, color: colors.muted },
  pct: { fontSize: 11, fontWeight: '900', color: colors.ink },
  controls: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14 },
  control: { height: 36, minWidth: 58, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  darkControl: { backgroundColor: colors.ink },
  controlText: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 12, lineHeight: 18, paddingVertical: 45, paddingHorizontal: 25 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,25,22,0.35)' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 22, paddingBottom: 34 },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: colors.ink },
  sheetSub: { color: colors.muted, fontSize: 11, marginTop: 2 },
  label: { fontSize: 11, letterSpacing: 1.2, fontWeight: '900', color: colors.muted, marginBottom: 8, marginTop: 15, textTransform: 'uppercase' },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, color: colors.ink, fontSize: 15 },
});
