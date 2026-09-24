import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { ArrowLeft, Plus, BookOpen, Trash2, X, Headphones, ImagePlus, PencilLine, Clock3 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Card from '../components/Card';
import Chip from '../components/Chip';
import ProgressBar from '../components/ProgressBar';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme';
import { useApp } from '../store/AppContext';
import { persistCover } from '../coverStorage';

function formatMinutes(total) {
  const mins = Math.max(0, Math.round(Number(total) || 0));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  return `${h} h ${String(m).padStart(2, '0')} min`;
}

function parseTime(text) {
  const clean = String(text || '').trim().replace(',', '.');
  if (clean.includes(':')) {
    const [h, m] = clean.split(':').map(Number);
    return Math.max(0, (Number(h) || 0) * 60 + (Number(m) || 0));
  }
  return Math.max(0, Number(clean) || 0);
}

function getExtension(asset) {
  const name = asset?.fileName || '';
  const ext = name.includes('.') ? `.${name.split('.').pop()}` : '';
  if (ext && ext.length <= 6) return ext;
  if (asset?.mimeType === 'image/png') return '.png';
  if (asset?.mimeType === 'image/webp') return '.webp';
  return '.jpg';
}

export default function ReadingScreen({ navigation }) {
  const { state, addBook, updateBook, deleteBook, addReadingSession, dayKey } = useApp();
  const [addModal, setAddModal] = useState(false);
  const [sessionBook, setSessionBook] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('book');
  const [pages, setPages] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [coverUri, setCoverUri] = useState(null);
  const [sessionMode, setSessionMode] = useState('amount');
  const [sessionValue, setSessionValue] = useState('');

  const sessionsByBook = useMemo(() => {
    const map = {};
    (state.readingSessions || []).forEach((s) => {
      if (!map[s.bookId]) map[s.bookId] = [];
      map[s.bookId].push(s);
    });
    return map;
  }, [state.readingSessions]);

  const pickCover = async (bookId = null) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso necesario', 'Haru necesita acceso a tus fotos para elegir la portada.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.7,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const saved = await persistCover(asset.uri, getExtension(asset));
      if (bookId) updateBook(bookId, { coverUri: saved });
      else setCoverUri(saved);
    } catch (e) {
      Alert.alert('No se pudo guardar la portada', 'Intenta elegir la imagen nuevamente.');
    }
  };

  const resetAdd = () => {
    setTitle(''); setAuthor(''); setType('book'); setPages(''); setHours(''); setMinutes(''); setCoverUri(null);
  };

  const submit = () => {
    if (!title.trim()) return;
    if (type === 'book') {
      const totalPages = Math.max(1, Number(pages) || 1);
      addBook({ title: title.trim(), author: author.trim(), type, totalPages, progressPages: 0, coverUri });
    } else {
      const totalMinutes = Math.max(1, (Number(hours) || 0) * 60 + (Number(minutes) || 0));
      addBook({ title: title.trim(), author: author.trim(), type, totalMinutes, progressMinutes: 0, coverUri });
    }
    resetAdd();
    setAddModal(false);
  };

  const openSession = (book) => {
    setSessionBook(book);
    setSessionMode('amount');
    setSessionValue('');
  };

  const saveSession = () => {
    if (!sessionBook) return;
    let value = sessionMode === 'percent' ? Number(String(sessionValue).replace(',', '.')) : sessionBook.type === 'audiobook' ? parseTime(sessionValue) : Number(sessionValue);
    if (!Number.isFinite(value) || value < 0) return;
    if (sessionMode === 'amount' && value <= 0) return;
    addReadingSession(sessionBook.id, { mode: sessionMode, value });
    setSessionBook(null);
    setSessionValue('');
  };

  const confirmDelete = (book) => Alert.alert('Eliminar lectura', `¿Eliminar “${book.title}” y su historial de avance?`, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Eliminar', style: 'destructive', onPress: () => deleteBook(book.id) },
  ]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}><ArrowLeft size={22} color={colors.ink} /><Text style={styles.backText}>Más</Text></Pressable>
        <Text style={styles.eyebrow}>독서 · READING</Text>
        <Text style={styles.heading}>Mi biblioteca</Text>
        <Text style={styles.subtitle}>Libros y audiolibros con portada, progreso e historial de cada sesión.</Text>

        <Pressable onPress={() => setAddModal(true)} style={styles.addBook}>
          <Plus size={20} color={colors.surface} /><Text style={styles.addBookText}>Agregar lectura</Text>
        </Pressable>

        {state.books.map((book) => {
          const isAudio = book.type === 'audiobook';
          const current = Number(isAudio ? book.progressMinutes : book.progressPages) || 0;
          const total = Math.max(1, Number(isAudio ? book.totalMinutes : book.totalPages) || 1);
          const pct = Math.min(100, (current / total) * 100);
          const sessions = sessionsByBook[book.id] || [];
          const todayKey = dayKey();
          const todayDelta = sessions.filter((s) => s.dateKey === todayKey).reduce((sum, s) => sum + Math.max(0, s.delta), 0);
          return (
            <Card key={book.id} style={styles.bookCard}>
              <View style={styles.bookTop}>
                <Pressable onPress={() => pickCover(book.id)} style={styles.coverWrap}>
                  {book.coverUri ? <Image source={{ uri: book.coverUri }} style={styles.coverImage} /> : (
                    <View style={styles.cover}>{isAudio ? <Headphones size={25} color={colors.ink} strokeWidth={1.7} /> : <BookOpen size={25} color={colors.ink} strokeWidth={1.7} />}</View>
                  )}
                  <View style={styles.coverEdit}><ImagePlus size={11} color={colors.surface} /></View>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <View style={styles.typeRow}>
                    <Text style={styles.typePill}>{isAudio ? '🎧 AUDIOBOOK' : '📖 LIBRO'}</Text>
                  </View>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.author}>{book.author || 'Sin autor'}</Text>
                </View>
                <Pressable onPress={() => confirmDelete(book)} hitSlop={8}><Trash2 size={17} color={colors.muted} /></Pressable>
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.pages}>{isAudio ? `${formatMinutes(current)} / ${formatMinutes(total)}` : `${current} / ${total} páginas`}</Text>
                <Text style={styles.pct}>{Math.round(pct)}%</Text>
              </View>
              <ProgressBar value={pct} />
              {todayDelta > 0 && <Text style={styles.todayAdvance}>Hoy · +{isAudio ? formatMinutes(todayDelta) : `${todayDelta} páginas`}</Text>}

              <Pressable style={styles.registerBtn} onPress={() => openSession(book)}>
                <PencilLine size={16} color={colors.surface} />
                <Text style={styles.registerText}>Registrar avance</Text>
              </Pressable>

              {sessions.length > 0 && (
                <View style={styles.historyMini}>
                  <Text style={styles.historyTitle}>HISTORIAL RECIENTE</Text>
                  {sessions.slice(0, 3).map((s) => (
                    <View key={s.id} style={styles.historyRow}>
                      <Clock3 size={13} color={colors.muted} />
                      <Text style={styles.historyText}>{new Date(`${s.dateKey}T12:00:00`).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })} · {s.delta >= 0 ? '+' : '−'}{isAudio ? formatMinutes(Math.abs(s.delta)) : `${Math.abs(s.delta)} pág.`}</Text>
                      <Text style={styles.historyPct}>{s.percentAfter}%</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          );
        })}
        {state.books.length === 0 && <Text style={styles.empty}>Tu biblioteca está vacía. Agrega un libro o audiolibro para comenzar tu tracker.</Text>}
      </ScrollView>

      <Modal visible={addModal} transparent animationType="slide" onRequestClose={() => setAddModal(false)}>
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.sheet} keyboardShouldPersistTaps="handled">
            <View style={styles.sheetTop}><View><Text style={styles.sheetTitle}>Nueva lectura</Text><Text style={styles.sheetSub}>새로운 독서 기록</Text></View><Pressable onPress={() => { resetAdd(); setAddModal(false); }}><X size={24} color={colors.ink} /></Pressable></View>

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.wrapRow}><Chip label="📖 Libro" active={type === 'book'} onPress={() => setType('book')} /><Chip label="🎧 Audiolibro" active={type === 'audiobook'} onPress={() => setType('audiobook')} /></View>

            <Text style={styles.label}>Portada</Text>
            <Pressable style={styles.coverPicker} onPress={() => pickCover()}>
              {coverUri ? <Image source={{ uri: coverUri }} style={styles.pickerImage} /> : <><ImagePlus size={22} color={colors.ink} /><Text style={styles.coverPickerText}>Elegir desde la galería</Text></>}
            </Pressable>

            <Text style={styles.label}>Título</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder={type === 'book' ? 'Título del libro' : 'Título del audiolibro'} placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.label}>Autor</Text>
            <TextInput value={author} onChangeText={setAuthor} placeholder="Autor/a" placeholderTextColor={colors.muted} style={styles.input} />

            {type === 'book' ? (
              <><Text style={styles.label}>Número total de páginas</Text><TextInput keyboardType="number-pad" value={pages} onChangeText={setPages} placeholder="300" placeholderTextColor={colors.muted} style={styles.input} /></>
            ) : (
              <><Text style={styles.label}>Duración total</Text><View style={styles.durationRow}><TextInput keyboardType="number-pad" value={hours} onChangeText={setHours} placeholder="10 h" placeholderTextColor={colors.muted} style={[styles.input, { flex: 1 }]} /><TextInput keyboardType="number-pad" value={minutes} onChangeText={setMinutes} placeholder="30 min" placeholderTextColor={colors.muted} style={[styles.input, { flex: 1 }]} /></View></>
            )}
            <PrimaryButton title="Guardar en mi biblioteca" onPress={submit} style={{ marginTop: 22 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!sessionBook} transparent animationType="slide" onRequestClose={() => setSessionBook(null)}>
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.sheetTop}><View style={{ flex: 1 }}><Text style={styles.sheetTitle}>Registrar avance</Text><Text numberOfLines={1} style={styles.sheetSub}>{sessionBook?.title}</Text></View><Pressable onPress={() => setSessionBook(null)}><X size={24} color={colors.ink} /></Pressable></View>
            <Text style={styles.label}>¿Cómo quieres actualizar?</Text>
            <View style={styles.wrapRow}><Chip label={sessionBook?.type === 'audiobook' ? 'Tiempo escuchado' : 'Páginas leídas'} active={sessionMode === 'amount'} onPress={() => { setSessionMode('amount'); setSessionValue(''); }} /><Chip label="% total actual" active={sessionMode === 'percent'} onPress={() => { setSessionMode('percent'); setSessionValue(''); }} /></View>
            <Text style={styles.label}>{sessionMode === 'percent' ? 'Progreso total (%)' : sessionBook?.type === 'audiobook' ? 'Tiempo de hoy' : 'Páginas de hoy'}</Text>
            <TextInput
              autoFocus
              keyboardType={sessionBook?.type === 'audiobook' && sessionMode === 'amount' ? 'numbers-and-punctuation' : 'decimal-pad'}
              value={sessionValue}
              onChangeText={setSessionValue}
              placeholder={sessionMode === 'percent' ? 'Ej. 48' : sessionBook?.type === 'audiobook' ? 'Ej. 45 o 1:20' : 'Ej. 32'}
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <Text style={styles.helper}>{sessionMode === 'percent' ? 'Haru calculará automáticamente el avance equivalente.' : sessionBook?.type === 'audiobook' ? 'Puedes escribir minutos (45) o h:mm (1:20).' : 'Se sumará esa cantidad a tu progreso actual.'}</Text>
            <PrimaryButton title="Guardar avance de hoy" onPress={saveSession} style={{ marginTop: 18 }} />
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
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 5, marginBottom: 20 },
  addBook: { height: 48, borderRadius: 24, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 15 },
  addBookText: { color: colors.surface, fontWeight: '900', fontSize: 14 },
  bookCard: { marginBottom: 12 },
  bookTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coverWrap: { width: 66, height: 96, position: 'relative' },
  cover: { width: 66, height: 96, borderRadius: 11, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  coverImage: { width: 66, height: 96, borderRadius: 11, backgroundColor: colors.accentSoft },
  coverEdit: { position: 'absolute', right: -5, bottom: -5, width: 25, height: 25, borderRadius: 13, backgroundColor: colors.ink, borderWidth: 2, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  typeRow: { flexDirection: 'row', marginBottom: 5 },
  typePill: { fontSize: 8.5, color: colors.muted, fontWeight: '900', letterSpacing: 0.7 },
  bookTitle: { fontSize: 16, lineHeight: 20, fontWeight: '900', color: colors.ink },
  author: { fontSize: 11, color: colors.muted, marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 7 },
  pages: { fontSize: 11, color: colors.muted },
  pct: { fontSize: 11, fontWeight: '900', color: colors.ink },
  todayAdvance: { marginTop: 8, color: colors.success, fontSize: 11, fontWeight: '800' },
  registerBtn: { marginTop: 14, height: 40, borderRadius: 20, backgroundColor: colors.ink, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  registerText: { color: colors.surface, fontSize: 12, fontWeight: '900' },
  historyMini: { marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  historyTitle: { fontSize: 9, letterSpacing: 1.4, fontWeight: '900', color: colors.muted, marginBottom: 7 },
  historyRow: { minHeight: 27, flexDirection: 'row', alignItems: 'center', gap: 6 },
  historyText: { flex: 1, fontSize: 10.5, color: colors.muted },
  historyPct: { fontSize: 10.5, color: colors.ink, fontWeight: '900' },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 12, lineHeight: 18, paddingVertical: 45, paddingHorizontal: 25 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,25,22,0.35)' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 22, paddingBottom: 34 },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: colors.ink },
  sheetSub: { color: colors.muted, fontSize: 11, marginTop: 2 },
  label: { fontSize: 11, letterSpacing: 1.2, fontWeight: '900', color: colors.muted, marginBottom: 8, marginTop: 15, textTransform: 'uppercase' },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, color: colors.ink, fontSize: 15 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  durationRow: { flexDirection: 'row', gap: 9 },
  coverPicker: { minHeight: 92, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.ink, backgroundColor: colors.surface, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', gap: 7, overflow: 'hidden' },
  coverPickerText: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  pickerImage: { width: 64, height: 88, borderRadius: 8 },
  helper: { color: colors.muted, fontSize: 10.5, lineHeight: 16, marginTop: 7 },
});
