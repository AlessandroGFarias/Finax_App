import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//---------------------------------------------------------------------------------

import Home from "../pages/AppPages/Home";
import Perfil from "../pages/AppPages/Perfil";
import RegistroDeTransacoes from "../pages/AppPages/RegistroDeTransacoes";
import Carteira from "../pages/AppPages/Carteira";
import Estatisticas from "../pages/AppPages/Estatisticas";

const AppBottomTab = createBottomTabNavigator();

export default function AppRoutes() {
  
  return (
      <AppBottomTab.Navigator 
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }
          else if (route.name === 'Estatisticas') {
            iconName = focused ? 'chart-areaspline-variant' : 'chart-line';
          }
          else if (route.name === 'Carteira') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }
          else if (route.name === 'Perfil') {
            iconName = focused ? 'account' : 'account-outline';
          }
            
            return <MaterialCommunityIcons name={iconName} color={color} size={45}/>
        },
        tabBarHideOnKeyboard:true,
        headerShown:false,
        tabBarShowLabel:false,
        tabBarActiveTintColor:'#549994',
        tabBarInactiveTintColor:'#929292',
        tabBarStyle:{
          width:'100%',
          height:'8%',
        },
        tabBarIconStyle:{
          width:'100%',
          height:'100%',
        }
      })}
      >
        <AppBottomTab.Screen
         name="Home" 
         component={Home}
         />
         
        <AppBottomTab.Screen
         name="Estatisticas" 
         component={Estatisticas}
         />
        

         <AppBottomTab.Screen
            name="RegistroDeTransacoes"
            component={RegistroDeTransacoes}
            options={{
              tabBarItemStyle:{
                  position:`relative`,
                  bottom:40,
                  backgroundColor:'#549994',
                  borderRadius:50
              },
              tabBarIcon: () => (
                <MaterialCommunityIcons name="plus" color={'#fff'} size={50} />
              )
            }}
         />

         <AppBottomTab.Screen
            name="Carteira"
            component={Carteira}
         />

         <AppBottomTab.Screen
            name="Perfil"
            component={Perfil}
         />

      </AppBottomTab.Navigator>
  )
};