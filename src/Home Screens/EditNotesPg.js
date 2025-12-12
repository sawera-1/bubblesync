import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  Background: '#f0f2f5',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
};

const ViewEditNoteScreen = ({ navigation, route }) => {
  const { noteId } = route.params;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // --- Fetch note from Firestore ---
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notes')
      .doc(noteId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setNote({ id: doc.id, ...data });
            setTitle(data.title);
            setBody(data.body);
          } else {
            Alert.alert('Note not found');
            navigation.goBack();
          }
          setLoading(false);
        },
        (error) => {
          console.error(error);
          Alert.alert('Error loading note');
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, [noteId, navigation]);

  // --- Save edited note ---
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title cannot be empty');
      return;
    }
    try {
      await firestore().collection('notes').doc(noteId).update({
        title,
        body,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      setEditing(false);
      Alert.alert('Note updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to update note');
    }
  };

  if (loading || !note) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PrimaryAccent} />
        <Text style={styles.loadingText}>Loading note...</Text>
      </View>
    );
  }

  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.PrimaryAccent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Note Details</Text>
        </View>

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
            />
          ) : (
            <Text style={styles.detailText}>{note.title}</Text>
          )}
        </View>

        {/* Body */}
        <View style={styles.card}>
          <Text style={styles.label}>Body</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { height: 120 }]}
              value={body}
              onChangeText={setBody}
              placeholder="Enter note details"
              multiline
            />
          ) : (
            <Text style={styles.detailText}>{note.body || 'No details provided'}</Text>
          )}
        </View>

        {/* Timestamp */}
        <View style={styles.card}>
          <Text style={styles.label}>Last Updated</Text>
          <Text style={styles.detailTextSmall}>{formatDate(note.timestamp)}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonContainer}>
          {editing ? (
            <>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.PrimaryAccent }]} onPress={handleSave}>
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.SecondaryAccent }]} onPress={() => setEditing(false)}>
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.PrimaryAccent }]} onPress={() => setEditing(true)}>
              <Text style={styles.actionButtonText}>Edit Note</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  container: { padding: 20, paddingBottom: 50 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.MainText },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.Background },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.SubtleText },

  card: { backgroundColor: COLORS.White, borderRadius: 12, padding: 15, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.SubtleText, marginBottom: 5 },
  detailText: { fontSize: 16, color: COLORS.MainText },
  detailTextSmall: { fontSize: 14, color: COLORS.SubtleText },

  input: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10, fontSize: 16 },

  actionButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  actionButton: { flex: 1, paddingVertical: 14, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  actionButtonText: { color: COLORS.White, fontSize: 16, fontWeight: 'bold' },
});

export default ViewEditNoteScreen;
