import React, { useContext, useReducer } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from "react-native";

import { AuthContext } from "../../../contexts/auth";
//----------------------------------------------------------------------------------------------------------------------------------------

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function Perfil({ navigation }) {

    // dados de usuario e logout do app
    const { toCaptalize, singOut, user } = useContext(AuthContext)

    const optionsUser = [
        {
            id:1,
            icon:'account',
            title:'Informações da conta'
        },
        {
            id:2,
            icon:'account-multiple',
            title:'Informações Compartilhadas'
        },
        {
            id:3,
            icon:'email-variant',
            title:'Central de Mensagens',
        },
        {
            id:4,
            icon:'shield-half-full',
            title:'Login e Segurança'
        },
        {
            id:5,
            icon:'lock',
            title:'Dados e Privacidade',
        }
    ]

    const OptionsProfile = ( props ) => {
        return (

            <TouchableOpacity
            style={styles.listItem}
            onPress={props.data.onPress}
            >
                <MaterialCommunityIcons name={props.data.icon} size={40} color='#000'/>
                <Text style={styles.textInfo}>{props.data.title}</Text>
            </TouchableOpacity>

        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.banner}>

                <View style={styles.bannerContent}>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name='chevron-left' color={'#fff'} size={35} />
                    </TouchableOpacity>

                    <Text style={styles.textBannerContent}>Perfil</Text>

                    <MaterialCommunityIcons name='bell-outline' color={'#fff'} size={35} />

                </View>

                <View style={styles.containerProfPicture}>

                    <View style={styles.profilePicture}></View>
                    
                    <Text style={styles.profileName}>{toCaptalize(user.name)}</Text>
                    <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
                <SafeAreaView style={styles.containerList}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={optionsUser}
                        keyExtractor={( item ) => item.id }
                        renderItem={({ item }) => <OptionsProfile data={item}/>}
                    />
                </SafeAreaView>
            </View>
        </SafeAreaView>
    )
}

/*Estilos Separados por categorias:
    containers;
    componentes;
    textos;
*/
const styles = StyleSheet.create({
    
    container: {
        flex: 4,
        alignItems: 'center'
    },
    banner: {
        width: '100%',
        height: 250,

        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#1B5C58',
    },
    containerProfPicture: {
        width: '100%',
        alignItems: 'center'
    },
    containerProfileOptions: {
        alignItems: 'center'
    },


    bannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '15%',
        marginTop: '10%',
        paddingRight: 10
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#fff',
    },
    profileName:{
        marginTop:20,
        fontSize:20
    },
    containerList: {
        marginTop:'15%',
        height:'200%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItem: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
        padding: 10
    },


    textBannerContent: {
        color: '#fff',
        fontSize: 20
    },
    textInfo: {
        fontSize: 19,
    }
})