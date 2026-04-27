import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OTP({ route, navigation }) {
  const { email } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(90); 


  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <SafeAreaView style={styles.container}>

      
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#333" />
      </TouchableOpacity>

      <View style={styles.center}>

        <Text style={styles.title}>OTP Verification</Text>

        <Text style={styles.subtitle}>
          Please check your email{"\n"}
          <Text style={styles.email}>{email}</Text>{"\n"}
          to see the verification code
        </Text>

        <Text style={styles.label}>OTP Code</Text>

       
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

      
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Resend code to</Text>
          <Text style={styles.timer}>{formatTime()}</Text>
        </View>

      </View>

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
    color: '#777',
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 20,
  },

  email: {
    fontWeight: '600',
    color: '#333',
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  otpBox: {
    width: 60,
    height: 60,
    backgroundColor: '#f3f3f3',
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 18,
  },

  button: {
    backgroundColor: '#2F6FED',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  resendText: {
    color: '#777',
  },

  timer: {
    color: '#777',
  },
});