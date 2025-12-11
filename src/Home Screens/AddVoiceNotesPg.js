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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 🎨 Color Palette (Consistent)
const COLORS = {
  PrimaryAccent: '#48C2B3', // Teal/Aqua (Save Button)
  SecondaryAccent: '#F56F64', // Coral/Red-Orange (Recording Indicator)
  Background: '#fefefe',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
  InputBg: '#FFFFFF',
  DarkRed: '#CC3333', // Darker red for recording state
};

// --- SIMULATED DATA ---
const SIMULATED_TRANSCRIPT = 
    "Meeting summary: I discussed the Q3 marketing strategy, focusing heavily on social media engagement and budget allocation for the next quarter. Remember to follow up with John on the creative assets by Friday.";
const RECORDING_DURATION_MS = 3000;
const PROCESSING_DURATION_MS = 2000;


const VoiceNoteScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fields to be populated/edited by the user after transcription
  const [noteName, setNoteName] = useState('');
  const [description, setDescription] = useState('');
  const [convertedText, setConvertedText] = useState('');

  // --- Voice Recording Logic Simulation ---
  const handleRecordButtonPress = () => {
    if (isRecording) {
      // 1. Stop Recording -> Start Processing
      setIsRecording(false);
      setIsProcessing(true);

      // Simulate transcription time
      setTimeout(() => {
        setIsProcessing(false);
        
        // Populate fields with simulated transcribed data
        const voiceName = `Voice Note - ${new Date().toLocaleTimeString()}`;
        setNoteName(voiceName);
        setConvertedText(SIMULATED_TRANSCRIPT);
        // Often, the first sentence is used as a short description/detail
        setDescription(SIMULATED_TRANSCRIPT.substring(0, SIMULATED_TRANSCRIPT.indexOf('.')) + '.');
      }, PROCESSING_DURATION_MS);

    } else {
      // 2. Start Recording
      setNoteName('');
      setDescription('');
      setConvertedText('');
      
      setIsRecording(true);
      
      // Simulate automatic stop after duration
      setTimeout(() => {
        if (isRecording) { // Check if user hasn't stopped it manually
            handleRecordButtonPress(); 
        }
      }, RECORDING_DURATION_MS);
    }
  };
  
  // --- Save Logic ---
  const handleSaveVoiceNote = () => {
    if (!noteName.trim() || !convertedText.trim()) {
        alert("Please record a voice note and provide a name before saving.");
        return;
    }
    
    const voiceNoteData = {
        name: noteName,
        detail: description,
        fullTranscript: convertedText,
        timestamp: new Date().toISOString(),
    };

    console.log('Voice Note Saved:', voiceNoteData);
    
    // Reset state after saving
    setNoteName('');
    setDescription('');
    setConvertedText('');
    // navigation.goBack(); // Uncomment to return to previous screen
  };

  const showInputFields = convertedText.length > 0 && !isRecording && !isProcessing;

  return (
    <SafeAreaView style={voiceStyles.safeArea}>
      <ScrollView contentContainerStyle={voiceStyles.container} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <Text style={voiceStyles.headerTitle}>🎙️ AI Voice Note</Text>

        {/* --- RECORDING BUTTON AREA --- */}
        <View style={voiceStyles.recordArea}>
            <TouchableOpacity 
                style={[
                    voiceStyles.recordButton, 
                    isRecording && voiceStyles.recordButtonRecording
                ]}
                onPress={handleRecordButtonPress}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <ActivityIndicator size="large" color={COLORS.White} />
                ) : (
                    <MaterialCommunityIcons 
                        name={isRecording ? "stop" : "microphone"} 
                        size={50} 
                        color={COLORS.White} 
                    />
                )}
            </TouchableOpacity>
            
            <Text style={voiceStyles.recordTipText}>
                {isRecording 
                    ? "Recording... Tap to stop" 
                    : isProcessing 
                    ? "Processing audio..." 
                    : "Tap to start recording"
                }
            </Text>
        </View>

        {/* --- TRANSCRIPTION & EDITING AREA --- */}
        {showInputFields && (
            <View style={voiceStyles.editingSection}>
                
                {/* 1. Voice Name Input */}
                <Text style={voiceStyles.label}>Voice Note Name</Text>
                <View style={voiceStyles.inputWrapper}>
                    <MaterialCommunityIcons name="tag" size={20} color={COLORS.SubtleText} style={voiceStyles.inputIcon} />
                    <TextInput
                        style={voiceStyles.input}
                        placeholder="e.g., Q3 Meeting Summary"
                        placeholderTextColor={COLORS.SubtleText}
                        value={noteName}
                        onChangeText={setNoteName}
                    />
                </View>

                {/* 2. Description/Detail Input */}
                <Text style={voiceStyles.label}>Description/Detail</Text>
                <View style={voiceStyles.inputWrapper}>
                    <MaterialCommunityIcons name="note-text-outline" size={20} color={COLORS.SubtleText} style={voiceStyles.inputIcon} />
                    <TextInput
                        style={voiceStyles.input}
                        placeholder="Short summary or category..."
                        placeholderTextColor={COLORS.SubtleText}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* 3. Converted Text (Full Transcript) */}
                <Text style={voiceStyles.label}>Converted Transcript (Editable)</Text>
                <View style={[voiceStyles.inputWrapper, voiceStyles.detailInputWrapper]}>
                    <MaterialCommunityIcons
                        name="file-document-edit-outline"
                        size={20}
                        color={COLORS.SubtleText}
                        style={[voiceStyles.inputIcon, { alignSelf: 'flex-start', marginTop: 15 }]}
                    />
                    <TextInput
                        style={[voiceStyles.input, voiceStyles.detailInput]}
                        placeholder="Your transcribed text will appear here..."
                        placeholderTextColor={COLORS.SubtleText}
                        multiline
                        numberOfLines={8}
                        value={convertedText}
                        onChangeText={setConvertedText}
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity style={voiceStyles.saveButton} onPress={handleSaveVoiceNote}>
                    <MaterialCommunityIcons name="content-save-outline" size={24} color={COLORS.White} style={{ marginRight: 8 }} />
                    <Text style={voiceStyles.saveButtonText}>Save Voice Note</Text>
                </TouchableOpacity>

            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// -------------------------------------------------------------
// 💅 STYLES
// -------------------------------------------------------------
const voiceStyles = StyleSheet.create({
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
        marginBottom: 40,
        alignSelf: 'center',
    },

    // --- Recording Area Styles ---
    recordArea: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 10,
    },
    recordButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.PrimaryAccent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: COLORS.PrimaryAccent,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    recordButtonRecording: {
        backgroundColor: COLORS.DarkRed,
        shadowColor: COLORS.DarkRed,
    },
    recordTipText: {
        fontSize: 16,
        color: COLORS.SubtleText,
        fontWeight: '600',
    },

    // --- Editing/Input Styles (similar to previous 'amazing style') ---
    editingSection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 20,
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
        paddingVertical: 15,
    },
    detailInputWrapper: {
        alignItems: 'flex-start',
    },
    detailInput: {
        minHeight: 180, // Larger area for the full transcript
        paddingVertical: 15,
        textAlignVertical: 'top',
        lineHeight: 22, // Improve readability of long text
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.PrimaryAccent,
        borderRadius: 12,
        paddingVertical: 18,
        marginTop: 40,
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

export default VoiceNoteScreen;