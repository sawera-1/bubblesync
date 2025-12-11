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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 🎨 Color Palette
const COLORS = {
  PrimaryAccent: '#48C2B3', // Teal/Aqua (Low Priority / Save Button)
  SecondaryAccent: '#F56F64', // Coral/Red-Orange (High Priority)
  MediumPriority: '#FFB74D', // Amber (Medium Priority)
  Background: '#fefefe',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
  InputBg: '#FFFFFF',
};

// Priority options with icons and colors
const PRIORITY_OPTIONS = [
  { label: 'High', value: 'High', color: COLORS.SecondaryAccent, icon: 'fire' },
  { label: 'Medium', value: 'Medium', color: COLORS.MediumPriority, icon: 'alert-circle' },
  { label: 'Low', value: 'Low', color: COLORS.PrimaryAccent, icon: 'leaf' },
];

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [priority, setPriority] = useState(PRIORITY_OPTIONS[2].value); // Default Low

  // Save task handler
  const handleSaveTask = () => {
    if (!title.trim()) {
      alert('Task title cannot be empty!');
      return;
    }
    console.log('New Task:', { title, detail, priority });
    // navigation.goBack(); // Uncomment if you want to return to previous screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Text style={styles.headerTitle}>➕ Create New Task</Text>

        {/* Task Title */}
        <Text style={styles.label}>Task Title</Text>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="format-title" size={20} color={COLORS.SubtleText} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter task title (e.g., Send Report)"
            placeholderTextColor={COLORS.SubtleText}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Priority Selector */}
        <Text style={styles.label}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {PRIORITY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.priorityButton,
                { borderColor: option.color },
                priority === option.value && { backgroundColor: option.color, borderWidth: 0 },
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
        <Text style={styles.label}>Task Detail / Description</Text>
        <View style={[styles.inputWrapper, styles.detailInputWrapper]}>
          <MaterialCommunityIcons
            name="text-box-multiple-outline"
            size={20}
            color={COLORS.SubtleText}
            style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 15 }]}
          />
          <TextInput
            style={[styles.input, styles.detailInput]}
            placeholder="Add specific steps, notes, or details..."
            placeholderTextColor={COLORS.SubtleText}
            multiline
            numberOfLines={4}
            value={detail}
            onChangeText={setDetail}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
          <MaterialCommunityIcons name="check-circle-outline" size={24} color={COLORS.White} style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Complete & Save Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// -------------------------------------------------------------
// 💅 Styles
// -------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  container: {
    padding: 25,
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.MainText,
    marginBottom: 35,
    alignSelf: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.MainText,
    marginBottom: 10,
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.InputBg,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.MainText,
    paddingVertical: Platform.OS === 'android' ? 12 : 15,
  },
  detailInputWrapper: {
    alignItems: 'flex-start',
  },
  detailInput: {
    minHeight: 120,
    paddingVertical: 15,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
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
  priorityText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PrimaryAccent,
    borderRadius: 12,
    paddingVertical: 18,
    marginTop: 50,
    shadowColor: COLORS.PrimaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  saveButtonText: {
    color: COLORS.White,
    fontSize: 18,
    fontWeight: '900',
  },
});

export default AddTaskScreen;
