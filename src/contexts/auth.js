import React, { createContext, useState, useCallback, useEffect } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";


export const AuthContext = createContext({})

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)

    const navigation = useNavigation()

    useEffect(() => {
        async function loadingData() {

            const storagedToken = await AsyncStorage.getItem('@finToken')

            if (storagedToken) {
                const response = await api.get('/me', {
                    headers:{
                        'Authorization': `Bearer ${storagedToken}`
                    }
                    
                })
                .catch(() => {
                    setUser(null)
                    setLoading(false)
                })

                api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`

                setUser(response.data)
                setLoadingAuth(false)
            }


        }

        setLoadingAuth(false)
        loadingData()

    } , [])

    async function signUp( dados ) {
        
        setLoadingAuth(true);

        try {
            const reponse = await api.post('/users', {
                name: dados.nome,
                password: dados.senha,
                email: dados.email
            })

            setLoadingAuth(false);

            navigation.navigate('Login')

        } catch( erro ) {
            console.log(erro.response.data);
            setLoadingAuth(false);
        }
    }

    const parseDateSafe = useCallback((dateInput) => {
     
        if (!dateInput) return null;
    
        // Se for um objeto Date já válido
        if (dateInput instanceof Date && !isNaN(dateInput)) {
            return dateInput;
        }
    
        // Se for uma string no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ssZ)
        const isoDate = new Date(dateInput);
        if (!isNaN(isoDate)) {
            return isoDate;
        }
    
        // Se for uma string no formato DD/MM/YYYY
        if (typeof dateInput === 'string' && dateInput.includes('/')) {
            const parts = dateInput.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // JavaScript usa 0-11 para meses
                const year = parseInt(parts[2], 10);
    
                const parsedDate = new Date(year, month, day);
                if (!isNaN(parsedDate)) {
                    return parsedDate;
                }
            }
        }
    
        // Se nada der certo
        return null;

    }, []) 

    async function signIn(email, password) {

        setLoadingAuth(true);

        try {
            const response = await api.post('/login', {
                email: email,
                password : password
            })

            const { token } = response.data

            api.defaults.headers['Authorizations'] = `Bearer ${token}`

            await AsyncStorage.setItem('@finToken', token);

            setUser(response.data)

            setLoadingAuth(false);

        } catch(erro) {
            Alert.alert(`Erro ao logar:  ${erro} `)
            setLoadingAuth(false)
        }

    }

    async function singOut() {
        await AsyncStorage.clear()
        .then(() => {
            setUser(null)
        })
    }

    //Função para Captalização de palavras
    function toCaptalize(string) {
        if (!string) return string; // Verifica se a string não está vazia
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user , parseDateSafe, signUp, signIn, singOut, loadingAuth, toCaptalize }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;