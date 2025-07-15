// hooks/useHistorico.js
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from '../services/api';

export const useHistorico = ({ filtro, labelGrafico, parseDateSafe }) => {

    const [dados, setDados] = useState([]);
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        if (dados.length > 0) return;

        const fetchDados = async () => {
            let token = await AsyncStorage.getItem('@finToken');
            const ano = new Date().getFullYear();
            const result = [];

            for (let mes = 1; mes <= 12; mes++) {
                for (let dia = 1; dia <= 31; dia++) {
                    try {
                        const res = await api.get('/receives', {
                            headers: { Authorization: `Bearer ${token}` },
                            params: {
                                date: `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`
                            }
                        });

                        if (res.data.length) {
                            result.push(...res.data);
                        }
                    } catch (err) {
                        console.error("Erro ao buscar dados:", err);
                    }
                }
            }

            setDados(result);
        };

        fetchDados();
    }, []);

    useEffect(() => {
        if (!dados.length) return;

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();
        const dia = hoje.getDate();

        let filtroResultado = [];

        if (labelGrafico.semana) {
            const primeiroDiaSemana = dia - hoje.getDay();
            const semana = [...Array(7)].map((_, i) => new Date(ano, mes, primeiroDiaSemana + i));

            filtroResultado = dados.filter(item =>
                semana.some(date => {
                    const d = new Date(parseDateSafe(item.date));
                    return (
                        d.getDate() === date.getDate() &&
                        d.getMonth() === date.getMonth() &&
                        d.getFullYear() === date.getFullYear()
                    );
                })
            );
        } else if (labelGrafico.mes) {
            filtroResultado = dados.filter(item => {
                const d = new Date(parseDateSafe(item.date));
                return d.getMonth() === mes && d.getFullYear() === ano;
            });
        } else if (labelGrafico.ano) {
            filtroResultado = [...dados];
        }

        // Filtra por tipo
        if (filtro === 'Receitas') {
            filtroResultado = filtroResultado.filter(item => item.type === 'receita');
        } else if (filtro === 'Despesas') {
            filtroResultado = filtroResultado.filter(item => item.type === 'despesa');
        }

        setHistorico(filtroResultado);

    }, [dados, labelGrafico, filtro]);

    return { dados, historico };
};