import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101f3e', alignItems: 'center', paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#c916ab', letterSpacing: 2 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 30, letterSpacing: 1 },
  timerText: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  buttonContainer: { flexDirection: 'row', marginTop: 20, gap: 10 },
  button: { width: 120 },
  sessionList: { marginTop: 30, marginBottom: 10, padding: 10, width: '80%', maxHeight: 120, borderWidth: 2, borderColor: '#74c2d8', borderRadius: 10 },
  sessionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sessionCard: { marginBottom: 8, backgroundColor: '#1a1a1a' },
  sessionDate: { color: '#aaa', fontSize: 12 },
  sessionText: { color: '#fff' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 20 },
});