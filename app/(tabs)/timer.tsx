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

// Main component for the Pomodoro timer and session tracking.
export default function Timer() {
  const [timer, setTimer] = useState(POMODORO_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load sessions from the database when the component mounts.
  useEffect(() => {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        duration INTEGER NOT NULL,
        focus_score INTEGER,
        flow BOOLEAN DEFAULT 0,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(console.error);
    loadSessions();
  }, []);

  // Handle the countdown timer.
  useEffect(() => {
    if (!isActive) return;
    if (timer === 0) {
      setIsActive(false);
      promptFocusScore();
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Load sessions from the database.
  const loadSessions = async () => {
    try {
      const result = await db.getAllAsync<Session>(
        'SELECT id, date, focus_score FROM sessions ORDER BY date DESC LIMIT 10'
      );
      setSessions(result);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  // Prompt the user to rate their focus after a session completes.
  const promptFocusScore = () => {
    Alert.alert('Session Complete! 🎯', 'How was your focus?', [
      { text: '⭐ 1', onPress: () => saveSession(1) },
      { text: '⭐⭐ 2', onPress: () => saveSession(2) },
      { text: '⭐⭐⭐ 3', onPress: () => saveSession(3) },
    ]);
  };

  // Save the completed session to the database.
  const saveSession = async (focusScore: number) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const startTime = new Date(now.getTime() - POMODORO_SECONDS * 1000).toISOString();

    // Insert the new session into the database.
    try {
      await db.runAsync(
        'INSERT INTO sessions (date, start_time, end_time, duration, focus_score) VALUES (?, ?, ?, ?, ?)',
        date,
        startTime,
        now.toISOString(),
        25,
        focusScore
      );
      Alert.alert('✅ Session logged!');
      setTimer(POMODORO_SECONDS);
      loadSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
      Alert.alert('Error saving session');
    }
  };

  // Toggle the countdown timer between active and paused states.
  const toggleTimer = () => setIsActive((prev) => !prev);

  // Reset the countdown timer to the initial Pomodoro duration.
  const resetTimer = () => {
    setIsActive(false);
    setTimer(POMODORO_SECONDS);
  };

  // Format the remaining time in MM:SS format.
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60)
      .toString()
      .padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DiaPomo</Text>
      <Text style={styles.subtitle}>Log your sessions. Find your flow.</Text>

      <CircularProgress
        size={200}
        width={15}
        fill={(timer / POMODORO_SECONDS) * 100}
        tintColor="#2fcaed"
        backgroundColor="#2a2a2a"
        rotation={0}
      >
        {() => <Text style={styles.timerText}>{formatTime(timer)}</Text>}
      </CircularProgress>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={toggleTimer}
          style={styles.button}
          buttonColor={isActive ? '#f44336' : '#30a0b9'}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button mode="outlined" onPress={resetTimer} style={styles.button}>
          Reset
        </Button>
      </View>

      {/* Recent sessions list */}
      <ScrollView style={styles.sessionList}>
        <Text style={styles.sessionTitle}>Focus</Text>
        {sessions.length === 0 ? (
          <Text style={styles.emptyText}>No sessions yet. Start your first one!</Text>
        ) : (
          sessions.map((s) => (
            <Card key={s.id} style={styles.sessionCard}>
              <Card.Content>
                <Text style={styles.sessionDate}>{s.date}</Text>
                <Text style={styles.sessionText}>
                  {'⭐'.repeat(s.focus_score || 0)}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Calendar heatmap of sessions */}
      <Text style={styles.sessionTitle}>Calendar of Sessions</Text>
      {/* Implement a calendar view here to display sessions by date */}
    </View>
  );
}