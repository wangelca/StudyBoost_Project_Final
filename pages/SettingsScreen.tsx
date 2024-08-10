import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen: React.FC = () => {
  const [frequency, setFrequency] = useState<string>('none');
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [studyReminderFrequency, setStudyReminderFrequency] = useState<string>('none');
  const [appNotificationsEnabled, setAppNotificationsEnabled] = useState<boolean>(true);

  const handleClearAccountData = async () => {
    Alert.alert('Clear Account Data', 'Are you sure you want to clear your account data?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: async () => {
        try {
          await AsyncStorage.clear();
          console.log('Account data cleared');
        } catch (error) {
          console.error('Failed to clear account data:', error);
        }
      }},
    ]);
  };

  const handleManageMotivationalMessages = () => {
    Alert.alert(
      'Manage Motivational Messages',
      `Time Frequency: ${frequency}\nVibrate: ${vibrateEnabled ? 'Enabled' : 'Disabled'}`,
      [
        { text: 'Change Frequency', onPress: () => changeMotivationalFrequency() },
        { text: 'Toggle Vibrate', onPress: () => toggleMotivationalVibrate() },
      ]
    );
  };

  const handleManageStudyReminders = () => {
    Alert.alert(
      'Manage Study Reminders',
      `Reminder Frequency: ${studyReminderFrequency}\nNotifications: ${appNotificationsEnabled ? 'Enabled' : 'Disabled'}`,
      [
        { text: 'Change Frequency', onPress: () => changeStudyReminderFrequency() },
        { text: 'Toggle Notifications', onPress: () => toggleStudyNotifications() },
      ]
    );
  };

  const handleManageAppNotifications = () => {
    Alert.alert(
      'Manage App Notifications',
      `App Notifications: ${appNotificationsEnabled ? 'Enabled' : 'Disabled'}`,
      [
        { text: 'Toggle Notifications', onPress: () => toggleAppNotifications() },
      ]
    );
  };

  const changeMotivationalFrequency = () => {
    Alert.alert(
      'Select Frequency',
      'Choose the frequency for receiving motivational messages:',
      [
        { text: 'Every 2 Hours', onPress: () => setFrequency('2 hours') },
        { text: 'Maximum 5 Times a Day', onPress: () => setFrequency('5 times a day') },
        { text: 'Once a Day', onPress: () => setFrequency('once a day') },
        { text: 'None at All', onPress: () => setFrequency('none') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const toggleMotivationalVibrate = () => {
    setVibrateEnabled(prev => !prev);
  };

  const changeStudyReminderFrequency = () => {
    Alert.alert(
      'Select Reminder Frequency',
      'Choose the frequency for study reminders:',
      [
        { text: 'Once a Day', onPress: () => setStudyReminderFrequency('once a day') },
        { text: 'Twice a Day', onPress: () => setStudyReminderFrequency('twice a day') },
        { text: 'Once a Week', onPress: () => setStudyReminderFrequency('once a week') },
        { text: 'Never', onPress: () => setStudyReminderFrequency('never') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const toggleStudyNotifications = () => {
    setAppNotificationsEnabled(prev => !prev);
  };

  const toggleAppNotifications = () => {
    setAppNotificationsEnabled(prev => !prev);
  };

  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity style={styles.option} onPress={handleManageMotivationalMessages}>
        <Text style={styles.optionText}>Manage Motivational Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleManageStudyReminders}>
        <Text style={styles.optionText}>Manage Study Reminders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleManageAppNotifications}>
        <Text style={styles.optionText}>Manage App Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleClearAccountData}>
        <Text style={styles.optionText}>Clear Account Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#305d8f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  option: {
    backgroundColor: '#003366',
    padding: 15,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;









