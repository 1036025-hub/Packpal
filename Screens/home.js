import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');

  const loadUser = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      setName(data.name || '');
      setPhoto(data.photo || '');
    }
  };

  useEffect(() => {
    loadUser();
    const unsubscribe = navigation.addListener('focus', loadUser);
    return unsubscribe;
  }, [navigation]);

  const destinations = [
     {
      name: 'Ghandruk',
      location: 'Kaski, Nepal',
      rating: 4.7,
      images: [
        require('../assets/g1.webp'),
        require('../assets/g2.jpg'),
        require('../assets/g3.jpg'),
        require('../assets/g4.jpg'),
      ],
    },
    {
      name: 'Pokhara',
      location: 'Nepal',
      rating: 4.8,
      images: [
        require('../assets/p1.avif'),
        require('../assets/p2.jpg'),
        require('../assets/p3.jpg'),
        require('../assets/p4.jpg'),
      ],
    },
    {
      name: 'Bali',
      location: 'Indonesia',
      rating: 4.9,
      images: [
        require('../assets/b1.jpg'),
        require('../assets/b2.webp'),
        require('../assets/b3.jpg'),
        require('../assets/b4.jpg'),
      ],
    },
    {
      name: 'Paris',
      location: 'France',
      rating: 4.7,
      images: [
        require('../assets/pa1.jpg'),
        require('../assets/pa2.webp'),
        require('../assets/pa3.jpg'),
        require('../assets/pa4.webp'),
      ],
    },
  ];

  const ImageSlider = ({ images }) => {
    const flatRef = useRef();
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        const nextIndex = (index + 1) % images.length;
        flatRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setIndex(nextIndex);
      }, 2500);

      return () => clearInterval(interval);
    }, [index]);

    return (
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.cardImage} />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate('Profile')}
          >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : null}

            <Text style={styles.name}>{name || "User"}</Text>
          </TouchableOpacity>

          <Ionicons name="notifications-outline" size={24} />
        </View>

        {/* TITLE */}
        <Text style={styles.title}>
          Explore the{'\n'}
          <Text style={styles.bold}>Beautiful </Text>
          <Text style={styles.orange}>world!</Text>
        </Text>

        {/* DESTINATIONS */}
        {destinations.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate('Details', { item })}
          >
            <ImageSlider images={item.images} />

            <View style={styles.cardContent}>
              <Text style={styles.place}>{item.name}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text>⭐ {item.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },

  profile: { flexDirection: 'row', alignItems: 'center' },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  name: { fontSize: 16 },

  title: {
    fontSize: 28,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  bold: { fontWeight: '700' },

  orange: { color: '#ff7a00', fontWeight: '700' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    overflow: 'hidden',
  },

  cardImage: {
    width: width - 40,
    height: 200,
  },

  cardContent: { padding: 15 },

  place: { fontWeight: '600' },

  location: { color: '#777' },
});