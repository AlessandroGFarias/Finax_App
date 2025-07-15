import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image
} from 'react-native'

//libraries
import { format } from 'date-fns';

// Custom Components
import BalanceCard from '../../../Components/Home/Components/BalanceCard';
import ListTransaction from '../../../Components/General/ListTransaction';
import UniversalPicker from "../../../Components/General/UniversalPicker";
import LoadingScreenIcon from "../../../Components/General/LoadingScreenIcon";
import { useHome } from "../../../Hooks/useHome";

export default function Home({ navigation }) {

    const date = new Date()
    const [dateMovements, setDateMovements] = useState()
    
        const { loading, saldo, transacoes} = useHome({
            dateMovements
        })


    if(loading) {
        return (
            <LoadingScreenIcon
                tranparent={true}
                visible={true}
                imageUrl={'https://i.pinimg.com/736x/a9/3f/82/a93f82c437aaddf0cf7b92747daffbc7.jpg'}
            />
        )
    }

    return (
        <SafeAreaView style={styles.MainAppArea}>

            <View style={styles.areaTitulo}>
                <Text style={styles.titulo}>Visão Geral</Text>
            </View>

            <BalanceCard
                title="Total Carteira"
                balance={saldo[0].saldo}
                receita={saldo[1].saldo}
                gastos={saldo[2].saldo}
                icon="menu-up"
            />

            <View style={styles.containerTitleHistorico}>

                <Text style={styles.subtitulo}>Ultimas Movimentações</Text>
                <UniversalPicker
                    style={styles.inputForm}
                    mode="MiniDate"
                    data={date}
                    onSelect={(date) => {
                        let dateFormated = format(date, 'dd/MM/yyyy')

                        setDateMovements(dateFormated)
                    }}
                />
            </View>

            <ListTransaction
                data={transacoes}
                onSelect={(item) => {
                    console.log('Details', { item })
                }}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 40 }}>
                        <Image
                            source={{ uri: 'https://i.pinimg.com/736x/05/45/ac/0545ac5d6dea05ed2a639defd82b22d2.jpg' }}
                            style={{
                                width: 150,
                                height: 150,
                            }}
                        />

                        <Text style={{ fontSize: 18 }}>Nenhuma movimentação encontrada</Text>
                    </View>
                )}
            />
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    MainAppArea : {
        flex: 1,
        backgroundColor:'#fff',
        margin:0
    },
    areaTitulo:{
        backgroundColor:'#429690',
        
        height:'30%',

        alignItems:'flex-start',

        marginBottom:'-20%'
    },
    titulo:{
        fontSize:35,

        color:'#fff',

        marginLeft:'5%',
        marginTop:'15%'
    },
    containerBalanceCard:{
        alignItems:`center`,
    },
    card:{
        width:'90%',
        padding:20,
        
        borderRadius:20,
        
        backgroundColor:'#1B5C58',

        // Propriedades de sombra
        shadowColor: '#000', // Cor da sombra
        shadowOffset: {
            width: 1, // Deslocamento horizontal
            height: 2, // Deslocamento vertical
        },
        shadowOpacity: 0.25, // Opacidade da sombra
        shadowRadius: 3.5, // Raio de desfoque
        elevation: 10, // Para Android
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: '#ECF0F1',
    },
    balance: {
        fontSize: 34,
        color: '#ECF0F1',
        marginVertical: 10,
        fontWeight:'bold'
    },
    stats: {
        marginTop:40,
        flexDirection: 'row',
        alignItems:'flex-end',
        justifyContent: 'space-between',
    },
    stat: {
        gap:5,
        alignItems: 'center',
    },
    statLeft:{
        flexDirection:'row',
        justifyContent:`center`,
        alignItems:'center',
        gap:7,
    },
    containerIconeSeta:{
        backgroundColor:'rgba(255, 255, 255, 0.15)',
        padding:2,
        borderRadius:50
    },
    statText: {
        color: '#D0E5E4',
        fontSize:20,
    },
    statValue: {
        color: '#ECF0F1',
        fontWeight: 'bold',
        fontSize:17,
        paddingLeft:15,
    },
    containerTitleHistorico:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',

        marginTop:'10%',
        marginBottom:'5%',
        margin:'5%',
        padding:1,

    },
    subtitulo:{
        fontSize:23,
        color:'#000',
        fontWeight:'bold'
    }
})