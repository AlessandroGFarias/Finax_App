import React, { useState, useEffect, useContext } from "react";

import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Modal,
    Image
} from 'react-native';

//Bibliotecas
import { LineChart } from 'react-native-chart-kit'
import AsyncStorage from "@react-native-async-storage/async-storage";

//Icones
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'

//Componentes Personalizados
import ListTransaction from "../../../Components/General/ListTransaction";
import api from "../../../services/api";
import { AuthContext } from "../../../contexts/auth";


/**
 * Estatisticas screen.
 * 
 * This screen displays a line chart of expenses for the current year, as well as a list of all transactions.
*/
const Estatisticas = ({ navigation }) => {

    // State for the transaction Query
    const [ dados, setDados ] = useState([])

    // State for the transaction history
    const [ historico, setHistorico ] = useState([])

    const [ modalCarregamento, setModalCarregamento ] = useState(true)

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

            //State para o modal de filtro
            modalFiltro: false,
            
            // State para o Tamanho da tela
            screenWidth: Dimensions.get('window').width
        }
        )
        
    const [selectedIndex, setSelectedIndex] = useState({})

    // Fetches transaction history for the current year, month by month, day by day
        useEffect(() => {
            
            if (dados.length === 0) {

                async function getHistorico() {
                    
                    let storagedToken = await AsyncStorage.getItem('@finToken');
                    const currentYear = new Date().getFullYear();
                    
                    try {

                        for (let month = 1; month <= 12; month++) {
                            
                            for (let day = 1; day <= 31; day++) {
                                const response = await api.get('/receives', {
                                    headers: {
                                        Authorization: `Bearer ${storagedToken}`
                                    },    
                                    params: {
                                        date: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${currentYear}`
                                    }    
                                })    
                                
                                if (response.data.length) {
                                    setDados(dados => [...dados, ...response.data]);
                                }
                            }
                        };

                    } catch (error) {
                        console.error("Error fetching transaction history:", error);
                    }
                
                } 
                
                getHistorico();

            }

            function filteredData( query ) {

                const hoje = new Date();
                const dayOfWeek = hoje.getDay(); // dia da semana (0-6)
                const dayOfMonth = hoje.getDate(); // dia do mês (1-31)
                const month = hoje.getMonth(); // mês (1-12)
                const year = hoje.getFullYear();
        
                switch (true) {

                    case isActive.labelGrafico.semana:

                    setModalCarregamento(true)
        
                    const firstDayOfWeek =  dayOfMonth - dayOfWeek < 10 ? `0${dayOfMonth - dayOfWeek}` : dayOfMonth - dayOfWeek;
                    let week = []; 
                    
                    for (let i = 0; i <= 6; i++) {
                            week.push(new Date(year, month, Number(firstDayOfWeek) + i));
                    }
        
                    let filteredWeek = query.filter( item => {
                            return week.some( date => {
                                const itemDate = new Date(parseDateSafe(item.date));
                                return itemDate.getDate() === date.getDate() && itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
                            })
                    });
        
                    setHistorico(filteredWeek)

                    setTimeout(() => {
                        setModalCarregamento(false)
                    }, 3000)

                    break;
        
                    case isActive.labelGrafico.mes:

                        setModalCarregamento(true)

                        let months = [];
        
                        for (let i = 1; i <= 31; i++) {
                            months.push(new Date(year, month, i));
                        }

                        let filteredMonth = query.filter( item => {
                            return months.some( date => {
                                const itemDate = new Date(parseDateSafe(item.date));
                                return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
                            })
                        });
                        
                        setHistorico(filteredMonth)

                        setTimeout(() => {
                            setModalCarregamento(false)
                        }, 3000)
    
                        break;
                    
                    case isActive.labelGrafico.ano:

                        setModalCarregamento(true)

                        setHistorico(query)

                        setTimeout(() => {
                            setModalCarregamento(false)
                        }, 2000)
                        
                        break;
                }
            }
            
            if (isActive.filtro === 'Geral') {
                filteredData(dados);
            } else if (isActive.filtro === 'Receitas') {
                console.log('entrou no receitas');
            } else {
                console.log('entrou no despesas');
            }


        }, [isActive.filtro, dados, isActive.labelGrafico]);

        function handleLabelGrafico() { 
                
                switch (true) {
                    case isActive.labelGrafico.semana:
                        
                        let datas = [...new Set(historico.map(obj => obj['date']))];

                        let week = ['Dom','Seg', 'Ter', 'Qua', 'Qui', 'Sex','Sab'];
                        
                        week.length = datas.length

                        return week;

                    case isActive.labelGrafico.mes:

                        let historicoFiltered = 
                        Object.keys(historico.reduce((acc, curr) => {
                            const data = curr.date;
                            const valor = parseFloat(curr.value); // Garante que é número
                            const tipo = curr.type;

                            // Inicializa se ainda não existir
                            if (!acc[data]) {
                            acc[data] = 0;
                            }

                            // Soma ou subtrai dependendo do tipo
                            acc[data] += tipo === 'despesa' ? -Math.abs(valor) : Math.abs(valor);

                            return acc;
                        }, {})).map(date => {
                                    const d = new Date(parseDateSafe(date));
                                    const dia = String(d.getDate()).padStart(2, '0');
                                    const mes = String(d.getMonth() + 1).padStart(2, '0');
                                    return `${dia}/${mes}`;
                                })
                        
                        return historicoFiltered

                    case isActive.labelGrafico.ano:

                        return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                }
        }
        

    return (
        <SafeAreaView style={styles.container}>
            
            <Modal
                animationType="fade"
                visible={modalCarregamento}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                    <View style={{backgroundColor: '#fff', padding: 20}}>
                        <Text style={{fontSize: 18, color: '#000', fontWeight: 'bold', paddingBottom: 10}}>Carregando...</Text>
                        <ActivityIndicator size="large" color="#51A583"/>
                    </View>
                </View>
            </Modal>

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

            <View style={styles.containerButtons}>
                
                <TouchableOpacity
                    onPress={() => {
                        setIsActive(prev => ({...prev, labelGrafico:{semana: true,mes: false, ano: false}}))
                    }}
                    style={[styles.button,{backgroundColor: isActive.labelGrafico.semana ? isActive.color.color1 : isActive.color.color2}]}                        
                >
                    <Text style={[styles.buttonText,{color: isActive.labelGrafico.semana ? isActive.color.colorText1 : isActive.color.colorText2}]}>Semanal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setIsActive(prev => ({...prev, labelGrafico:{semana: false,mes: true, ano: false}}));
                    }}
                    style={[styles.button,{backgroundColor: isActive.labelGrafico.mes ? isActive.color.color1 : isActive.color.color2}]}
                >
                    <Text style={[styles.buttonText, {color: isActive.labelGrafico.mes ? isActive.color.colorText1 : isActive.color.colorText2}]}>Mensal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setIsActive(prev => ({...prev, labelGrafico:{semana: false,mes: false, ano: true}}))
                    }}
                    style={[styles.button, {backgroundColor: isActive.labelGrafico.ano ? isActive.color.color1 : isActive.color.color2}]}
                >
                    <Text style={[styles.buttonText, {color: isActive.labelGrafico.ano ? isActive.color.colorText1 : isActive.color.colorText2}]}>Anual</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.containerFiltroGastoOuReceita}>
                <TouchableOpacity
                    onPress={() => setIsActive(prev => ({...prev, modalFiltro: true}))}
                    activeOpacity={0.4} 
                    style={[styles.filtroGastoOuReceita,{borderBottomLeftRadius: isActive.modalFiltro && 0 , borderBottomRightRadius: isActive.modalFiltro && 0}]}
                >
                    <Text style={{color:'#616161', fontSize: 14}}>{isActive.filtro}</Text>
                    <Octicons name='chevron-down' size={15} color='#616161' />
                </TouchableOpacity>

                <Modal
                    transparent
                    visible={isActive.modalFiltro}
                    onRequestClose={() => setIsActive(prev => ({...prev, modalFiltro: false}))}
                    animationType="fade"
                >
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => setIsActive(prev => ({...prev, modalFiltro: false}))}
                        activeOpacity={1}
                    >
                        <View style={styles.filtro}>
                            <TouchableOpacity 
                                style={{padding:20, borderWidth: .5}}
                                onPress={() => {
                                    setIsActive(prev => ({...prev, filtro: 'Receitas'}))
                                    setIsActive(prev => ({...prev, modalFiltro: false}))
                                }}>
                                <Text style={{textAlign:'center', color:'#616161'}}>Receitas</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={{padding:20, borderWidth: .5}}
                                onPress={() => {
                                    setIsActive(prev =>({...prev, filtro: 'Despesas'}))
                                    setIsActive(prev => ({...prev, modalFiltro: false}))
                                }}>
                                <Text style={{textAlign:'center', color:'#616161'}}>Despesas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{padding:20, borderWidth: .5}}
                                onPress={() => {
                                    setIsActive(prev => ({...prev, filtro: 'Geral'}))
                                    setIsActive(prev => ({...prev, modalFiltro: false}))
                                }}>
                                <Text style={{textAlign:'center', color:'#616161'}}>Geral</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            
            {
                historico.length > 0 && (
                    
                    <LineChart
                        data={{
                            labels: handleLabelGrafico(),
                            datasets: [
                                {
                                    data: Object.values(
                                        historico.reduce((acc, curr) => {
                                          const data = curr.date;
                                          const valor = parseFloat(curr.value); // Garante que é número
                                          const tipo = curr.type;
                                      
                                          // Inicializa se ainda não existir
                                          if (!acc[data]) {
                                            acc[data] = 0;
                                          }
                                      
                                          // Soma ou subtrai dependendo do tipo
                                          acc[data] += tipo === 'despesa' ? -Math.abs(valor) : Math.abs(valor);
                                      
                                          return acc;
                                        }, {})
                                      )
                                }
                            ]
                        }}
                        width={isActive.screenWidth}
                        height={250}
                        withHorizontalLabels={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        renderDotContent={({x, y, index, indexData}) => {
                            if (selectedIndex.value === indexData) {
                                return (
                                    <View 
                                    key={index}
                                    style={{
                                        backgroundColor: 'rgba(81, 165, 131, 1)',
                                        width: 50,
                                        height: 35 ,
                                        position: 'absolute', 
                                        top: y - 42, 
                                        left: x - 20, 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        borderRadius: 10
                                    }}>
                                        <Text style={{color:'#fff', fontSize: 11, fontWeight: 'bold'}}>{indexData.toFixed(2)}</Text>
                                    </View>
                                )
                            }  
                        }}
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom:'#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 2,
                            color: (opacity = .65) => `rgba(81, 165, 131, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                id: 'dots'
                            }
                        }}
                        bezier
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

            <FlatList
                data={historico}
                keyExtractor={( item ) => item.id }
                renderItem={({item}) => (
                    <HistoricoTransacoes
                        data={item}
                        isSelected={item.date === selectedIndex.data}
                        onSelect={() => {
                            const itensComMesmaData = historico.filter(h => h.date === item.date);

                            const soma = itensComMesmaData.reduce((total, atual) => {
                                const valor = parseFloat(atual.value); // garante que seja número
                                const ajuste = atual.type === 'despesa' ? -valor : valor;
                                return total + ajuste;
                            }, 0);

                            setSelectedIndex({ value: soma, data: item.date });
                        }}
                        contas={true} // ou false, dependendo do seu caso
                        ListEmptyComponent={
                        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 40 }}>
                        <Image
                            source={{ uri: 'https://i.pinimg.com/736x/c8/c6/cd/c8c6cd542ab901d12ef70803fde49d06.jpg' }}
                            style={{
                                width: 100,
                                height: 100,
                            }}
                        />
                        <Text style={{ fontSize: 18 }}>Nenhuma movimentação encontrada</Text>
                    </View>
                    }
                    />
                )}
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
        paddingLeft:'30%',
        fontWeight: 'bold',
        fontSize: 20
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
        width:70,
        borderRadius:10
    },
    buttonText: {
        textAlign:'center',
        fontSize:12
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
    filtroGastoOuReceita:{
        
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:10,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#585858'

    },
    filtro: {
        backgroundColor:'#fff',
        width: 109, 
        height: 180,
        position:'absolute',
        top: '28.9%',
        left: '65.2%',
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 1
    }
})

export default Estatisticas;