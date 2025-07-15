import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//---------------------------------------------------------------------------------

import PagBemVindo from "../pages/LoginPages/PagBemVindo";
import Login from '../pages/LoginPages/Login';
import Register from "../pages/LoginPages/Register";

const AuthStack = createNativeStackNavigator();


export default function AuthRoutes() {
  
  return (
      <AuthStack.Navigator 
      initialRouteName="PgBemVindo"
      screenOptions={{
          headerShown:false
      }}
      >
        <AuthStack.Screen
         name="PgBemVindo" 
         component={PagBemVindo} 
         />

         <AuthStack.Screen
            name="Login"
          component={Login}
         />

         <AuthStack.Screen
         name="Register"
         component={Register}
         />
      </AuthStack.Navigator>
  )
}