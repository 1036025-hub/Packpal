import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function Profile({ navigation }) {

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // 🔥 AUTH + FETCH USER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setEmail(data.email || user.email);
          setImage(data.photo || null);
        }

      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // 🔥 SAVE PROFILE
  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      await setDoc(
        doc(db, "users", user.uid),
        { name, email },
        { merge: true }
      );

      setShowEdit(false);

    } catch (error) {
      console.log("Save error:", error);
    }
  };

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
  };

  // 🔥 PICK IMAGE
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  // 🔥 TAKE PHOTO
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  // 🔥 CLOUDINARY UPLOAD
  const uploadImage = async (uri) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const data = new FormData();

      data.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      data.append("upload_preset", "Packpal"); // ⚠️ case-sensitive

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/divmvowga/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      console.log("UPLOAD RESPONSE:", result);

      if (!result.secure_url) {
        throw new Error("Upload failed");
      }

      const imageUrl = result.secure_url;

      // 🔥 SAVE IN FIRESTORE
      await setDoc(
        doc(db, "users", user.uid),
        { photo: imageUrl },
        { merge: true }
      );

      // 🔥 UPDATE UI
      setImage(imageUrl + "?t=" + Date.now());
      setShowPhotoOptions(false);

    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      Alert.alert("Error", "Image upload failed");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity onPress={() => setShowEdit(true)}>
          <Feather name="edit" size={20} />
        </TouchableOpacity>
      </View>

      {/* PROFILE */}
      <View style={styles.profileSection}>

        <TouchableOpacity onPress={() => setShowPhotoOptions(true)}>
          <Image
            source={
              image && image.startsWith("http")
                ? { uri: image }
                : require('../assets/profile.jpeg')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* MENU */}
      <View style={styles.menu}>
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />

        <MenuItem
          icon="time-outline"
          label="Trips"
          onPress={() => navigation.navigate('Calendar')}
        />

        <MenuItem
          icon="log-out-outline"
          label="Logout"
          onPress={handleLogout}
        />
      </View>

      {/* EMERGENCY BUTTON */}
      <TouchableOpacity
        style={styles.emergencyBtn}
        onPress={() => Alert.alert("Emergency", "Help triggered")}
      >
        <Ionicons name="warning-outline" size={20} color="#fff" />
        <Text style={styles.emergencyText}>Emergency Alert</Text>
      </TouchableOpacity>

      {/* PHOTO OPTIONS */}
      <Modal transparent visible={showPhotoOptions}>
        <View style={styles.overlay}>
          <View style={styles.popup}>

            <Text style={styles.popupTitle}>Update Profile Picture</Text>

            <TouchableOpacity style={styles.popupBtn} onPress={pickImage}>
              <Text style={styles.popupText}>Upload from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupBtn} onPress={takePhoto}>
              <Text style={styles.popupText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.popupBtn, { backgroundColor: 'gray' }]}
              onPress={() => setShowPhotoOptions(false)}
            >
              <Text style={styles.popupText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* EDIT PROFILE */}
      <Modal transparent visible={showEdit}>
        <View style={styles.overlay}>
          <View style={styles.popup}>

            <Text style={styles.popupTitle}>Edit Profile</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Name"
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email"
            />

            <TouchableOpacity style={styles.popupBtn} onPress={handleSave}>
              <Text style={styles.popupText}>Save</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={20} />
      <Text style={styles.menuText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  title: { fontSize: 20, fontWeight: 'bold' },

  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2F6FED',
  },

  name: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },

  email: {
    color: '#777',
    marginTop: 5,
  },

  menu: {
    marginTop: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  },

  menuLeft: { flexDirection: 'row', alignItems: 'center' },

  menuText: { marginLeft: 10 },

  emergencyBtn: {
    backgroundColor: 'red',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emergencyText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popup: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    width: '80%',
  },

  popupTitle: { fontSize: 18, marginBottom: 10 },

  popupBtn: {
    backgroundColor: '#2F6FED',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  popupText: { color: '#fff' },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

