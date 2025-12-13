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
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  Background: '#f0f2f5',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
};

/* -------------------------------------------------------
   CUSTOM HOOK
--------------------------------------------------------*/
const useNotes = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [uploading, setUploading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => () => { isMounted.current = false; }, []);

  const handleSaveNote = async () => {
    if (!noteTitle.trim() && !noteBody.trim()) {
      Alert.alert('Validation', 'Please add some text to save the note.');
      return;
    }

    const currentUser = auth().currentUser;

    if (!currentUser) {
      Alert.alert('Authentication Error', 'User not logged in.');
      return;
    }

    setUploading(true);

    try {
      await firestore().collection('notes').add({
        title: noteTitle.trim(),
        body: noteBody.trim(),
        createdBy: currentUser.uid,                 // ✅ USER ID
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Note saved successfully!');

      if (isMounted.current) {
        setNoteTitle('');
        setNoteBody('');
      }
    } catch (error) {
      console.error('Save Note Error:', error);
      Alert.alert('Error', 'Failed to save note.');
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
      {Platform.OS === 'android' && <View style={styles.androidStatusPadding} />}

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.PrimaryAccent} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Add Notes</Text>
          </View>

          <View style={{ width: 35 }} />
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
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveNote}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={COLORS.White} />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="content-save-outline"
                size={24}
                color={COLORS.White}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveButtonText}>Save Note</Text>
            </View>
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
  androidStatusPadding: { height: StatusBar.currentHeight || 0 },
  container: { padding: 20, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, justifyContent: 'space-between' },
  backButton: { padding: 5 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.MainText },
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
    paddingVertical: Platform.OS === 'android' ? 12 : 15,
    fontSize: 16,
    color: COLORS.MainText,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PrimaryAccent,
    elevation: 4,
  },
  saveButtonText: { color: COLORS.White, fontSize: 18, fontWeight: '900' },
});

export default NotesScreen;
