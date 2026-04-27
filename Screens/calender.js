import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [destination, setDestination] = useState('');

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const openFlights = () => {
    if (!selectedDate || !destination) return;

    const url = `https://www.google.com/travel/flights?q=flights%20to%20${destination}%20on%20${selectedDate}`;
    Linking.openURL(url);
  };

  const openHotels = () => {
    if (!selectedDate || !destination) return;

    const url = `https://www.booking.com/searchresults.html?ss=${destination}&checkin=${selectedDate}&checkout=${selectedDate}`;
    Linking.openURL(url);
  };

  const openTours = () => {
    if (!selectedDate || !destination) return;

    const url = `https://www.google.com/search?q=tours+in+${destination}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Plan Your Trip</Text>

      {/* 🌍 Destination */}
      <TextInput
        placeholder="Enter destination (e.g. Sydney)"
        value={destination}
        onChangeText={setDestination}
        style={styles.input}
      />

      {/* 📅 Calendar */}
      <Calendar
        onDayPress={onDayPress}
        markedDates={
          selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#007BFF',
                },
              }
            : {}
        }
      />

      {/* 📅 Info */}
      {selectedDate && destination && (
        <Text style={styles.infoText}>
          {destination} on {selectedDate}
        </Text>
      )}

      {/* ✈️ Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openFlights}>
          <Text style={styles.buttonText}>Search Flights</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openHotels}>
          <Text style={styles.buttonText}>Search Hotels</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openTours}>
          <Text style={styles.buttonText}>Explore Tours</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});