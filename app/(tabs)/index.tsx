import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSalesCall, Difficulty } from '../../hooks/useSalesCall';
import { useCallStore } from '@/store/callStore';
import { usePermission } from '@/hooks/usePermission';
import { Contact, CONTACTS } from '@/types/contacts';

const getDifficultyColor = (difficulty: Difficulty): [string, string] => {
  switch (difficulty) {
    case 'easy': return ['#10B981', '#059669'];
    case 'medium': return ['#F59E0B', '#D97706'];
    case 'hard': return ['#EF4444', '#DC2626'];
  }
};

const getDifficultyLabel = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'easy': return 'Beginner';
    case 'medium': return 'Intermediate';
    case 'hard': return 'Expert';
  }
};

export default function HomeScreen() {
  const { status, isSpeaking } = useCallStore();
  const { startCall, endCall, isReady, error } = useSalesCall();
  const { hasPermission, requestPermission } = usePermission();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    console.log('=== HomeScreen State ===');
    console.log('isReady:', isReady);
    console.log('error:', error);
    console.log('status:', status);
    console.log('selectedContact:', selectedContact?.name || 'none');
  }, [isReady, error, status, selectedContact]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        const { configureAudioSession } = require('@/lib/audioConfig');
        configureAudioSession();
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (status === 'ended') {
      setTimeout(() => {
        setSelectedContact(null);
      }, 2000);
    }
  }, [status]);

  const handleContactPress = (contact: Contact) => {
    console.log('=== Contact Pressed ===');
    console.log('Contact:', contact.name);
    console.log('Current status:', status);
    if (status === 'idle' || status === 'ended') {
      setSelectedContact(contact);
      console.log('Contact selected');
    } else {
      console.log('Cannot select contact, status is:', status);
    }
  };

  const handleCallPress = async () => {
    console.log('=== Call Button Pressed ===');
    console.log('selectedContact:', selectedContact?.name);
    console.log('status:', status);
    console.log('isReady:', isReady);
    console.log('error:', error);
    console.log('hasPermission:', hasPermission);
    
    if (!selectedContact) {
      console.log('ERROR: No contact selected');
      return;
    }

    if (status === 'idle' || status === 'ended') {
      if (!hasPermission) {
        console.log('Requesting microphone permission...');
        const granted = await requestPermission();
        console.log('Permission granted:', granted);
        if (!granted) {
          console.log('Permission denied, cannot start call');
          return;
        }
      }
      console.log('Starting call with difficulty:', selectedContact.difficulty);
      startCall(selectedContact.difficulty);
    } else if (status === 'connected') {
      console.log('Ending call...');
      endCall();
    }
  };

  const handleBackPress = () => {
    if (status === 'idle' || status === 'ended') {
      setSelectedContact(null);
    }
  };

  const getCallButtonColors = (): [string, string] => {
    if (status === 'connected') return ['#EF4444', '#DC2626'];
    if (status === 'connecting') return ['#F59E0B', '#D97706'];
    return ['#10B981', '#059669'];
  };

  const getStatusText = () => {
    if (error) return error;
    if (!isReady) return 'Connecting to server...';
    if (status === 'connecting') return 'Calling...';
    if (status === 'connected') return isSpeaking ? '🗣️ AI Speaking' : '👂 Listening';
    if (status === 'ended') return 'Call ended';
    return 'Tap to call';
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => handleContactPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactRole}>{item.role}</Text>
        <Text style={styles.contactCompany}>{item.company}</Text>
      </View>
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty)[0] }]}>
        <Text style={styles.difficultyBadgeText}>{getDifficultyLabel(item.difficulty)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedContact) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.callingHeader}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#E2E8F0" />
            </TouchableOpacity>
            <Text style={styles.callingTitle}>Sales Call</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.callingContent}>
            <View style={styles.contactAvatarLarge}>
              <Text style={styles.contactAvatarLargeText}>{selectedContact.avatar}</Text>
            </View>

            <Text style={styles.callingName}>{selectedContact.name}</Text>
            <Text style={styles.callingRole}>{selectedContact.role}</Text>
            <Text style={styles.callingCompany}>{selectedContact.company}</Text>

            <LinearGradient
              colors={getDifficultyColor(selectedContact.difficulty)}
              style={styles.callingDifficultyBadge}
            >
              <Text style={styles.callingDifficultyText}>{getDifficultyLabel(selectedContact.difficulty)} Level</Text>
            </LinearGradient>

            <View style={styles.objectivesContainer}>
              <Text style={styles.objectivesTitle}>Call Objectives:</Text>
              {selectedContact.objectives.map((obj, idx) => (
                <Text key={idx} style={styles.objectiveItem}>• {obj}</Text>
              ))}
            </View>

            <Text style={styles.statusTextLarge}>{getStatusText()}</Text>

            <View>
              <TouchableOpacity
                onPress={handleCallPress}
                disabled={status === 'connecting' || !isReady}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={getCallButtonColors()}
                  style={styles.callButton}
                >
                  <Ionicons
                    name={status === 'connected' ? 'call' : 'call-outline'}
                    size={40}
                    color="white"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {status === 'connected' && (
              <Text style={styles.callHint}>Tap to end call</Text>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.logo}>📞 Sales Contacts</Text>
          <Text style={styles.subtitle}>Choose a prospect to call</Text>
        </View>

        <FlatList
          data={CONTACTS}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {Platform.OS === 'web' && (
          <View style={styles.webWarning}>
            <Text style={styles.webWarningText}>📱 Open in Expo Go for voice calls</Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 20 },
  logo: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#94A3B8', marginTop: 8 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  contactCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  contactAvatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12
  },
  contactAvatarText: { fontSize: 28 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  contactRole: { fontSize: 13, color: '#94A3B8', marginBottom: 2 },
  contactCompany: { fontSize: 12, color: '#64748B' },
  difficultyBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  difficultyBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  callingHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 10 
  },
  backButton: { padding: 8 },
  callingTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  callingContent: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 32 
  },
  contactAvatarLarge: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  contactAvatarLargeText: { fontSize: 64 },
  callingName: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  callingRole: { fontSize: 16, color: '#94A3B8', marginBottom: 4, textAlign: 'center' },
  callingCompany: { fontSize: 14, color: '#64748B', marginBottom: 20, textAlign: 'center' },
  callingDifficultyBadge: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginBottom: 24 
  },
  callingDifficultyText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  objectivesContainer: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 32,
    width: '100%'
  },
  objectivesTitle: { fontSize: 14, fontWeight: '700', color: '#FBBF24', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  objectiveItem: { fontSize: 14, color: '#E2E8F0', marginBottom: 8, lineHeight: 20 },
  statusTextLarge: { fontSize: 16, fontWeight: '600', color: '#94A3B8', marginBottom: 24, textAlign: 'center' },
  callButton: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12
  },
  callHint: { fontSize: 14, color: '#64748B', marginTop: 16, textAlign: 'center' },
  webWarning: { 
    backgroundColor: 'rgba(251, 191, 36, 0.1)', 
    borderRadius: 12, 
    padding: 16, 
    margin: 20 
  },
  webWarningText: { fontSize: 14, color: '#FBBF24', textAlign: 'center', fontWeight: '600' },
});
