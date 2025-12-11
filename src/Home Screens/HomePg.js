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
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 🎨 Color Palette (Consistent with previous screens)
const COLORS = {
  PrimaryAccent: '#48C2B3', // Teal/Aqua Green (used for active buttons/icons)
  SecondaryAccent: '#F56F64', // Coral/Red-Orange (used for Voice Recording/High Priority)
  Background: '#fefefe', // Light background
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
  NotePhysics: '#81c784', // Light Green for Physics note
  NotePersonal: '#ffcc80', // Light Orange for Personal note
  NoteMisc: '#ff8a65', // Reddish-Orange for Misc note
};

// --- Dummy Data (Kept for component demonstration) ---
const dummyTasks = [
  { id: 1, title: 'Review Physics Qs', priority: 'Low', icon: 'flash' },
  { id: 2, title: 'Finish Essay Draft', priority: 'Medium', icon: 'pencil-box-multiple' },
  { id: 3, title: 'Prepare Presentation', priority: 'High Priority', icon: 'fire' },
];
// NOTE: BUBBLE_LOGO_URI is kept but no longer used in the header
const BUBBLE_LOGO_URI = require('../../images/logo.png'); 

const dummyNotes = [
  { id: 1, title: 'Physics', text: 'Quantum cheat sheet... #0303', color: COLORS.NotePhysics },
  { id: 2, title: 'Personal', text: 'Transcribed list... #E0502', color: COLORS.NotePersonal },
  { id: 3, title: 'Misc', text: 'Grocery List: milk, eggs, bread... #AD32', color: COLORS.NoteMisc },
];

// --- Sub-Components (Unchanged) ---
const TaskItem = ({ task }) => (
  <View style={taskStyles.taskCard}>
    <View style={taskStyles.taskContent}>
      <Text style={taskStyles.taskTitle}>
        {task.title} <MaterialCommunityIcons name={task.icon} size={14} color={task.icon === 'fire' ? COLORS.SecondaryAccent : COLORS.SubtleText} />
      </Text>
      <Text style={taskStyles.taskDetail}>
        {task.priority} | Due: 18:56
      </Text>
    </View>
    <View style={taskStyles.taskActions}>
      <TouchableOpacity style={taskStyles.actionButton} onPress={() => console.log('Edit Task:', task.id)}>
        <MaterialCommunityIcons name="pencil-outline" size={20} color={COLORS.SubtleText} />
      </TouchableOpacity>
      <TouchableOpacity style={taskStyles.actionButton} onPress={() => console.log('Complete Task:', task.id)}>
        <MaterialCommunityIcons name="check-circle" size={28} color={COLORS.PrimaryAccent} />
      </TouchableOpacity>
    </View>
  </View>
);

const NoteItem = ({ note }) => (
  <View style={[noteStyles.noteCard, { backgroundColor: note.color }]}>
    <Text style={noteStyles.noteTitle}>{note.title}</Text>
    <Text style={noteStyles.noteText}>{note.text}</Text>
    <View style={noteStyles.noteIcons}>
      <MaterialCommunityIcons name="play-circle-outline" size={24} color={COLORS.White} />
      <MaterialCommunityIcons name="star-outline" size={20} color={COLORS.White} />
    </View>
  </View>
);


// --- Main Screen ---

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  // --- Task List View ---
  const renderTaskView = () => (
    <View style={styles.contentView}>
      {/* Filter Tabs */}
      <View style={taskStyles.filterContainer}>
        <TouchableOpacity 
          style={[taskStyles.filterButton, { backgroundColor: COLORS.SecondaryAccent }]}
          onPress={() => { /* Apply All filter */ }}
        >
          <Text style={taskStyles.filterTextActive}>High</Text>
        </TouchableOpacity>
        <TouchableOpacity style={taskStyles.filterButton}>
          <Text style={taskStyles.filterText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={taskStyles.filterButton}>
          <Text style={taskStyles.filterText}>Low</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {dummyTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}

      {/* Centered Add Task Button (FAB) */}
      <TouchableOpacity style={taskStyles.centeredFab} onPress={() => navigation.navigate('AddTask')}>
        <MaterialCommunityIcons name="plus" size={30} color={COLORS.White} />
      </TouchableOpacity>
    </View>
  );

  // --- Voice Notes View ---
  const renderNotesView = () => (
    <View style={styles.contentView}>
       {/* Search Bar & Filter */}
      <View style={noteStyles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={COLORS.SubtleText} />
        <TextInput
          style={noteStyles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={COLORS.SubtleText}
        />
        <TouchableOpacity>
          <MaterialCommunityIcons name="filter-variant" size={28} color={COLORS.PrimaryAccent} />
        </TouchableOpacity>
      </View>

      {/* Notes Grid */}
      <View style={noteStyles.notesGrid}>
        {dummyNotes.map(note => (
          <NoteItem key={note.id} note={note} />
        ))}
      </View>

      {/* Voice Record Button (Large Red) */}
      <View style={noteStyles.voiceButtonContainer}>
        <TouchableOpacity style={noteStyles.voiceButton} onPress={() => navigation.navigate('AddVoiceNotes')}>
          <View style={noteStyles.voiceButtonInner}>
             <MaterialCommunityIcons name="microphone-variant" size={40} color={COLORS.White} />
          </View>
        </TouchableOpacity>
        <Text style={noteStyles.voiceTipText}>Tap to start voice note</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. TOP HEADER with App Name and Settings Button */}
      <View style={styles.topHeader}>
        {/* App Name Text */}
        <Text style={styles.appTitle}>BubbleSync</Text>
        
        {/* Settings Button */}
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        >
          <MaterialCommunityIcons name="cog-outline" size={30} color={COLORS.MainText} />
        </TouchableOpacity>
      </View>
      
      {/* 2. Main Tab Toggle */}
      <View style={styles.mainTabToggleContainer}>
        <TouchableOpacity
          style={[styles.mainTabButton, activeTab === 'tasks' && styles.mainTabActive]}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[styles.mainTabText, activeTab === 'tasks' && styles.mainTabTextActive]}>
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTabButton, activeTab === 'notes' && styles.mainTabActive]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.mainTabText, activeTab === 'notes' && styles.mainTabTextActive]}>
            Notes
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {activeTab === 'tasks' ? renderTaskView() : renderNotesView()}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Task Specific Styles (Unchanged) ---
const taskStyles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: COLORS.White,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterText: {
    color: COLORS.SubtleText,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.White,
    fontWeight: '600',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.White,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.PrimaryAccent,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.MainText,
    marginBottom: 2,
  },
  taskDetail: {
    fontSize: 13,
    color: COLORS.SubtleText,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
  },
  centeredFab: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
    marginTop: 30, 
    backgroundColor: COLORS.PrimaryAccent,
    borderRadius: 30,
    elevation: 8,
    shadowColor: COLORS.PrimaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});

// --- Notes Specific Styles (Unchanged) ---
const noteStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.White,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.MainText,
    paddingHorizontal: 10,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noteCard: {
    width: '48%', 
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.White,
    marginBottom: 5,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.White,
    opacity: 0.9,
    marginBottom: 20,
  },
  noteIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voiceButtonContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.SecondaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.SecondaryAccent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  voiceButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceTipText: {
    fontSize: 14,
    color: COLORS.SubtleText,
  }
});


// --- General Styles (Updated) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  // TOP HEADER with App Name and Settings Icon
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: COLORS.Background,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.MainText,
  },
  settingsButton: {
    padding: 5,
  },
  // ---
  contentView: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: { // Kept for individual screen headers (Tasks/Notes section titles)
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.MainText,
    marginBottom: 20,
  },
  // Main Toggle Tabs
  mainTabToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.White,
  },
  mainTabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.White,
  },
  mainTabActive: {
    backgroundColor: COLORS.PrimaryAccent,
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.MainText,
  },
  mainTabTextActive: {
    color: COLORS.White,
  },
});

export default HomeScreen;