import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>

      
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Ionicons name="arrow-back" size={20} color="#333" />
      </TouchableOpacity>

      
      <View style={styles.center}>

        <Text style={styles.title}>Forgot password</Text>

        <Text style={styles.subtitle}>
          Enter your email account to reset{'\n'}your password
        </Text>

        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => {
            if (!email) return; 
            setShowModal(true);
          }}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

      </View>

      
      <Modal transparent visible={showModal} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => {
            setShowModal(false);
            navigation.navigate('OTP', { email }); 
          }}
        >
          <View style={styles.popup}>

            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={24} color="#fff" />
            </View>

            <Text style={styles.popupTitle}>Check your email</Text>

            <Text style={styles.popupText}>
              We have sent password recovery{"\n"}
              instruction to your email
            </Text>

          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  back: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#8a8a8a',
    marginTop: 10,
    marginBottom: 35,
    lineHeight: 20,
  },

  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
  },

  button: {
    backgroundColor: '#2F6FED',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  popupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  popupText: {
    textAlign: 'center',
    color: '#777',
    lineHeight: 20,
  },
});