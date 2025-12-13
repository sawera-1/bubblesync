import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { addData } from '../Helper/firebaseHelper';

const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  MediumPriority: '#FFB74D',
  Background: '#f0f2f5',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
};

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'High', color: COLORS.SecondaryAccent, icon: 'fire' },
  { label: 'Medium', value: 'Medium', color: COLORS.MediumPriority, icon: 'alert-circle' },
  { label: 'Low', value: 'Low', color: COLORS.PrimaryAccent, icon: 'leaf' },
];

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [priority, setPriority] = useState(PRIORITY_OPTIONS[2].value);
  const [loading, setLoading] = useState(false);

  const handleSaveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Task title cannot be empty.');
      return;
    }

    const currentUser = auth().currentUser;

    if (!currentUser) {
      Alert.alert('Authentication Error', 'User not logged in.');
      return;
    }

    setLoading(true);

    const newTask = {
      title: title.trim(),
      description: detail.trim(),
      priority: priority.toLowerCase(),
      completed: false,
      createdBy: currentUser.uid,            // ✅ USER ID ADDED
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await addData('task', newTask);

      Alert.alert('Success', 'Task saved successfully!');
      setTitle('');
      setDetail('');
      setPriority(PRIORITY_OPTIONS[2].value);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Android Status Bar Padding */}
      <View style={styles.androidStatusPadding} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.PrimaryAccent} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create New Task</Text>

          <View style={{ width: 28 }} />
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

        {/* Priority */}
        <Text style={styles.label}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {PRIORITY_OPTIONS.map(option => (
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

        {/* Task Details */}
        <View style={styles.card}>
          <Text style={styles.label}>Task Details</Text>
          <TextInput
            style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
            placeholder="Add notes or details..."
            placeholderTextColor={COLORS.SubtleText}
            multiline
            value={detail}
            onChangeText={setDetail}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveTask}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.White} />
          ) : (
            <>
              <MaterialCommunityIcons name="check-circle-outline" size={24} color={COLORS.White} />
              <Text style={styles.saveButtonText}>Save Task</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  androidStatusPadding: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.MainText,
  },
  card: {
    backgroundColor: COLORS.White,
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.MainText,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.MainText,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  priorityText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '700',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.PrimaryAccent,
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.White,
  },
});

export default AddTaskScreen;
