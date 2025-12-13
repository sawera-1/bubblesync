import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

// Dummy updateData function
const updateData = async (collectionName, docId, data) => {
  return firestore().collection(collectionName).doc(docId).update(data);
};

const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  MediumPriority: '#FFB74D',
  Background: '#f0f2f5',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
  InputBg: '#FFFFFF',
};

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'High', color: COLORS.SecondaryAccent, icon: 'fire' },
  { label: 'Medium', value: 'Medium', color: COLORS.MediumPriority, icon: 'alert-circle' },
  { label: 'Low', value: 'Low', color: COLORS.PrimaryAccent, icon: 'leaf' },
];

const EditTaskScreen = ({ navigation, route }) => {
  const { taskId } = route.params;

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [priority, setPriority] = useState(PRIORITY_OPTIONS[2].value);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch existing task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const doc = await firestore().collection('task').doc(taskId).get();
        if (doc.exists) {
          const taskData = doc.data();
          setTitle(taskData.title || '');
          setDetail(taskData.description || '');
          setPriority(
            taskData.priority
              ? taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)
              : PRIORITY_OPTIONS[2].value
          );
        } else {
          alert('Task not found!');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        alert('Failed to load task data.');
        navigation.goBack();
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTask();
  }, [taskId, navigation]);

  const handleUpdateTask = async () => {
    if (!title.trim()) {
      alert('Task title cannot be empty!');
      return;
    }
    setLoading(true);
    const updatedTask = {
      title: title.trim(),
      description: detail.trim(),
      priority: priority.toLowerCase(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await updateData('task', taskId, updatedTask);
      alert('Task updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PrimaryAccent} />
        <Text style={styles.loadingText}>Loading task for editing...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Android Status Bar Padding */}
      <View style={styles.androidStatusPadding} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.PrimaryAccent} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Edit Task</Text>
          </View>
        </View>

        {/* Task Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            placeholderTextColor={COLORS.SubtleText}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Priority Selector */}
        <Text style={styles.label}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {PRIORITY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.priorityButton,
                { borderColor: option.color },
                priority === option.value && { backgroundColor: option.color },
              ]}
              onPress={() => setPriority(option.value)}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={20}
                color={priority === option.value ? COLORS.White : option.color}
              />
              <Text
                style={[
                  styles.priorityText,
                  { color: priority === option.value ? COLORS.White : option.color },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task Detail */}
        <View style={styles.card}>
          <Text style={styles.label}>Task Details</Text>
          <TextInput
            style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
            placeholder="Add specific steps, notes, or details..."
            placeholderTextColor={COLORS.SubtleText}
            multiline
            value={detail}
            onChangeText={setDetail}
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateTask}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.White} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="content-save-outline"
                size={24}
                color={COLORS.White}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveButtonText}>Update Task</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },

  // Android Status Bar padding
  androidStatusPadding: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  container: { padding: 20, paddingBottom: 50 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: { marginRight: 10 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.MainText,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.Background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.SubtleText,
  },

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

  priorityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: COLORS.White,
  },
  priorityText: { marginLeft: 6, fontSize: 14, fontWeight: '700' },

  saveButton: {
    marginTop: 20,
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

export default EditTaskScreen;
