import { useState, useEffect } from 'react';
import styles from '@/hooks/timer/timerStyles';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import { CircularProgress } from 'react-native-circular-progress';

// Define the structure of a Pomodoro session in the database.
interface Session {
  id: number;
  date: string;
  focus_score: number | null;
}

const POMODORO_SECONDS = 1 * 60;
const db = SQLite.openDatabaseSync('diaPomo.db');

export default function useTimer() {
    const [timer, setTimer] = useState(POMODORO_SECONDS);
    const [isActive, setIsActive] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);

}