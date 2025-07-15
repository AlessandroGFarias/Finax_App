import React, { useState, useContext } from "react";
import { 
    View, 
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

//Bibliotecas
import { format, parse } from 'date-fns'
import AsyncStorage from "@react-native-async-storage/async-storage";

//Icones
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Componentes personalizados
import api from "../../../services/api";
import UniversalPicker from "../../../Components/General/UniversalPicker";
import InputForm from "../../../Components/General/InputForm";
import { AuthContext } from "../../../contexts/auth";

export default function RegistroDeTransacoes({ navigation }) {

    const { toCaptalize } = useContext(AuthContext);

    const [registro, setRegistro] = useState({
        description: "",
        date: "",
        value: "R$ 0,00",
        type: "",
        errors: {

        }
    });
    
    const color = {
        color1:'#198218',
        color2:'#C80000',
    }

    const [loading, setLoading] = useState(false);

    // Função para formatar o valor em moeda
    const formatCurrency = (text) => {
        // Remove caracteres não numéricos
        const numericValue = text.replace(/[^0-9]/g, "");
        
        // Formata o valor como moeda
        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numericValue / 100); // Divide por 100 para considerar centavos
        
        setRegistro({
            ...registro,
            value: formattedValue,
        })
    };

    //Funcao para salvar dados dos inputs e mandar para a api
    const validar = () => {
            let validate = true;
            let errors = {};
        
            // codigo para confirmação de erros
            if (registro.description === '') {
              validate = false;
              errors.description = '- Categoria é obrigatório';
            }

            if (registro.value < 'R$1,00') {
              validate = false;
              errors.value = '- Valor deve ser maior que R$1,00';
            }
            if (registro.type === '') {
              validate = false;
              errors.type = '- Tipo de movimentação é obrigatório';
            }

            setRegistro({
                ...registro,
                errors
            })

            return validate;
          }

    const handleRegister = async () => {
        
        if (validar()) {

            setLoading(true);

            console.log(registro)

            try {
                
                const storagedToken = await AsyncStorage.getItem('@finToken')

                const newValue = parseFloat(registro.value.replace(/[^\d,]/g, '').replace(',', '')) / 100;

                await api.post('/receive',{
                    headers:{
                        authorization: `Bearer ${storagedToken}`
                    },
                    description:registro.description,
                    value:newValue,
                    type:registro.type,
                    date:registro.date
                })

            setLoading(false);

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            });

            } catch(error) {
                console.log(error); 
                setLoading(false);
            }
            
        }
    }


    return (
        //Container do app
        <View style={styles.container}>

            <View style={styles.containerTitle}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='chevron-left' color={'#fff'} size={35}/>
                </TouchableOpacity>
                <Text style={styles.text}>Registrar Movimentação</Text>
            </View>

            <View style={styles.containerFormMovimentacoes}>

                <View style={styles.FormMovimentacoes}>
                    <Text style={styles.textForm}>Nome:</Text>
                    <InputForm 
                        onChangeText={(text) => {
                            setRegistro({
                            ...registro,
                            description: toCaptalize(text)
                        })}}
                        style={styles.inputForm}
                    />
                    {registro.errors.description && <Text style={styles.erro}>{registro.errors.description}</Text>}

                    <Text style={styles.textForm}>Data:</Text>
                    <UniversalPicker
                        style= {styles.inputForm}
                        mode='date'
                        data={registro.date}
                        onSelect={(date) => {
                            let dateFormated = format(date, 'dd/MM/yyyy')
                            setRegistro({
                                ...registro,
                                date: dateFormated
                            })  
                        }}
                    />

                    <Text style={styles.textForm}>Valor:</Text>
                    <View style={styles.inputContainer}>
                        <InputForm
                            style={styles.inputValorFormatado}
                            value={registro.value}
                            onChangeText={(text) => formatCurrency(text)}
                        />

                        <TouchableOpacity 
                            style={styles.buttonClear}
                            onPress={() => setRegistro({
                                ...registro,
                                value: "R$ 0,00"
                            })}
                        >
                            <Text>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    {registro.errors.value && <Text style={styles.erro}>{registro.errors.value}</Text>}

                    <View style={styles.containerButtons}>

                        <TouchableOpacity
                            onPress={() => {
                                setRegistro({
                                    ...registro,
                                    type: "receita"
                                })
                            }}
                            style={[styles.button, {borderColor:'#198218', backgroundColor: registro.type === "receita" ? color.color1 : '#1B5C58'}]}
                         >
                            <Text style={[styles.buttonText, { color:'#ECF0F1'}]}>Ganho</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => {
                                setRegistro({
                                    ...registro,
                                    type: "despesa"
                                })}
                            }
                            style={[styles.button, {borderColor:'#C80000',  backgroundColor: registro.type === "despesa" ? color.color2 : '#1B5C58'}]}
                        >
                            <Text style={[styles.buttonText, { color:'#ECF0F1'}]}>Despesa</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                { loading ? (
                    <ActivityIndicator
                        size={'large'} 
                        color={'white'} 
                        style={styles.buttonSave}
                    /> ):
                    <TouchableOpacity 
                        style={styles.buttonSave}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonTextSave}>Salvar</Text>
                    </TouchableOpacity>
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        Flex:1,
        margin:0,
    },
    containerTitle:{
        flexDirection:'row',
        alignItems:'center',

        backgroundColor:'#1B5C58',

        paddingLeft:20,
        paddingTop:'10%',
        paddingBottom:'40%'
    },
    text:{
        fontSize:25,
        color:'#fff',
        marginLeft:'10%'
    },
    containerFormMovimentacoes:{
        alignItems:'center',
        position:'absolute',
        top:'60%',
        left:'5%',
    },
    FormMovimentacoes:{
        justifyContent:'center',
        width:'90%',
        borderRadius:15,
        padding:20,        

        backgroundColor:'#ECF0F1',

        shadowColor: '#000', // Cor da sombra
        shadowOffset: {
            width: 1, // Deslocamento horizontal
            height: 2, // Deslocamento vertical
        },
        shadowOpacity: 0.25, // Opacidade da sombra
        shadowRadius: 3.5, // Raio de desfoque
        elevation: 10, // Para Android
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 5,
        width:'95%' 
    },
    inputValorFormatado:{
        fontWeight:'bold',
        paddingRight:'65%'
    },
    textForm:{
        fontSize:18,
        paddingBottom:15,
        paddingTop:15,
    },
    inputForm:{
        borderWidth:2,
        borderRadius:10,
        borderColor:'#CDCDCD',
        width:'95%',
        paddingLeft:20,
        padding:10,
        fontWeight:'bold',
        color:'#000'
    },
    inputDate:{
        flexDirection:'row',
        justifyContent:'space-between',
        padding:10,
        borderWidth:1,
        borderColor:'#CDCDCD',
        borderRadius:10,
        width:'95%'
    },
    textInputDate:{
        fontWeight:'bold',
        fontSize:14,
        paddingLeft:5
    },
    buttonClear:{
        position:'absolute',
        left:'86%'
    },
    containerButtons: {
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        gap:5,
        marginTop:20,
        padding:5
    },
    button: {
        padding:15,
        paddingLeft:40,
        paddingRight:40,
        borderRadius:10,
        borderWidth:1
    },
    buttonText: {
        color:'#fff',
        fontSize:17,
        fontWeight:'bold'
    },
    buttonSave: {
        marginTop:50,
        padding:15,
        paddingLeft:80,
        paddingRight:80,
        borderRadius:10,
        backgroundColor:'#1B5C58',
        alignItems:'center'
    },
    buttonTextSave: {
        color:'#fff',
        fontSize:20,
        fontWeight:'bold'
    },
    erro: {
        alignSelf: 'flex-start',
        padding: 10,
        color: 'red',
        fontSize: 13,
        fontWeight: 'bold',
    },
})

