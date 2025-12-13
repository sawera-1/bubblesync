import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  MediumPriority: '#FFB74D',
  Background: '#f0f2f5',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
  NotePhysics: '#81c784',
};

const PRIORITY_OPTIONS = {
  high: { label: 'High Priority', color: COLORS.SecondaryAccent, icon: 'fire' },
  medium: { label: 'Medium Priority', color: COLORS.MediumPriority, icon: 'alert-circle' },
  low: { label: 'Low Priority', color: COLORS.PrimaryAccent, icon: 'leaf' },
};

// --- Android status bar padding ---
const androidStatusPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

// --- Helper to format date safely ---
const formatDate = (createdAt) => {
  if (!createdAt) return 'N/A';
  const date =
    typeof createdAt === 'string'
      ? new Date(createdAt)
      : createdAt.toDate
      ? createdAt.toDate()
      : createdAt;
  return date.toLocaleDateString();
};

const ViewTaskScreen = ({ navigation, route }) => {
  const { taskId } = route.params;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('task')
      .doc(taskId)
      .onSnapshot(
        (docSnapshot) => {
          if (docSnapshot.exists) {
            setTask({ id: docSnapshot.id, ...docSnapshot.data() });
          } else {
            alert('Task not found or has been removed.');
            navigation.goBack();
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to task:', error);
          alert('Failed to load task details.');
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, [taskId, navigation]);

  const handleToggleCompletion = async () => {
    if (!task) return;
    const isCurrentlyDone = task.completed === true;
    try {
      await firestore().collection('task').doc(taskId).update({
        completed: !isCurrentlyDone,
        completedAt: !isCurrentlyDone ? firestore.FieldValue.serverTimestamp() : null,
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      alert('Failed to update task status.');
    }
  };

  const handleEdit = () => {
    task?.id && navigation.navigate('EditTask', { taskId: task.id });
  };

  if (loading || !task) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PrimaryAccent} />
        <Text style={styles.loadingText}>Loading task details...</Text>
      </View>
    );
  }

  const priorityKey = (task.priority || 'low').toLowerCase();
  const priorityInfo = PRIORITY_OPTIONS[priorityKey] || PRIORITY_OPTIONS.low;
  const isDone = task.completed === true;

  const getToggleButtonColor = () => (isDone ? COLORS.SecondaryAccent : COLORS.NotePhysics);

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: androidStatusPadding }]}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.PrimaryAccent} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>Task Detail</Text>
          </View>
        </View>

        {/* Status */}
        <View style={[styles.statusCard, { borderColor: isDone ? COLORS.NotePhysics : priorityInfo.color }]}>
          <MaterialCommunityIcons
            name={isDone ? 'check-circle' : 'progress-alert'}
            size={30}
            color={isDone ? COLORS.NotePhysics : priorityInfo.color}
          />
          <Text style={styles.statusText}>{isDone ? 'Task Completed' : 'Task Pending'}</Text>
        </View>

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.detailText}>{task.title}</Text>
        </View>

        {/* Priority & Created Date */}
        <View style={styles.infoRow}>
          <View style={[styles.infoItem, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Priority</Text>
            <View style={[styles.pill, { backgroundColor: priorityInfo.color }]}>
              <MaterialCommunityIcons
                name={priorityInfo.icon}
                size={16}
                color={COLORS.White}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.pillText}>{priorityInfo.label}</Text>
            </View>
          </View>
          <View style={[styles.infoItem, { flex: 0.8 }]}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.detailTextSmall}>{formatDate(task.createdAt)}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.label}>Details / Description</Text>
          <Text style={styles.descriptionText}>
            {task.description || 'No detailed description provided for this task.'}
          </Text>
        </View>

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
            <Text style={[styles.actionButtonText, { color: COLORS.PrimaryAccent }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.toggleButton, { backgroundColor: getToggleButtonColor() }]}
            onPress={handleToggleCompletion}
          >
            <MaterialCommunityIcons
              name={isDone ? 'close-circle-outline' : 'check-circle-outline'}
              size={24}
              color={COLORS.White}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionButtonText}>{isDone ? 'Mark Undone' : 'Mark Done'}</Text>
          </TouchableOpacity>
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
  },
  statusText: { marginLeft: 10, fontSize: 18, fontWeight: '900', color: COLORS.MainText },

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
  toggleButton: { shadowColor: COLORS.NotePhysics },
  actionButtonText: { color: COLORS.White, fontSize: 16, fontWeight: '900' },
});

export default ViewTaskScreen;
