import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadAppState, saveAppState, clearAppState } from '../storage';

const AppContext = createContext(null);

export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const defaultState = {
  schemaVersion: 2,
  tasks: [
    { id: 't1', title: 'Organizar prioridades de hoy', category: 'Personal', priority: 'Media', done: false, createdAt: Date.now() },
    { id: 't2', title: '20 min de coreano', category: 'Estudio', priority: 'Alta', done: false, createdAt: Date.now() },
  ],
  health: {},
  finances: [],
  books: [],
  readingSessions: [],
  koreanDone: {},
  notes: {},
};

function migrateState(stored) {
  if (!stored) return defaultState;
  const today = dayKey();

  const migratedBooks = (stored.books || []).map((b) => ({
    type: 'book',
    coverUri: null,
    progressPages: Number(b.progress ?? 0),
    progressMinutes: 0,
    totalMinutes: 0,
    ...b,
    progressPages: Number(b.progressPages ?? b.progress ?? 0),
  }));

  const notes = { ...(stored.notes || {}) };
  if (stored.note && !notes[today]) notes[today] = stored.note;

  return {
    ...defaultState,
    ...stored,
    schemaVersion: 2,
    books: migratedBooks,
    readingSessions: stored.readingSessions || [],
    notes,
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadAppState();
      setState(migrateState(stored));
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) saveAppState(state);
  }, [state, ready]);

  const addTask = (task) => setState((s) => ({
    ...s,
    tasks: [{ id: `t_${Date.now()}`, done: false, createdAt: Date.now(), ...task }, ...s.tasks],
  }));

  const toggleTask = (id) => setState((s) => ({
    ...s,
    tasks: s.tasks.map((t) => {
      if (t.id !== id) return t;
      const done = !t.done;
      return {
        ...t,
        done,
        completedAt: done ? Date.now() : null,
        completedDay: done ? dayKey() : null,
      };
    }),
  }));

  const deleteTask = (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));

  const updateHealth = (patch, key = dayKey()) => setState((s) => ({
    ...s,
    health: {
      ...s.health,
      [key]: { water: 0, sleep: '', movement: '', mood: 3, medication: false, ...(s.health[key] || {}), ...patch, updatedAt: Date.now() },
    },
  }));

  const addFinance = (entry) => setState((s) => ({
    ...s,
    finances: [{ id: `f_${Date.now()}`, createdAt: Date.now(), dateKey: dayKey(), ...entry }, ...s.finances],
  }));

  const deleteFinance = (id) => setState((s) => ({ ...s, finances: s.finances.filter((e) => e.id !== id) }));

  const addBook = (book) => setState((s) => ({
    ...s,
    books: [{
      id: `b_${Date.now()}`,
      type: 'book',
      coverUri: null,
      progressPages: 0,
      progressMinutes: 0,
      createdAt: Date.now(),
      ...book,
    }, ...s.books],
  }));

  const updateBook = (id, patch) => setState((s) => ({
    ...s,
    books: s.books.map((b) => b.id === id ? { ...b, ...patch } : b),
  }));

  const deleteBook = (id) => setState((s) => ({
    ...s,
    books: s.books.filter((b) => b.id !== id),
    readingSessions: s.readingSessions.filter((r) => r.bookId !== id),
  }));

  const addReadingSession = (bookId, { mode, value, date = new Date() }) => setState((s) => {
    const book = s.books.find((b) => b.id === bookId);
    if (!book) return s;

    const isAudio = book.type === 'audiobook';
    const total = Math.max(1, Number(isAudio ? book.totalMinutes : book.totalPages) || 1);
    const current = Math.max(0, Number(isAudio ? book.progressMinutes : book.progressPages) || 0);
    let next = current;

    if (mode === 'percent') {
      const pct = Math.max(0, Math.min(100, Number(value) || 0));
      next = Math.round(total * pct / 100);
    } else {
      next = Math.max(0, Math.min(total, current + Math.max(0, Number(value) || 0)));
    }

    const delta = next - current;
    if (delta === 0 && mode !== 'percent') return s;
    const key = dayKey(date);
    const session = {
      id: `r_${Date.now()}`,
      bookId,
      dateKey: key,
      createdAt: Date.now(),
      type: isAudio ? 'audiobook' : 'book',
      mode,
      delta,
      from: current,
      to: next,
      percentAfter: Math.round((next / total) * 1000) / 10,
    };

    return {
      ...s,
      books: s.books.map((b) => b.id === bookId
        ? { ...b, ...(isAudio ? { progressMinutes: next } : { progressPages: next }), updatedAt: Date.now() }
        : b),
      readingSessions: [session, ...s.readingSessions],
    };
  });

  const toggleKoreanDone = (key = dayKey()) => setState((s) => ({
    ...s,
    koreanDone: { ...s.koreanDone, [key]: !s.koreanDone[key] },
  }));

  const setNote = (note, key = dayKey()) => setState((s) => ({
    ...s,
    notes: { ...s.notes, [key]: note },
  }));

  const resetAll = async () => {
    await clearAppState();
    setState(defaultState);
  };

  const value = useMemo(() => ({
    state, ready, dayKey,
    addTask, toggleTask, deleteTask,
    updateHealth,
    addFinance, deleteFinance,
    addBook, updateBook, deleteBook, addReadingSession,
    toggleKoreanDone, setNote, resetAll,
  }), [state, ready]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
