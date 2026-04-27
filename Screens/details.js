import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Details({ route, navigation }) {
  const { item } = route.params;

  return (
    <SafeAreaView style={styles.container}>

      {/* BACK */}
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView>

        {/* SLIDESHOW */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {item.images.map((img, index) => (
            <Image key={index} source={img} style={styles.image} />
          ))}
        </ScrollView>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.location}>📍 {item.location}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>

          <Text style={styles.desc}>
            This is a beautiful destination where you can explore nature and enjoy amazing experiences.
          </Text>

          {/* TRIPADVISOR BUTTON */}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              const query = encodeURIComponent(item.name + " " + item.location);
              const url = `https://www.tripadvisor.com/Search?q=${query}`;
              Linking.openURL(url);
            }}
          >
            <Text style={styles.btnText}>View on TripAdvisor</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  image: {
    width: width,
    height: 300,
  },

  back: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },

  content: { padding: 20 },

  title: { fontSize: 22, fontWeight: '600' },

  location: { color: '#777', marginTop: 5 },

  rating: { marginTop: 10 },

  desc: { marginTop: 15 },

  btn: {
    backgroundColor: '#2F6FED',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '600' },
});