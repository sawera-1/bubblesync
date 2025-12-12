import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context'; 


// ----------------------------------------------------------------------
// 🎨 COLOR PALETTE & HELPERS (Unchanged)
// ----------------------------------------------------------------------
const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  Background: '#fefefe',
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
  NotePhysics: '#81c784', 
  NotePersonal: '#ffcc80',
  NoteMisc: '#ff8a65',
};

const getPriorityDetails = (priority) => {
  const p = priority ? priority.toLowerCase() : 'low';
  switch (p) {
    case 'high':
      return { icon: 'fire', color: COLORS.SecondaryAccent, borderColor: COLORS.SecondaryAccent };
    case 'medium':
    case 'low':
    default:
      return { icon: 'flash', color: COLORS.SubtleText, borderColor: COLORS.NotePhysics };
  }
};

const getNoteColor = (index) => {
  const colors = [COLORS.NotePhysics, COLORS.NotePersonal, COLORS.NoteMisc];
  return colors[index % colors.length];
};


// ----------------------------------------------------------------------
// 🧩 SUB-COMPONENTS (NoteItem updated to include onView)
// ----------------------------------------------------------------------

const TaskItem = ({ task, onEdit, onComplete, onView }) => {
  const { icon, color: iconColor, borderColor } = getPriorityDetails(task.priority);
  const isDone = task.completed === true;
  const cardStyle = isDone ? taskStyles.taskCardDone : taskStyles.taskCard;
  const titleStyle = isDone ? taskStyles.taskTitleDone : taskStyles.taskTitle;
  const detailStyle = isDone ? taskStyles.taskDetailDone : taskStyles.taskDetail;
  const completeIcon = isDone ? 'check-circle' : 'circle-outline';
  const completeColor = isDone ? COLORS.NotePhysics : COLORS.PrimaryAccent;
  const cardBorderColor = isDone ? COLORS.NotePhysics : borderColor;

  return (
    <View style={[cardStyle, { borderLeftColor: cardBorderColor }]}>
      <TouchableOpacity 
        style={taskStyles.taskContent}
        onPress={() => onView(task.id)}
      >
        <Text style={titleStyle} numberOfLines={1}>
          {task.title} <MaterialCommunityIcons 
            name={icon} 
            size={14} 
            color={isDone ? COLORS.SubtleText : iconColor} 
          />
        </Text>
        <Text style={detailStyle}>{task.priority || 'N/A'} | Due: 18:56</Text>
      </TouchableOpacity>
      
      <View style={taskStyles.taskActions}>
        <TouchableOpacity 
          style={taskStyles.actionButton} 
          onPress={() => onEdit(task.id)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color={COLORS.SubtleText} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={taskStyles.actionButton} 
          onPress={() => onComplete(task.id, isDone)} 
        >
          <MaterialCommunityIcons name={completeIcon} size={28} color={completeColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- MODIFIED: Added onView prop to NoteItem ---
const NoteItem = ({ note, onView }) => (
  // Use the onView prop here to navigate when the card is pressed
  <TouchableOpacity 
    style={[noteStyles.noteCard, { backgroundColor: note.color }]}
    onPress={() => onView(note.id)} // View/Navigate to detail screen on press
  >
    <Text style={noteStyles.noteTitle}>{note.title}</Text>
    <Text style={noteStyles.noteText} numberOfLines={3}>{note.text}</Text>
    <View style={noteStyles.noteIcons}>
      {note.audioUrl && <MaterialCommunityIcons name="play-circle-outline" size={24} color={COLORS.White} />}
      <MaterialCommunityIcons name="star-outline" size={20} color={COLORS.White} />
    </View>
  </TouchableOpacity>
);


// ----------------------------------------------------------------------
// 🏠 MAIN SCREEN COMPONENT CONTENT
// ----------------------------------------------------------------------
const HomeScreenContent = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  // --- STATE DECLARATIONS & HANDLERS (Unchanged) ---
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState('all'); 
  const [noteSearchQuery, setNoteSearchQuery] = useState('');

  const handleEditTask = (taskId) => { navigation.navigate('EditTask', { taskId }); };
  const handleViewTask = (taskId) => { navigation.navigate('ViewTask', { taskId }); };
  const handleCompleteTask = async (taskId, isCurrentlyDone) => {
    try {
      await firestore().collection('task').doc(taskId).update({ 
        completed: !isCurrentlyDone,
        completedAt: !isCurrentlyDone ? firestore.FieldValue.serverTimestamp() : null,
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };
  
  // --- HANDLER FOR NOTE VIEWING ---
  const handleViewNote = (noteId) => {
      // Navigate to the View/Edit Note screen
      navigation.navigate('ViewNote', { noteId });
  };


  // ... Firestore Listeners (unchanged) ...
  useEffect(() => {
    const unsubscribeTasks = firestore()
      .collection('task')
      .orderBy('createdAt', 'desc') 
      .onSnapshot(snapshot => {
        const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(taskList);
        setIsLoading(false);
      }, error => console.error('Tasks snapshot error:', error));

    const unsubscribeNotes = firestore()
      .collection('notes')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const noteList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(noteList);
        setIsLoading(false); 
      }, error => console.error('Notes snapshot error:', error));

    return () => {
      unsubscribeTasks();
      unsubscribeNotes();
    };
  }, []);

  // ... Filtered tasks and searched notes logic (unchanged) ...
  const filteredTasks = useMemo(() => {
    const filterLower = taskFilter.toLowerCase();
    const tasksByCompletion = tasks.filter(task => {
        const isCompleted = task.completed === true;
        if (filterLower === 'done') { return isCompleted; } 
        if (filterLower !== 'all') { return !isCompleted; }
        return true; 
    });
    if (filterLower === 'all' || filterLower === 'done') { return tasksByCompletion; } 
    return tasksByCompletion.filter(task => task.priority && task.priority.toLowerCase() === filterLower);
  }, [tasks, taskFilter]);

  const searchedNotes = useMemo(() => {
    if (!noteSearchQuery.trim()) return notes;
    const query = noteSearchQuery.trim().toLowerCase();
    return notes.filter(note => {
      const titleMatch = note.title && note.title.toLowerCase().includes(query);
      const bodyMatch = note.body && note.body.toLowerCase().includes(query);
      return titleMatch || bodyMatch;
    });
  }, [notes, noteSearchQuery]);


  // --- FAB Position Calculation (Unchanged) ---
  const fabBottomPosition = Math.max(20, insets.bottom + 20); 
  const scrollPaddingBottom = fabBottomPosition + 60;

  // --- Render Task View (Unchanged) ---
  const renderTaskView = () => (
    <View style={styles.contentView}>
      <View style={taskStyles.filterContainer}>
        {['All', 'High', 'Medium', 'Low', 'Done'].map((priority) => { 
          const filterKey = priority.toLowerCase();
          let activeColor = COLORS.PrimaryAccent;
          if (filterKey === 'high') activeColor = COLORS.SecondaryAccent;
          if (filterKey === 'done') activeColor = COLORS.NotePhysics;

          const isSelected = taskFilter === filterKey;
          
          return (
            <TouchableOpacity 
              key={priority}
              style={[taskStyles.filterButton, isSelected && { backgroundColor: activeColor }]}
              onPress={() => setTaskFilter(filterKey)}
            >
              <Text style={isSelected ? taskStyles.filterTextActive : taskStyles.filterText}>
                {priority}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollViewBase}
        contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading tasks...</Text>
        ) : filteredTasks.length === 0 ? (
          <Text style={styles.noDataText}>
            {taskFilter === 'all' ? 'No tasks found. Add a new task!' : taskFilter === 'done' ? 'No tasks marked as done.' : `No ${taskFilter} priority tasks found.`}
          </Text>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
              onComplete={handleCompleteTask}
              onView={handleViewTask}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        style={[taskStyles.fabBase, { bottom: fabBottomPosition }]} 
        onPress={() => navigation.navigate('AddTask')}
      >
        <MaterialCommunityIcons name="plus" size={30} color={COLORS.White} />
      </TouchableOpacity>
    </View>
  );

  
  // --- Render Notes View (Updated to pass handleViewNote) ---
  const renderNotesView = () => (
    <View style={styles.contentView}>
      <View style={noteStyles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={COLORS.SubtleText} />
        <TextInput 
          style={noteStyles.searchInput} 
          placeholder="Search notes by title or body..." 
          placeholderTextColor={COLORS.SubtleText} 
          value={noteSearchQuery}
          onChangeText={setNoteSearchQuery}
        />
        <TouchableOpacity>
          <MaterialCommunityIcons name="filter-variant" size={28} color={COLORS.PrimaryAccent} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollViewBase}
        contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading notes...</Text>
        ) : searchedNotes.length === 0 ? (
          <Text style={styles.noDataText}>
            {noteSearchQuery.trim() ? `No results found for "${noteSearchQuery}"` : 'No notes found. Tap the plus button to add one!'}
          </Text>
        ) : (
          <View style={noteStyles.notesGrid}>
            {searchedNotes.map((note, index) => (
              <View key={note.id} style={noteStyles.noteWrapper}>
                <NoteItem
                  note={{
                    id: note.id,
                    title: note.title || 'Untitled Note',
                    text: note.body || note.convertedTranscript || note.detail || 'No content available',
                    color: getNoteColor(index),
                    audioUrl: note.audio,
                  }}
                  // --- MODIFIED: Pass the handleViewNote function ---
                  onView={handleViewNote} 
                />
                
                {/* Keep the Edit button for easy access */}
                <TouchableOpacity
                  style={noteStyles.editButton}
                  onPress={() => navigation.navigate('ViewEditNote', { noteId: note.id })}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={20} color={COLORS.White} />
                  <Text style={noteStyles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={[taskStyles.fabBase, { bottom: fabBottomPosition }]} 
        onPress={() => navigation.navigate('AddNote')} 
      >
        <MaterialCommunityIcons name="plus" size={30} color={COLORS.White} />
      </TouchableOpacity>
    </View>
  );

  // --- Main Render (Unchanged) ---
  return (
    <KeyboardAvoidingView 
        style={styles.mainContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    > 
      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}> 
        <Text style={styles.appTitle}>BubbleSync</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
          <MaterialCommunityIcons name="cog-outline" size={30} color={COLORS.MainText} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainTabToggleContainer}>
        <TouchableOpacity 
          style={[styles.mainTabButton, activeTab === 'tasks' && styles.mainTabActive]} 
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[styles.mainTabText, activeTab === 'tasks' && styles.mainTabTextActive]}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mainTabButton, activeTab === 'notes' && styles.mainTabActive]} 
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.mainTabText, activeTab === 'notes' && styles.mainTabTextActive]}>Notes</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'tasks' ? renderTaskView() : renderNotesView()}
    </KeyboardAvoidingView>
  );
};

// Wrapper to provide safe area context (Unchanged)
const HomeScreen = (props) => (
    <SafeAreaProvider>
        <HomeScreenContent {...props} />
    </SafeAreaProvider>
);

// ----------------------------------------------------------------------
// 🎨 STYLESHEETS (Unchanged)
// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  contentView: {
    paddingHorizontal: 20, 
    paddingTop: 10,
    flex: 1, 
  },
  scrollViewBase: {
    flex: 1,
  },
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
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.SubtleText,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.SubtleText,
  },
});

const taskStyles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.MainText,
  },
  filterTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.White,
  },
  taskCard: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.White,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 6, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  taskCardDone: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e8', 
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 6, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  taskContent: {
    flex: 1,
    paddingRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.MainText,
    marginBottom: 4,
  },
  taskTitleDone: { 
    fontSize: 16,
    fontWeight: 'normal',
    color: COLORS.SubtleText,
    marginBottom: 4,
    textDecorationLine: 'line-through', 
  },
  taskDetail: {
    fontSize: 12,
    color: COLORS.SubtleText,
  },
  taskDetailDone: { 
    fontSize: 12,
    color: COLORS.SubtleText,
    fontStyle: 'italic',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  fabBase: { 
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PrimaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.PrimaryAccent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    zIndex: 10,
  },
});

const noteStyles = StyleSheet.create({
  noteWrapper: {
    width: '48%', 
    marginBottom: 15,
    position: 'relative', 
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PrimaryAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  editButtonText: {
    color: COLORS.White,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
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
    flex: 1, 
    borderRadius: 15,
    padding: 15,
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
});

export default HomeScreen;