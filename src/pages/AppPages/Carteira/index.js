import React, { useContext, useState } from "react";

// componentes react native usados
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image
} from 'react-native';

//Libraries

import { format } from 'date-fns'

//area de importacao de icones

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

//---------------------------------------------------------------------------------------------------------------------
//area de importacao de componentes personalizados

import ListTransaction from '../../../Components/General/ListTransaction';
import WalletActions from "../../../Components/Wallet/components/WalletActions";
import EstatisticsLoading from "../../../Components/Estatisticas/Components/EstatisticsLoading";

//Hooks
import { useHome } from "../../../Hooks/useHome";
import { useHistorico } from "../../../Hooks/useEstatisticas";
import { AuthContext } from "../../../contexts/auth";


const Carteira = ({ navigation }) => {
    
    const { parseDateSafe } = useContext(AuthContext)

    const day = new Date()

    // variaveis de estado do botao de historico
    const [isActive, setIsActive] = useState({
        active1: true,
        active2: false,
        labelGrafico: {
            semana:false,
            mes: true,
            ano:false
        },
        filtro: 'Geral'
    })
    
    const color = {
        color1:'#F9F9F9',
        color2:'#DFDFDF',
    }

    const { dados, historico } = useHistorico({
        labelGrafico: isActive.labelGrafico,
        filtro: isActive.filtro,
        parseDateSafe
    })

    const { saldo, loading } = useHome({
        dateMovements: format(day, 'dd/MM/yyyy')
    }) 
    

   

    if(loading) {
        return(
            <EstatisticsLoading
                mensagem={'Carregando Dados...'}
            />
        )
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.banner}>
                <View style={styles.bannerContent}>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name='chevron-left' color={'#fff'} size={35} />
                    </TouchableOpacity>

                    <Text style={styles.textBannerContent}>Carteira</Text>

                    <MaterialCommunityIcons name='bell-outline' color={'#fff'} size={35} />

                </View>
            </View>

            <SafeAreaView style={styles.containerCarteira}> 

                <WalletActions
                    saldo={saldo[0].saldo}
                    onPress={() => navigation.navigate('RegistroDeTransacoes')}
                />
                <View style={styles.containerAbasHistoricos}>

                    <TouchableOpacity
                     onPress={() => {
                        setIsActive(prev => ({
                            ...prev,
                            active1:true,
                            active2:false
                        }))
                     }}   
                     style={[styles.Buttonshistorico, {backgroundColor: isActive.active1 ? color.color1 : color.color2 }]}
                    >
                        <Text style={styles.TextButtons}>Transações</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    onPress={() => {
                        setIsActive(prev => ({
                            ...prev,
                            active1:false,
                            active2:true
                        }))
                    }}
                    style={[styles.Buttonshistorico, {backgroundColor: isActive.active2 ? color.color1 : color.color2 }]}
                    >
                        <Text style={styles.TextButtons}>Contas a Pagar</Text>
                    </TouchableOpacity>
                
                </View>

            </SafeAreaView>

                <ListTransaction
                    data={historico}
                    keyExtractor={item => item.id}
                    contas={true}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 40 }}>
                            <Image
                                source={{ uri: 'https://i.pinimg.com/736x/05/45/ac/0545ac5d6dea05ed2a639defd82b22d2.jpg' }}
                                style={{
                                    width: 130,
                                    height: 130,
                                }}
                            />
    
                            <Text style={{ fontSize: 16 }}>Nenhuma movimentação encontrada</Text>
                        </View>
                    )}
                />
                
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 4,
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    banner: {
        width: '100%',
        height: 150,

        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#1B5C58',
    },
    bannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '15%',
        marginTop: '10%',
        paddingRight: 10,
    },
    textBannerContent: {
        color: '#fff',
        fontSize: 20
    },
    containerCarteira:{
        width:'95%',
        alignItems:'center',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },
    containerSaldos: {
        paddingTop:'10%',
        justifyContent:'center',
        alignItems:'center',
        gap:10
    },
    TitleSaldo:{
        fontSize: 18,
    },
    TextSaldo: {
        fontSize:40,
        fontWeight:'bold'
    },
    TextAdd:{
        fontSize:15,
        textAlign:'center',
        marginTop:7,
    },
    containerAddPaySend:{
        marginTop:'10%',
        marginBottom:'10%',
        flexDirection:'row',
        justifyContent:'center',
        gap:30
    },
    containerAddBalance:{
        
        borderRadius:'50%',
        borderWidth:.7,
        borderColor:'#408782',
        
        padding:10,

        justifyContent:'center',
        alignItems:'center'
    },
    containerAbasHistoricos:{
        flexDirection:'row',
        width:"95%",
        justifyContent:'center',
        backgroundColor:'#DCDEDE',
        borderRadius:25,
        padding:5
    },
    Buttonshistorico:{
        padding:15,
        width:'50%',
        backgroundColor:'#F4F6F6',
        borderRadius:25
    },
    TextButtons:{
        textAlign:'center',
        fontSize:13,
        fontWeight:'bold',
        color:'#656666'
    }
})

export default Carteira;