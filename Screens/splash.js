import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function Splash({ navigation }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.logo}>PackPal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
  },


  logo: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',   
    letterSpacing: 1,
  },
});