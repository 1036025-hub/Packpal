import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const data = [
  {
    title: "Life is short and the world is ",
    highlight: "wide",
    image: require('../assets/onboard1.png'),
  },
  {
    title: "It’s a big world out there go ",
    highlight: "explore",
    image: require('../assets/onboard2.png'),
  },
  {
    title: "People don’t take trips, trips take ",
    highlight: "people",
    image: require('../assets/onboard3.png'),
  }
];

export default function Onboarding({ navigation }) {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (index < data.length - 1) {
      flatListRef.current.scrollToIndex({ index: index + 1 });
    } else {
      navigation.replace('SignIn');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

     
      <TouchableOpacity
        style={styles.skip}
        onPress={() => navigation.replace('SignIn')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

     
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.slide}>

          
            <Image source={item.image} style={styles.image} />

            
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {item.title}
                <Text style={styles.highlight}>{item.highlight}</Text>
              </Text>

              <Text style={styles.desc}>
                To get the best of your adventure you just need to leave and go where you like.
              </Text>
            </View>

          </View>
        )}
      />

     
      <View style={styles.bottom}>

       
        <View style={styles.dots}>
          {data.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === index ? '#2F6FED' : '#ddd' }
              ]}
            />
          ))}
        </View>

        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {index === data.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  skip: {
    position: 'absolute',
    top: 50,   // 👈 moved down (balanced)
    right: 20,
    zIndex: 10,
  },

  skipText: {
    color: '#999',
    fontSize: 15,
  },

  slide: {
    width,
    alignItems: 'center',
  },

  image: {
    width: width * 0.9,
    height: height * 0.45,
    marginTop: 40,
    borderRadius: 25,
    resizeMode: 'cover',
  },

  textContainer: {
    marginTop: 25,
    paddingHorizontal: 25,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  highlight: {
    color: '#ff7a00',
    fontWeight: 'bold',
  },

  desc: {
    marginTop: 10,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
  },

  bottom: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },

  dots: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  button: {
    backgroundColor: '#2F6FED',
    width: '90%',
    padding: 16,
    borderRadius: 15,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});