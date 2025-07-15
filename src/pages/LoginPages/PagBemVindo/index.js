import React from "react";
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Button from "../../../Components/General/Button";

export default function PagBemVindo({ navigation }) {
    return (
        <SafeAreaView
        style={styles.screen}
        >
            <View style={styles.areaLogin}>
                <Text style={styles.textoAreaLogin}>
                    Olá, seja bem vindo ao app
                </Text>

                <View style={styles.areaBotoes}>
                    <Button
                        style={styles.botoes}
                        fontStyle={styles.textStyle}
                        name='Login'
                        onPress={() => navigation.navigate('Login')}
                    />

                    <Button
                        style={styles.botoes}
                        fontStyle={styles.textStyle}
                        name='Cadastro'
                        onPress={() => navigation.navigate('Register')}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'space-evenly',
        alignItems:'center',
        backgroundColor:'#F7F7F7'
    },
    areaLogin:{
        flexDirection:'column',
        justifyContent:'space-around',
        height:400,
        width:350,
    },
    areaBotoes: {
        padding:20
    },
    botoes:{
        alignItems:'center',
        borderWidth:1,
        borderColor:'#000',
        backgroundColor:'#000',
        padding:20,
        borderRadius:15,
        margin:5
    },
    textStyle:{
        fontSize:20,
        color:'white'
    },
    textoAreaLogin: {
        fontSize:25,
        color:'black',
        textAlign:'center'
    }
})