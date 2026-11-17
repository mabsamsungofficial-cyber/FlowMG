import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Video, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [script, setScript] = useState(
    'MrBeast ka secret 5-step model samajhte hain. Agar kisi ki 500 rupaye madad karke video banayein, toh brand mast promotion karta hai. Video chali toh views aate hain aur agla sponsor double budget deta hai.'
  );
  const [creativeDirection, setCreativeDirection] = useState('');
  const [voiceName, setVoiceName] = useState('Puck');
  const [apiKey, setApiKey] = useState('');
  const [serverUrl, setServerUrl] = useState('http://192.168.1.12:3001');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Job & Progress State
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [stepMessage, setStepMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<Video>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleStartGeneration = async () => {
    if (!script.trim()) {
      Alert.alert('Script Required', 'Please enter your video script or story first.');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMsg(null);
      setVideoUrl(null);
      setProgress(5);
      setStepMessage('1. AI Director conceiving visual metaphors & scene graph...');

      const endpoint = `${serverUrl.replace(/\/$/, '')}/api/generate-video`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          creativeDirection: creativeDirection.trim() || undefined,
          apiKey: apiKey.trim() || undefined,
          voiceName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setJobId(data.jobId);
      startPollingStatus(data.jobId);
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMsg(err.message || 'Could not connect to render server. Check Server URL.');
      Alert.alert('Connection Error', `Failed to reach render server at ${serverUrl}.\n\nEnsure backend is running.`);
    }
  };

  const startPollingStatus = (currentJobId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const statusEndpoint = `${serverUrl.replace(/\/$/, '')}/api/job-status/${currentJobId}`;
        const res = await fetch(statusEndpoint);
        if (!res.ok) return;

        const jobData = await res.json();
        setProgress(jobData.progress || 0);
        setStepMessage(jobData.stepMessage || '');

        if (jobData.status === 'completed') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setIsGenerating(false);
          let finalVideoUrl = jobData.videoUrl;
          if (finalVideoUrl) {
            const serverOrigin = serverUrl.replace(/\/$/, '');
            finalVideoUrl = finalVideoUrl.replace(/^http:\/\/[^/]+/, serverOrigin);
          }
          setVideoUrl(finalVideoUrl);
          Alert.alert('Success!', 'Your AI-Generated Video Reel is ready!');
        } else if (jobData.status === 'failed') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setIsGenerating(false);
          setErrorMsg(jobData.error || 'Video rendering failed.');
          Alert.alert('Render Failed', jobData.error || 'Unknown error occurred.');
        }
      } catch (e) {
        console.warn('Status poll warning:', e);
      }
    }, 1500);
  };

  const handleDownloadAndShare = async () => {
    if (!videoUrl) return;

    try {
      const filename = `reel_${Date.now()}.mp4`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      Alert.alert('Downloading Video', 'Saving video file to device storage...');
      const downloadResult = await FileSystem.downloadAsync(videoUrl, fileUri);

      if (downloadResult.status === 200) {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: 'video/mp4',
            dialogTitle: 'Share your AI-Generated Video Reel',
          });
        } else {
          Alert.alert('Saved!', `Video saved locally to: ${downloadResult.uri}`);
        }
      } else {
        throw new Error('Download failed with status: ' + downloadResult.status);
      }
    } catch (err: any) {
      Alert.alert('Download Error', err.message || 'Failed to download video.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>✦</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>FlowMG AI Studio</Text>
            <Text style={styles.headerSubtitle}>Autonomous Script-to-Video Engine</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.settingsButton} onPress={() => setIsSettingsOpen(true)}>
          <Text style={styles.settingsButtonText}>⚙ Config</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Story Input Card */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputCardTitle}>Story / Script</Text>
            <Text style={styles.charCount}>
              {script.split(/\s+/).filter(Boolean).length} words
            </Text>
          </View>

          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Type or paste any Hindi, Hinglish, or English story here..."
            placeholderTextColor="#64748B"
            value={script}
            onChangeText={setScript}
          />
        </View>

        {/* Optional Creative Direction */}
        <View style={[styles.inputCard, { marginTop: 12 }]}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputCardTitle}>Creative Direction (Optional)</Text>
            <Text style={styles.charCount}>AI Guidance</Text>
          </View>

          <TextInput
            style={[styles.textInput, { minHeight: 45 }]}
            placeholder="e.g. Focus on unit economics, or keep it high-energy..."
            placeholderTextColor="#64748B"
            value={creativeDirection}
            onChangeText={setCreativeDirection}
          />
        </View>

        {/* Voice Selector */}
        <Text style={styles.sectionLabel}>AI VOICEOVER NARRATOR</Text>
        <View style={styles.voiceRow}>
          {['Puck', 'Aoede', 'Fenrir', 'Kore'].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.voicePill, voiceName === v && styles.voicePillActive]}
              onPress={() => setVoiceName(v)}
            >
              <Text style={[styles.voicePillText, voiceName === v && styles.textWhiteBold]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Error Notification */}
        {errorMsg && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠ {errorMsg}</Text>
          </View>
        )}

        {/* Generate CTA Button */}
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          disabled={isGenerating}
          onPress={handleStartGeneration}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.generateButtonText}>DIRECT & GENERATE VIDEO</Text>
          )}
        </TouchableOpacity>

        {/* Step-by-Step Progress Card */}
        {isGenerating && (
          <View style={styles.progressCard}>
            <Text style={styles.progressStatusHeader}>AUTONOMOUS AI PIPELINE</Text>
            <Text style={styles.stepMessageText}>{stepMessage}</Text>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressPercentText}>{progress}% Complete</Text>
          </View>
        )}

        {/* Completed Video Player Preview */}
        {videoUrl && (
          <View style={styles.videoPreviewCard}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoTitle}>Rendered Reel (1080x1920 @ 60fps)</Text>
              <View style={styles.badge60fps}>
                <Text style={styles.badgeText}>60 FPS</Text>
              </View>
            </View>

            <View style={styles.playerContainer}>
              <Video
                ref={videoRef}
                style={styles.videoPlayer}
                source={{ uri: videoUrl }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
              />
            </View>

            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadAndShare}>
              <Text style={styles.downloadButtonText}>⬇ Save to Gallery & Share</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Settings Modal */}
      <Modal visible={isSettingsOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>AI Engine Settings</Text>

            <Text style={styles.configLabel}>Gemini API Key</Text>
            <TextInput
              style={styles.configInput}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="AIzaSy... (leave blank to use built-in key)"
              placeholderTextColor="#64748B"
              secureTextEntry
              autoCapitalize="none"
            />
            <Text style={styles.configHint}>
              Powers live conversational voiceover generation and real-time script breakdown.
            </Text>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsSettingsOpen(false)}
            >
              <Text style={styles.modalCloseButtonText}>Save & Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07090E',
    paddingTop: Platform.OS === 'android' ? 40 : 54,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E11D48',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  logoIconText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#1E2433',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 10,
  },
  inputCard: {
    backgroundColor: '#0F131C',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  charCount: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 110,
    textAlignVertical: 'top',
  },
  voiceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  voicePill: {
    flex: 1,
    backgroundColor: '#0F131C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  voicePillActive: {
    borderColor: '#E11D48',
    backgroundColor: '#E11D48',
  },
  voicePillText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  textWhiteBold: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#E11D48',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 22,
    shadowColor: '#E11D48',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  progressCard: {
    backgroundColor: '#0F131C',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
    padding: 20,
    marginTop: 20,
  },
  progressStatusHeader: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  stepMessageText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#1E2433',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E11D48',
    borderRadius: 5,
  },
  progressPercentText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  videoPreviewCard: {
    backgroundColor: '#0F131C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 18,
    marginTop: 24,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  badge60fps: {
    backgroundColor: '#E11D48',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  playerContainer: {
    width: '100%',
    height: 480,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 14,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  downloadButton: {
    backgroundColor: '#1E2433',
    borderWidth: 1,
    borderColor: '#E11D48',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0F131C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 18,
  },
  configLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  configInput: {
    backgroundColor: '#161B26',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  configHint: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
  },
  modalCloseButton: {
    backgroundColor: '#E11D48',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
