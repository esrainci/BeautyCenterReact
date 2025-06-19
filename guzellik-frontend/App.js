// App.js

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Ekranlar
import LoginScreen      from './src/screens/LoginScreen';
import RegisterScreen   from './src/screens/RegisterScreen';
import HomeScreen       from './src/screens/HomeScreen';
import Calisanlar       from './src/screens/CalisanlarScreen';
import Appointment      from './src/screens/AppointmentScreen';
import ProfileScreen    from './src/screens/ProfileScreen'; 
import ReviewsScreen    from './src/screens/ReviewsScreen';
import CalisanHomeScreen from './src/screens/CalisanHomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login"       component={LoginScreen} />
        <Stack.Screen name="Register"    component={RegisterScreen} />
        <Stack.Screen name="Home"        component={HomeScreen} />
        <Stack.Screen name="Appointment" component={Appointment} />
        <Stack.Screen 
          name="Calisanlar" 
          component={Calisanlar}
          options={{ title: 'Çalışanlar' }}
        />
        <Stack.Screen
          name="Profile"                   
          component={ProfileScreen}
        />
        <Stack.Screen 
          name="Reviews" 
          component={ReviewsScreen} 
        /> 
          <Stack.Screen 
          name="CalisanHome" 
          component={CalisanHomeScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
