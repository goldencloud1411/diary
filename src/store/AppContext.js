import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadAppState, saveAppState, clearAppState } from '../storage';

const AppContext = createContext(null);

const defaultState = {
  tasks: [
    { id: 't1', title: 'Organizar prioridades de hoy', category: 'Personal', priority: 'Media', done: false, createdAt: Date.now() },
    { id: 't2', title: '20 min de coreano', category: 'Estudio', priority: 'Alta', done: false, createdAt: Date.now() },
  ],
  health: {},
  finances: [],
  books: [],
  koreanDone: {},
  note: '',
};

function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadAppState();
      if (stored) setState({ ...defaultState, ...stored });
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) saveAppState(state);
  }, [state, ready]);

  const addTask = (task) => setState(s => ({
    ...s,
    tasks: [{ id: `t_${Date.now()}`, done: false, createdAt: Date.now(), ...task }, ...s.tasks],
  }));

  const toggleTask = (id) => setState(s => ({
    ...s,
    tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
  }));

  const deleteTask = (id) => setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));

  const updateHealth = (patch, key = dayKey()) => setState(s => ({
    ...s,
    health: {
      ...s.health,
      [key]: { water: 0, sleep: '', movement: '', mood: 3, medication: false, ...(s.health[key] || {}), ...patch },
    },
  }));

  const addFinance = (entry) => setState(s => ({
    ...s,
    finances: [{ id: `f_${Date.now()}`, createdAt: Date.now(), ...entry }, ...s.finances],
  }));

  const deleteFinance = (id) => setState(s => ({ ...s, finances: s.finances.filter(e => e.id !== id) }));

  const addBook = (book) => setState(s => ({
    ...s,
    books: [{ id: `b_${Date.now()}`, progress: 0, createdAt: Date.now(), ...book }, ...s.books],
  }));

  const updateBook = (id, patch) => setState(s => ({
    ...s,
    books: s.books.map(b => b.id === id ? { ...b, ...patch } : b),
  }));

  const deleteBook = (id) => setState(s => ({ ...s, books: s.books.filter(b => b.id !== id) }));

  const toggleKoreanDone = (key = dayKey()) => setState(s => ({
    ...s,
    koreanDone: { ...s.koreanDone, [key]: !s.koreanDone[key] },
  }));

  const setNote = (note) => setState(s => ({ ...s, note }));

  const resetAll = async () => {
    await clearAppState();
    setState(defaultState);
  };

  const value = useMemo(() => ({
    state, ready, dayKey,
    addTask, toggleTask, deleteTask,
    updateHealth,
    addFinance, deleteFinance,
    addBook, updateBook, deleteBook,
    toggleKoreanDone, setNote, resetAll,
  }), [state, ready]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
