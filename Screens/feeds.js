import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  Share,
  Alert
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { db, auth } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function Feeds({ navigation }) {

  const [posts, setPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const insets = useSafeAreaInsets();

  // 🔥 FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUserData(snap.data());
    };

    fetchUser();
  }, []);

  // 🔥 FETCH POSTS + USERS
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(postsData);

      const ids = [...new Set(postsData.map(p => p.userId))];
      let map = {};

      for (let id of ids) {
        const snap = await getDoc(doc(db, "users", id));
        if (snap.exists()) map[id] = snap.data();
      }

      setUsersMap(map);
    });

    return unsubscribe;
  }, []);

  // 🔥 CLOUDINARY
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
      { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
  };

  // 🔥 CREATE POST
  const uploadPost = async (uri) => {
    try {
      setUploading(true);

      const url = await uploadToCloudinary(uri);

      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,
        image: url,
        caption: "Quick post",
        likes: [],
        createdAt: serverTimestamp(),
      });

      setShowOptions(false);
      setUploading(false);

    } catch (e) {
      console.log(e);
      setUploading(false);
    }
  };

  // 📸 PICK
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) uploadPost(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) uploadPost(result.assets[0].uri);
  };

  // ❤️ LIKE TOGGLE
  const handleLike = async (postId, likesArray = []) => {
    const userId = auth.currentUser.uid;
    const ref = doc(db, "posts", postId);

    const alreadyLiked = likesArray.includes(userId);

    await updateDoc(ref, {
      likes: alreadyLiked
        ? arrayRemove(userId)
        : arrayUnion(userId)
    });
  };

  // 🗑 DELETE POST
  const handleDelete = (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "posts", postId));
          }
        }
      ]
    );
  };

  // 🔗 SHARE
  const handleShare = async (image) => {
    await Share.share({ message: image });
  };

  // 🔝 HEADER
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.profile}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={
            userData?.photo
              ? { uri: userData.photo }
              : require('../assets/profile.jpeg')
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.name || "User"}</Text>
      </TouchableOpacity>

      <Ionicons name="notifications-outline" size={24} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {

          const user = usersMap[item.userId];
          const images = item.images || (item.image ? [item.image] : []);
          const liked = item.likes?.includes(auth.currentUser.uid);

          return (
            <View style={styles.post}>

              {/* USER */}
              <View style={styles.postHeader}>
                <Image
                  source={
                    user?.photo
                      ? { uri: user.photo }
                      : require('../assets/profile.jpeg')
                  }
                  style={styles.postAvatar}
                />

                <Text style={styles.postName}>
                  {user?.name || "User"}
                </Text>

                {/* DELETE BUTTON */}
                {item.userId === auth.currentUser.uid && (
                  <TouchableOpacity
                    style={{ marginLeft: 'auto' }}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>

              {/* IMAGE */}
              {images.length > 0 && (
                <FlatList
                  data={images}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(img, i) => i.toString()}
                  renderItem={({ item: img }) => (
                    <Image source={{ uri: img }} style={styles.image} />
                  )}
                />
              )}

              {/* ACTIONS */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleLike(item.id, item.likes)}>
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={24}
                    color={liked ? "red" : "black"}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleShare(images[0])}>
                  <Ionicons name="share-social-outline" size={24} />
                </TouchableOpacity>
              </View>

              <Text style={styles.likes}>
                {item.likes ? item.likes.length : 0} likes
              </Text>

              <Text style={styles.caption}>{item.caption}</Text>

            </View>
          );
        }}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 70 }]}
        onPress={() => setShowOptions(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* POPUP */}
      <Modal transparent visible={showOptions}>
        <View style={styles.overlay}>
          <View style={styles.popup}>

            <Text style={styles.popupTitle}>Create Post</Text>

            <TouchableOpacity style={styles.popupBtn} onPress={pickFromGallery}>
              <Text style={styles.popupText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupBtn} onPress={takePhoto}>
              <Text style={styles.popupText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.popupBtn, { backgroundColor: 'gray' }]}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.popupText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {uploading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  profile: { flexDirection: 'row', alignItems: 'center' },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },

  name: { fontSize: 16, fontWeight: '600' },

  post: { backgroundColor: '#fff', marginBottom: 15 },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  postAvatar: { width: 35, height: 35, borderRadius: 18, marginRight: 10 },

  postName: { fontWeight: '600' },

  image: { width: width, height: width },

  actions: { flexDirection: 'row', padding: 10, gap: 15 },

  likes: { marginLeft: 10, fontWeight: '600' },

  caption: { paddingHorizontal: 10, marginTop: 5 },

  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#2F6FED',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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

  popupTitle: { textAlign: 'center', fontSize: 18 },

  popupBtn: {
    backgroundColor: '#2F6FED',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  popupText: { color: '#fff' },

  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});