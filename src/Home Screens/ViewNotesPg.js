import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView, // Use SafeAreaView to match ViewTaskScreen
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';

// ----------------------------------------------------------------------
// 🎨 COLOR PALETTE & HELPERS (COPIED FROM ViewTaskScreen)
// ----------------------------------------------------------------------
const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  MediumPriority: '#FFB74D',
  Background: '#f0f2f5', // Lighter background
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
  NotePhysics: '#81c784', // Used as "Done" or positive action color
};

// --- Helper to format date safely (COPIED FROM ViewTaskScreen) ---
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date =
    typeof timestamp === 'string'
      ? new Date(timestamp)
      : timestamp.toDate
      ? timestamp.toDate()
      : timestamp;
  return format(date, 'MMM dd, yyyy'); // Use date-fns for consistency
};

const ViewNoteScreen = ({ route, navigation }) => {
  const { noteId } = route.params;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notes')
      .doc(noteId)
      .onSnapshot(
        (docSnapshot) => {
          if (docSnapshot.exists) {
            const noteData = docSnapshot.data();
            setNote({
              id: docSnapshot.id,
              ...noteData,
              // Fallback for content
              text: noteData.body || noteData.convertedTranscript || noteData.detail || 'No detailed content available.',
              // Use timestamp or createdAt for date
              createdAt: noteData.timestamp || noteData.createdAt,
            });
          } else {
            alert('Note not found or has been removed.');
            navigation.goBack();
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to note:', error);
          alert('Failed to load note details.');
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, [noteId, navigation]);

  // --- Handlers ---
  const handleEdit = () => {
    note?.id && navigation.navigate('ViewEditNote', { noteId: note.id });
  };

  const handleDelete = async () => {
    if (!note) return;

    // A real app would show a confirmation dialog here
    const confirmDelete = true; 

    if (confirmDelete) {
      try {
        await firestore().collection('notes').doc(note.id).delete();
        alert('Note successfully deleted!');
        navigation.goBack();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note.');
      }
    }
  };


  if (loading || !note) {
    return (
      // Use styles.loadingContainer from ViewTaskScreen template
      <View style={styles.loadingContainer}> 
        <ActivityIndicator size="large" color={COLORS.PrimaryAccent} />
        <Text style={styles.loadingText}>Loading note details...</Text>
      </View>
    );
  }

  const displayTitle = note.title || 'Untitled Note';
  const isStarred = note.isStarred === true; // Assuming a boolean flag for importance/starring

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.PrimaryAccent} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>Note Detail</Text>
          </View>
        </View>

        {/* Status Card (Adapted for Note Title/Status) */}
        <View style={[styles.statusCard, { borderColor: COLORS.PrimaryAccent }]}>
          <MaterialCommunityIcons
            name={isStarred ? 'star' : 'notebook-check-outline'}
            size={30}
            color={isStarred ? COLORS.SecondaryAccent : COLORS.PrimaryAccent}
          />
          <Text style={styles.statusText} numberOfLines={1}>{displayTitle}</Text>
        </View>

        {/* Metadata Card: Category & Created Date */}
        <View style={styles.infoRow}>
          <View style={[styles.infoItem, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Category</Text>
            {note.category ? (
                 <View style={[styles.pill, { backgroundColor: COLORS.PrimaryAccent }]}>
                    <MaterialCommunityIcons name="tag-outline" size={16} color={COLORS.White} style={{ marginRight: 4 }} />
                    <Text style={styles.pillText}>{note.category}</Text>
                 </View>
            ) : (
                <Text style={styles.detailTextSmall}>General</Text>
            )}
          </View>
          <View style={[styles.infoItem, { flex: 0.8 }]}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.detailTextSmall}>{formatDate(note.createdAt)}</Text>
          </View>
        </View>

        {/* Content/Body */}
        <View style={styles.card}>
          <Text style={styles.label}>Content</Text>
          <Text style={styles.descriptionText}>
            {note.text}
          </Text>
        </View>
        
        {/* Audio/Media Indicator (Optional) */}
        {note.audioUrl && (
            <View style={styles.card}>
                <Text style={styles.label}>Media</Text>
                <View style={styles.metadataContainer}>
                    <MaterialCommunityIcons name="microphone" size={20} color={COLORS.PrimaryAccent} />
                    <Text style={styles.metadataText}>Voice Note Attached (Tap to play)</Text>
                </View>
            </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={COLORS.PrimaryAccent}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.actionButtonText, { color: COLORS.PrimaryAccent }]}>Edit Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton, { backgroundColor: COLORS.SecondaryAccent }]}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons
              name={'delete-outline'}
              size={24}
              color={COLORS.White}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionButtonText}>Delete Note</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ----------------------------------------------------------------------
// 🎨 STYLESHEETS (ADAPTED FROM ViewTaskScreen)
// ----------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  container: { padding: 20, paddingBottom: 50 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backButton: { marginRight: 10 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.MainText },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.Background },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.SubtleText },

  card: {
    backgroundColor: COLORS.White,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.SubtleText, marginBottom: 5 },
  detailText: { fontSize: 18, fontWeight: '600', color: COLORS.MainText },
  detailTextSmall: { fontSize: 16, fontWeight: '600', color: COLORS.MainText },
  descriptionText: { fontSize: 16, color: COLORS.MainText, lineHeight: 24 },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 20,
    backgroundColor: COLORS.White,
    borderRadius: 16,
    borderWidth: 2,
    // Note: Border color is dynamic, set to PrimaryAccent in component
  },
  statusText: { marginLeft: 10, fontSize: 18, fontWeight: '900', color: COLORS.MainText, flexShrink: 1 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  infoItem: {
    backgroundColor: COLORS.White,
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pill: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, alignSelf: 'flex-start', marginTop: 5 },
  pillText: { color: COLORS.White, fontWeight: 'bold', fontSize: 14 },

  actionButtonContainer: { flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' },
  actionButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 12, marginHorizontal: 5, elevation: 4, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  editButton: { backgroundColor: COLORS.White, borderWidth: 1, borderColor: COLORS.PrimaryAccent, shadowColor: COLORS.SubtleText },
  deleteButton: { shadowColor: COLORS.SecondaryAccent }, // Distinct color for delete
  actionButtonText: { color: COLORS.White, fontSize: 16, fontWeight: '900' },
  
  // Custom styles for Note media indicator
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  metadataText: {
    fontSize: 14,
    color: COLORS.PrimaryAccent,
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default ViewNoteScreen;