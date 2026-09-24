import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { WalletCards, BookOpen, RotateCcw, ChevronRight, Database, HeartHandshake } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import { colors, spacing } from '../theme';
import { useApp } from '../store/AppContext';

function MenuRow({ icon: Icon, title, sub, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.rowCard}>
        <View style={styles.icon}><Icon size={21} color={colors.ink} strokeWidth={1.8} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>
        <ChevronRight size={20} color={colors.muted} />
      </Card>
    </Pressable>
  );
}

export default function MoreScreen({ navigation }) {
  const { resetAll } = useApp();

  const confirmReset = () => Alert.alert(
    'Borrar datos locales',
    'Esto eliminará tareas, salud, finanzas, lectura y progreso de coreano guardados en este dispositivo.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: resetAll },
    ]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="더보기 · more" title="Más" subtitle="Tus registros personales y ajustes de Haru." />
        <MenuRow icon={WalletCards} title="Finanzas" sub="Ingresos, gastos y balance del mes" onPress={() => navigation.navigate('Finanzas')} />
        <MenuRow icon={BookOpen} title="Lectura" sub="Libros y avance de páginas" onPress={() => navigation.navigate('Lectura')} />

        <Text style={styles.section}>DATOS · 데이터</Text>
        <Card style={styles.infoCard}>
          <Database size={20} color={colors.ink} strokeWidth={1.8} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Privacidad local</Text>
            <Text style={styles.sub}>La versión inicial guarda tus registros en el almacenamiento de la app, no en una nube.</Text>
          </View>
        </Card>

        <Pressable onPress={confirmReset}>
          <Card style={styles.infoCard}>
            <RotateCcw size={20} color={colors.danger} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.danger }]}>Restablecer Haru</Text>
              <Text style={styles.sub}>Borra todos los datos locales y vuelve al estado inicial.</Text>
            </View>
          </Card>
        </Pressable>

        <View style={styles.about}>
          <HeartHandshake size={18} color={colors.muted} strokeWidth={1.6} />
          <Text style={styles.aboutText}>HARU · 하루 플래너 · v1.0.0</Text>
          <Text style={styles.aboutSub}>Diseño coreano minimalista en marfil, tinta y tonos tierra.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '900', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted, lineHeight: 18, marginTop: 3 },
  section: { fontSize: 11, fontWeight: '900', letterSpacing: 1.7, color: colors.muted, marginTop: 20, marginBottom: 10 },
  about: { alignItems: 'center', paddingVertical: 34, gap: 7 },
  aboutText: { color: colors.ink, fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  aboutSub: { color: colors.muted, fontSize: 10, textAlign: 'center' },
});
