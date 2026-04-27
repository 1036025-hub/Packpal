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
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function SignUp({ navigation }) {
  const [secure, setSecure] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      // 🔐 Create user (this ALSO logs them in automatically)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // 🧾 Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email: email.toLowerCase(),
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created!");

      // ❌ DO NOT NAVIGATE
      // App.js will automatically switch to Home

    } catch (error) {
      console.log("Signup error:", error.code);

      let message = "Something went wrong";

      if (error.code === "auth/email-already-in-use") {
        message = "Email already in use";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email";
      }

      Alert.alert("Signup Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* BACK */}
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          {/* TITLE */}
          <Text style={styles.title}>Sign up now</Text>
          <Text style={styles.subtitle}>
            Create your account
          </Text>

          {/* NAME */}
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* PASSWORD */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
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

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <Text style={styles.signupText}>
            Already have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.goBack()}
            >
              Sign in
            </Text>
          </Text>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },

  back: { marginBottom: 10 },

  title: { fontSize: 26, fontWeight: 'bold', marginTop: 10 },

  subtitle: { color: '#777', marginBottom: 20 },

  input: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  passwordInput: { flex: 1, padding: 14 },

  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  signupText: {
    textAlign: 'center',
    marginTop: 20,
  },

  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});