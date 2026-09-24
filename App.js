import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ListTodo, HeartPulse, Languages, MoreHorizontal } from 'lucide-react-native';
import { AppProvider } from './src/store/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import HealthScreen from './src/screens/HealthScreen';
import KoreanScreen from './src/screens/KoreanScreen';
import MoreScreen from './src/screens/MoreScreen';
import FinanceScreen from './src/screens/FinanceScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MásInicio" component={MoreScreen} />
      <Stack.Screen name="Finanzas" component={FinanceScreen} />
      <Stack.Screen name="Lectura" component={ReadingScreen} />
    </Stack.Navigator>
  );
}

const tabIcons = {
  Hoy: Home,
  Tareas: ListTodo,
  Salud: HeartPulse,
  Coreano: Languages,
  Más: MoreHorizontal,
};

function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: '#8E897F',
        tabBarStyle: {
          height: 74,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => {
          const Icon = tabIcons[route.name];
          return <Icon size={size - 2} color={color} strokeWidth={1.9} />;
        },
      })}
    >
      <Tab.Screen name="Hoy" component={HomeScreen} />
      <Tab.Screen name="Tareas" component={TasksScreen} />
      <Tab.Screen name="Salud" component={HealthScreen} />
      <Tab.Screen name="Coreano" component={KoreanScreen} />
      <Tab.Screen name="Más" component={MoreStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootTabs />
      </NavigationContainer>
    </AppProvider>
  );
}
