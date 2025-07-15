import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const BalanceCard = ({
    title,
    balance,
    receita,
    gastos,
    icon,
}) => {
    // Função para formatar número para moeda brasileira
    const formatCurrency = (value) => {
        if (typeof value !== 'number') return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <View style={[styles.containerBalanceCard]}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <MaterialCommunityIcons
                        name={icon}
                        size={20}
                        color="#fff"
                    />
                </View>

                <Text style={styles.balance}>{formatCurrency(balance)}</Text>

                <View style={styles.stats}>
                    <View style={styles.stat}>
                        <View style={styles.statLeft}>
                            <View style={styles.containerIconeSeta}>
                                <MaterialCommunityIcons
                                    name="arrow-down"
                                    size={20}
                                    color="#fff"
                                />
                            </View>
                            <Text style={styles.statText}>Receita</Text>
                        </View>
                        <Text style={styles.statValue}>{receita ? formatCurrency(receita) : 'R$ 0,00'}</Text>
                    </View>

                    <View style={styles.stat}>
                        <View style={styles.statLeft}>
                            <View style={styles.containerIconeSeta}>
                                <MaterialCommunityIcons
                                    name="arrow-up"
                                    size={20}
                                    color="#fff"
                                />
                            </View>
                            <Text style={styles.statText}>Gastos</Text>
                        </View>
                        <Text style={styles.statValue}>{gastos ? formatCurrency(gastos) : 'R$ 0,00'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Copie seus estilos existentes aqui
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
    }
});

export default BalanceCard;