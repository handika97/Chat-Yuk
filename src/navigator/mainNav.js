import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Home from '../Screens/live';
import friends from '../Screens/friends';
import addFriends from '../Screens/addFriends';
import Login from '../Screens/login';
import Register from '../Screens/registerbaa';
import Map from '../Screens/mapsreverence';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const mainNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="friends" component={friends} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="addFriends" component={addFriends} />
      <Stack.Screen name="map" component={Map} />
    </Stack.Navigator>
  );
};

export default mainNav;
