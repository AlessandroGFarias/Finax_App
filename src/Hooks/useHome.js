import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import api from '../services/api'; // ajuste o caminho conforme seu projeto

export function useHome( dateMovements ) {

    const date = new Date()
    const [saldo, setSaldo] = useState();
    const [transacoes, setTransacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchData() {
            
            const storagedToken = await AsyncStorage.getItem('@finToken');

            // Buscar saldo se necessário
            if (saldo === undefined || saldo === null) {

                try {
                    let dateFormated = format(date, 'dd/MM/yyyy');

                    const balance = await api.get('/balance', {
                        headers: {
                            'Authorization': `Bearer ${storagedToken}`
                        },
                        params: {
                            date: dateFormated
                        }
                    });

                    setSaldo(balance.data);
                } catch (err) {
                    console.error('Erro ao buscar saldo:', err);
                }
            }

            // Buscar transações
            try {

                if (transacoes === undefined || transacoes === null) {

                    // Busca todas as transações do ano
                    const ano = new Date().getFullYear();
                    const result = [];

                    for (let mes = 1; mes <= 12; mes++) {
                        for (let dia = 1; dia <= 31; dia++) {
                            try {
                                const res = await api.get('/receives', {
                                    headers: { Authorization: `Bearer ${storagedToken}` },
                                    params: {
                                        date: `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`
                                    }
                                });
                                if (res.data.length) {
                                    result.push(...res.data);
                                }
                            } catch (err) {
                                console.error("Nao foi possivel verificar transacoes:", err)
                            }
                        }
                    }
                    setTransacoes(result);
                } 
                
                if (dateMovements != null ) {

                    const selectedDataQuery = async() => {
                        // Busca transações da data selecionada
                        const response = await api.get('/receives', {
                            headers: {
                                Authorization: `Bearer ${storagedToken}`,
                            },
                            params: { date: dateMovements.dateMovements  }
                        });
                        setTransacoes(response.data);
                    }

                    selectedDataQuery();
                }

            } catch (err) {
                console.error('Erro ao buscar transações:', err);
            }

            setLoading(false);
        }

        fetchData();
        
    }, [dateMovements.dateMovements, saldo]);

    return { saldo, transacoes, loading };
}
