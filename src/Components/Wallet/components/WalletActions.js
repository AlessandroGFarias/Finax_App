import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

//Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

// Função para formatar número para moeda brasileira
    const formatCurrency = (value) => {
        if (typeof value !== 'number') return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

// Componente reutilizável
const ActionButton = ({ icon, iconLib: IconLib, label, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.containerAddBalance}>
            <IconLib name={icon} color={'#408782'} size={35} />
        </View>
        <Text style={styles.TextAdd}>{label}</Text>
    </TouchableOpacity>
);

const WalletActions = ({ saldo, onPress }) => (
    <>
        <View style={styles.containerSaldos}>
            <Text style={styles.TitleSaldo}>Saldo Disponivel</Text>
            <Text style={styles.TextSaldo}>{formatCurrency(saldo)}</Text>
        </View>

        <View style={styles.containerAddPaySend}>
            <ActionButton
                icon="plus"
                iconLib={MaterialCommunityIcons}
                label="Add"
                onPress={onPress}
            />
            <ActionButton
                icon="qr-code-outline"
                iconLib={Ionicons}
                label="Pagar"
                onPress={onPress}
            />
            <ActionButton
                icon="send"
                iconLib={Feather}
                label="Enviar"
                onPress={() => {}}
            />
        </View>
    </>
);

const styles = StyleSheet.create({
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
    TextButtons:{
        textAlign:'center',
        fontSize:15,
        fontWeight:'bold',
        color:'#656666'
    }
})

export default WalletActions;

