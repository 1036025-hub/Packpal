import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function SignIn({ navigation }) {
  const [secure, setSecure] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("🔥 Button pressed");

    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    try {
      console.log("⏳ Trying login...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("✅ Login success:", userCredential.user.email);

      // ⚠️ DO NOT navigate manually
      // App.js auth listener handles navigation

    } catch (error) {
      console.log("❌ Login error:", error.code);

      let message = "Something went wrong";

      if (error.code === "auth/user-not-found") {
        message = "User not found. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
      }

      Alert.alert("Login Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>

        {/* BACK */}
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.title}>Sign in now</Text>
        <Text style={styles.subtitle}>
          Please sign in to continue
        </Text>

        {/* EMAIL */}
        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* PASSWORD */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry={secure}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* SIGNUP */}
        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign up
          </Text>
        </Text>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },

  back: {
    marginBottom: 10
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10
  },

  subtitle: {
    color: '#777',
    marginBottom: 20
  },

  input: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20
  },

  passwordInput: {
    flex: 1,
    padding: 14
  },

  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  signupText: {
    textAlign: 'center',
    marginTop: 20
  },

  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold'
  }
});