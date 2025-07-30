import React, { useState, useEffect, useContext } from "react";

import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Modal,
    Image
} from 'react-native';

//Bibliotecas
import { LineChart } from 'react-native-chart-kit'

//Icones
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'

//Componentes Personalizados
import ListTransaction from "../../../Components/General/ListTransaction";
import EstatisticsLoading from "../../../Components/Estatisticas/Components/EstatisticsLoading";
import PeriodSelector from "../../../Components/Estatisticas/Components/PeriodSelector";
import FilterDropdown from "../../../Components/Estatisticas/Components/FilterDropdown";
import ReusableLineChart from "../../../Components/Estatisticas/Components/ReusableLineChart";
import { AuthContext } from "../../../contexts/auth";
import { useHistorico } from "../../../Hooks/useEstatisticas";
import { set } from "date-fns";

const Estatisticas = ({ navigation }) => {

    const { parseDateSafe } = useContext(AuthContext)

    // State for the buttons
        const [isActive, setIsActive] = useState({
            //State para filtro de grafico
            labelGrafico: {
                semana: true,
                mes: false,
                ano: false,
            },
            //State para o botao de filtro
            filtro: 'Geral',

            //State de Cores dos botoes e textos
            color: {
                color1:'rgba(81, 165, 131, 1)',
                color2:'#Fff',
                colorText1:'white',
                colorText2:'#616161'
            },
            
            // State para o Tamanho da tela
            screenWidth: Dimensions.get('window').width
        }
        )

    const { historico, loading } = useHistorico({
        filtro: isActive.filtro,
        labelGrafico: isActive.labelGrafico,
        parseDateSafe: parseDateSafe
    });
        
    const [selectedIndex, setSelectedIndex] = useState({})


    if (loading) {
        return (
            <EstatisticsLoading 
                visible={loading}
                mensagem="Carregando dados..."
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.containerText}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name='chevron-left'
                        size={40}
                    />
                </TouchableOpacity>

                <Text style={styles.text}>Estatisticas</Text>

            </View>
                
            <PeriodSelector
                    options={[
                        { label: 'Semanal', key: 'semana' },
                        { label: 'Mensal', key: 'mes' },
                        { label: 'Anual', key: 'ano' },
                    ]}
                    activeOption={Object.keys(isActive.labelGrafico).find(key => isActive.labelGrafico[key])}
                    onSelect={(key) => {
                        setIsActive(prev => ({
                            ...prev,
                            labelGrafico: {
                                semana: key === 'semana',
                                mes: key === 'mes',
                                ano: key === 'ano'
                            }
                        }));
                    }}
                    styles={styles}
                    color={isActive.color}
            />

            
            <FilterDropdown
                options={['Geral', 'Receitas', 'Despesas']}
                selected={isActive.filtro}
                onChange={(value) => {
                    setIsActive(prev => ({...prev, filtro: value}));
                }}
                style={styles}
                iconName={"chevron-down"}
                iconSize={15}
                iconColor={"#616161"}
            />

            
            {
                historico.length > 0 && (
                    
                    <ReusableLineChart
                        historico={historico}
                        chartWidth={isActive.screenWidth}
                        filter={isActive.labelGrafico}
                        selectedIndex={selectedIndex}
                    />
                )
            }
            

            <View style={styles.containerCabecalhoTransacoes}>
                <Text style={styles.textTransacoes}>{isActive.filtro}</Text>
                <TouchableOpacity 
                    onPress={() => {console.log(selectedIndex)}}
                    
                >
                    <Octicons
                        name='filter'
                        size={30}
                    />
                </TouchableOpacity>
            </View>

            <ListTransaction
                data={historico}
                isSelected={ item => { 
                    if(isActive.labelGrafico.ano){
                        const d = new Date(parseDateSafe(item.date));
                        const mesAno = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

                        return selectedIndex.data === mesAno;
                    } else {
                        return selectedIndex.data === item.date;
                    }
                    }
                }
                onSelect={ item => {
                    if(isActive.labelGrafico.ano) {

                        const agrupadoObj = historico.reduce((acc, curr) => {
                        
                            const d = new Date(parseDateSafe(curr.date));
                            const mesAno = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                            const valor = parseFloat(curr.value);
                            const tipo = curr.type;
                            if (isNaN(valor)) return acc; // Ignora valores inválidos
                            if (!acc[mesAno]) {
                                acc[mesAno] = 0;
                            }
                            acc[mesAno] += tipo === 'despesa' ? -Math.abs(valor) : Math.abs(valor);
                            return acc;
                        }, {})

                        let filtro = Object.entries(agrupadoObj).map(([mesAno, total]) => {
                            const date = new Date(mesAno);
                            const selectedDate = new Date(parseDateSafe(item.date));

                            if (date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth()) {
                                return({ value: total, data: mesAno });
                            }
                        }).filter(Boolean);

                        setSelectedIndex(filtro[0]);

                    } else {

                        // Caso não seja anual, comportamento padrão
                        const itensComMesmaData = historico.filter(h => h.date === item.date);

                        const soma = itensComMesmaData.reduce((total, atual) => {
                            const valor = parseFloat(atual.value);
                            const ajuste = atual.type === 'despesa' ? -valor : valor;
                            return total + ajuste;
                        }, 0);

                        setSelectedIndex({ value: soma, data: item.date });

                    }
                }}
                ListEmptyComponent={
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
            }
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#FFF'
    },
    containerText:{
        flexDirection:'row',
        alignItems:'center',
        paddingTop:'15%',
        padding:10
    },
    text:{
        paddingLeft:'25%',
        fontWeight: 'bold',
        fontSize: 25
    },
    containerButtons: {
        marginBottom:'5%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:10
    },
    button: {
        backgroundColor:'#438883',
        padding:10,
        width:90,
        borderRadius:10
    },
    buttonText: {
        textAlign:'center',
        fontSize:13
    },
    containerCabecalhoTransacoes:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingRight:25,
        paddingLeft:25,
        paddingBottom:30,
        paddingTop:20
    },
    textTransacoes: {
        fontSize:25,
        fontWeight:'bold'
    },
    containerFiltroGastoOuReceita:{
        width: 110,
        height: 40,
        marginBottom: 50,

        position:'relative',
        top: 20,
        left: '65%',
        right: 0,
        bottom: 0,

        justifyContent: 'center',
        zIndex: 1
    },
    buttonFilterGastoOuReceita:{

        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:10,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#585858'

    },
    filterGastoOuReceita: {
        backgroundColor:'#fff',
        width: 110, 
        height: 180,
        position:'absolute',
        top: '28.7%',
        left: '65.0%',
        right: 0,
        bottom: 0,
        justifyContent: 'flex-start',
        zIndex: 1
    }
})

export default Estatisticas;