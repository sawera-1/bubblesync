import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
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
  InputBg: '#FFFFFF',
};

/* -------------------------------------------------------
   CUSTOM HOOK
--------------------------------------------------------*/
const useNotes = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [uploading, setUploading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleSaveNote = async () => {
    if (!noteTitle.trim() && !noteBody.trim()) {
      alert('Please add some text to save the note.');
      return;
    }

    setUploading(true);

    try {
      const noteData = {
        title: noteTitle.trim(),
        body: noteBody.trim(),
        timestamp: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('notes').add(noteData);
      alert('Note saved successfully!');

      if (isMounted.current) {
        setNoteTitle('');
        setNoteBody('');
      }
    } catch (error) {
      console.error('Save Note Error:', error);
      alert('Failed to save note. See console for details.');
    } finally {
      if (isMounted.current) setUploading(false);
    }
  };

  return {
    noteTitle,
    setNoteTitle,
    noteBody,
    setNoteBody,
    uploading,
    handleSaveNote,
  };
};

/* -------------------------------------------------------
   MAIN SCREEN
--------------------------------------------------------*/
const NotesScreen = ({ navigation }) => {
  const {
    noteTitle,
    setNoteTitle,
    noteBody,
    setNoteBody,
    uploading,
    handleSaveNote,
  } = useNotes();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.PrimaryAccent} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>📝 Notes</Text>
          </View>
        </View>

        {/* Note Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note title"
            placeholderTextColor={COLORS.SubtleText}
            value={noteTitle}
            onChangeText={setNoteTitle}
            editable={!uploading}
          />
        </View>

        {/* Note Body */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
            placeholder="Write your note..."
            placeholderTextColor={COLORS.SubtleText}
            multiline
            value={noteBody}
            onChangeText={setNoteBody}
            editable={!uploading}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color={COLORS.White} />
          ) : (
            <>
              <MaterialCommunityIcons name="content-save-outline" size={24} color={COLORS.White} style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Save Note</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

/* -------------------------------------------------------
   STYLES
--------------------------------------------------------*/
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  container: { padding: 20, paddingBottom: 50 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: { marginRight: 10 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.MainText },

  // Card Input
  card: {
    backgroundColor: COLORS.White,
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.MainText, marginBottom: 8 },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.MainText,
  },

  // Save Button
  saveButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PrimaryAccent,
    shadowColor: COLORS.PrimaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: { color: COLORS.White, fontSize: 18, fontWeight: '900' },
});

export default NotesScreen;
