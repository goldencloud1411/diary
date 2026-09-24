import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@haru_planner_v1';

export async function loadAppState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Could not load Haru data', e);
    return null;
  }
}

export async function saveAppState(state) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save Haru data', e);
  }
}

export async function clearAppState() {
  await AsyncStorage.removeItem(KEY);
}
