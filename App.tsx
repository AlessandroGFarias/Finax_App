import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import Routes from "./src/routes";
import AuthProvider from "./src/contexts/auth"



export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor='#1B5C58'/>
        <Routes/>
      </AuthProvider>
    </NavigationContainer>
  )
}