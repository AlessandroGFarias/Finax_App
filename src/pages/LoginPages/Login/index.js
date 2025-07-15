import React, { useState, useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native'

//--------------------------------------------------------------------------------------------

import InputForm from "../../../Components/General/InputForm";
import Button from "../../../Components/General/Button";
import { AuthContext } from '../../../contexts/auth'



export default function Login({ navigation }) {
    
    const [ dadosUser, setDadosUser]  = useState({
        user:'',
        password:''
    })

    const { signIn,  loadingAuth } = useContext(AuthContext)

    const loginApp = {
        handleChange: ( nome, value) => {
            setDadosUser({
                ...dadosUser,
                [nome]:value
            })
        },

        handleLogin: () => {
            signIn(dadosUser.user, dadosUser.password)
        }
    }


      return (
        <View
        style={styles.screen}
        >
            <View style={styles.areaBoasVindas}>
                <Text style={styles.textBoasVindas}>
                    Olá, seja bem-vindo de novo!
                </Text>

                <Text style={[styles.textBoasVindas,{fontSize:20,textAlign:'justify',marginTop:20}]}>
                    Digite seus dados para continuar.
                </Text>
            </View>
            <View style={styles.areaFormLogin}>
                 
                <InputForm 
                placeholder='Email'
                placeholderTextColor="#656571"
                style={styles.input}
                onChangeText={(value) => loginApp.handleChange('user', value)}
                />

                <InputForm 
                placeholder='Senha'
                placeholderTextColor="#656571"
                secureTextEntry={true} 
                style={styles.input}
                onChangeText={(value) => loginApp.handleChange('password', value)}
                />

            </View>
            
            { loadingAuth ? (
                <ActivityIndicator
                 size={'large'} 
                 color={'white'} 
                 style={styles.buttonLogin}
                 />
                ) : <Button 
                        fontStyle={styles.buttonText} 
                        name={'Login'} 
                        style={styles.buttonLogin}
                        onPress={loginApp.handleLogin}
                    />
            }
            
        </View>
        )
}


const styles = StyleSheet.create({
    screen: {
        flex:1,
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    textBoasVindas:{
        fontSize:30,
        color:'#000'
    },
    buttonLogin: {
        alignItems:'center',
        backgroundColor:'#000',
        borderRadius:20,
        width:235,
        padding:20
    },
    buttonText: {
        color:'#fff',
        fontSize:18
    },
    input: {
        color:'#656571',
        borderBottomWidth:1,
        width:250,
        fontSize:17,
        fontWeight:'bold'
    }
})