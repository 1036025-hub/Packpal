import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { db, auth } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function CreatePost({ navigation }) {

  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  // PICK MULTIPLE IMAGES
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setImages(uris);
    }
  };

  // CLOUDINARY UPLOAD
  const uploadToCloudinary = async (uri) => {
    const data = new FormData();

    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    data.append("upload_preset", "Packpal");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/divmvowga/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  // CREATE POST
  const handlePost = async () => {
    if (images.length === 0) return;

    setLoading(true);

    let uploaded = [];

    for (let uri of images) {
      const url = await uploadToCloudinary(uri);
      if (url) uploaded.push(url);
    }

    await addDoc(collection(db, "posts"), {
      userId: auth.currentUser.uid,
      name: auth.currentUser.email,
      images: uploaded,
      caption,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity style={styles.pickBtn} onPress={pickImages}>
        <Text>Select Images</Text>
      </TouchableOpacity>

      {/* PREVIEW */}
      <ScrollView horizontal>
        {images.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={styles.preview} />
        ))}
      </ScrollView>

      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />

      <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
        <Text style={{ color: '#fff' }}>
          {loading ? "Posting..." : "Post"}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  pickBtn: {
    backgroundColor: '#eee',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },

  preview: {
    width: 120,
    height: 120,
    margin: 10,
    borderRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
  },

  postBtn: {
    backgroundColor: '#2F6FED',
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
});