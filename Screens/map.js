import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

export default function Map() {

  const [selectedPlace, setSelectedPlace] = useState(null);

  const markers = [
    {
      id: 1,
      title: 'Pokhara',
      latitude: 28.2096,
      longitude: 83.9856,
      image: require('../assets/1.jpg'),
    },
    {
      id: 2,
      title: 'Kathmandu',
      latitude: 27.7172,
      longitude: 85.3240,
      image: require('../assets/1.jpg'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* MAP */}
      {Platform.OS === 'web' ? (
        <View style={styles.fallback}>
          <Ionicons name="map-outline" size={50} color="#999" />
          <Text style={{ marginTop: 10 }}>Map not supported on web</Text>
          <Text style={{ color: '#777' }}>Open in Expo Go (phone)</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 27.7172,
            longitude: 85.3240,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {markers.map((m) => (
            <Marker
              key={m.id}
              coordinate={{
                latitude: m.latitude,
                longitude: m.longitude
              }}
              onPress={() => setSelectedPlace(m)}
            />
          ))}
        </MapView>
      )}

      {/* SEARCH */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#777" />
        <TextInput placeholder="Search places..." style={{ marginLeft: 8 }} />
      </View>

      {/* POPULAR */}
      <View style={styles.popularContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {markers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.popularCard}
              onPress={() => setSelectedPlace(item)}
            >
              {/* ✅ FIXED */}
              <Image source={item.image} style={styles.popularImage} />
              <Text style={styles.popularText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* DETAILS */}
      {selectedPlace && (
        <View style={styles.detailCard}>
          {/* ✅ FIXED */}
          <Image source={selectedPlace.image} style={styles.detailImage} />
          <Text style={styles.detailTitle}>{selectedPlace.title}</Text>
          <Text style={styles.detailDesc}>Popular destination</Text>
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },

  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    elevation: 5,
  },

  popularContainer: {
    position: 'absolute',
    top: 110,
    paddingLeft: 20,
  },

  popularCard: {
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 12,
    padding: 5,
    width: 100,
    elevation: 4,
  },

  popularImage: {
    width: '100%',
    height: 60,
    borderRadius: 10,
  },

  popularText: {
    fontSize: 12,
    marginTop: 5,
  },

  detailCard: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    elevation: 6,
  },

  detailImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },

  detailTitle: {
    fontWeight: '600',
    marginTop: 5,
  },

  detailDesc: {
    color: '#777',
  },

  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#2F6FED',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});