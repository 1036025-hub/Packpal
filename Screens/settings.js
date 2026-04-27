import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch
} from 'react-native';

export default function Settings({ navigation })  {

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: darkMode ? '#121212' : '#f7f7f7' }
    ]}>
    
    <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={22} color="#333" />
  </TouchableOpacity>

  <Text style={styles.title}>Settings</Text>

  <View style={{ width: 22 }} /> 
</View>
      <Text style={[
        styles.title,
        { color: darkMode ? '#fff' : '#000' }
      ]}>
        Settings
      </Text>

    
      <View style={styles.row}>
        <Text style={[styles.text, { color: darkMode ? '#fff' : '#000' }]}>
          Notifications
        </Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      
      <View style={styles.row}>
        <Text style={[styles.text, { color: darkMode ? '#fff' : '#000' }]}>
          Dark Mode
        </Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

   
      <View style={styles.row}>
        <Text style={[styles.text, { color: darkMode ? '#fff' : '#000' }]}>
          Language
        </Text>
        <Text style={{ color: '#2F6FED' }}>English</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
},
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },

  text: {
    fontSize: 16,
  },
});