import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Splash from './Screens/splash';
import Onboarding from './Screens/onboarding';
import SignIn from './Screens/signin';
import SignUp from './Screens/signup';
import ForgotPassword from './Screens/forgotpassword';
import OTP from './Screens/otp';
import Settings from './Screens/settings';
import Details from './Screens/details';

import Home from './Screens/home';
import Profile from './Screens/profile';
import Map from './Screens/map';
import Calendar from './Screens/calender';
import Feeds from './Screens/feeds';
import CreatePost from './Screens/createpost';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 15,
          left: 10,
          right: 10,
          borderRadius: 25,
          height: 65,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#2F6FED',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Calendar') iconName = 'calendar-outline';
          else if (route.name === 'Feeds') iconName = 'newspaper-outline';
          else if (route.name === 'Map') iconName = 'map-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Feeds" component={Feeds} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {!user ? (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="OTP" component={OTP} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabs} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="CreatePost" component={CreatePost} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}