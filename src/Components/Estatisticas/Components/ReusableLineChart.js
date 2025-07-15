import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { AuthContext } from '../../../contexts/auth';

const ReusableLineChart = ({
    historico,
    isActive,
    filter,
    selectedIndex,
    chartHeight = 250,
    chartConfigOverrides = {},
}) => {
 
    const { parseDateSafe } = useContext(AuthContext);

    const agrupadoObj = historico.reduce((acc, curr) => {
        const data = curr.date;
        const valor = parseFloat(curr.value);
        const tipo = curr.type;
        if (isNaN(valor)) return acc; // Ignora valores inválidos
        if (!acc[data]) {
            acc[data] = 0;
        }
        acc[data] += tipo === 'despesa' ? -Math.abs(valor) : Math.abs(valor);
        return acc;
    }, {})

    const agrupado = Object.entries(agrupadoObj).map(([date, value]) => ({
        date: date,
        value
    }));
    
    const agrupadoPorMes = Object.entries(agrupadoObj).reduce((acc, [date, value]) => {
        const d = new Date(parseDateSafe(date));
        const mesAno = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[mesAno]) {
            acc[mesAno] = 0;
        }
        acc[mesAno] += value;
        return acc;
    }, {});

    const agrupadoPorMesArray = Object.entries(agrupadoPorMes).map(([mes, total]) => ({
        mes,
        total
    }));

    const labels = handleLabelGrafico();
    // Se for mês, largura proporcional à quantidade de pontos (ex: 60px por ponto)
    const chartWidth = filter.mes ? Math.max(isActive, labels.length * 70) : isActive;

 function handleLabelGrafico() { 
                
                switch (true) {
                    case filter.semana:
                        
                        let datas = [...new Set(historico.map(obj => obj['date']))];

                        let week = ['Dom','Seg', 'Ter', 'Qua', 'Qui', 'Sex','Sab'];
                        
                        week.length = datas.length

                        return week;

                    case filter.mes:

                       let historicoFiltered = agrupado.map(obj => {
                                    const d = new Date(parseDateSafe(obj.date));
                                    const dia = String(d.getDate()).padStart(2, '0');
                                    const mes = String(d.getMonth() + 1).padStart(2, '0');
                                    return `${dia}/${mes}`;
                                })
                        
                        return historicoFiltered

                    case filter.ano:

                        let year = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

                        let meses = Object.keys(agrupadoPorMes).map(mes => {
                            let d = new Date(mes);
                            return year[d.getMonth()];
                        })

                        return meses;
                }
        }

    const chart = (
        <LineChart
            data={{
                labels: labels,
                datasets: [{ data: filter.ano ? agrupadoPorMesArray.map(array => array.total) : Object.values(agrupadoObj) }],
            }}
            width={chartWidth}
            height={chartHeight}
            withHorizontalLabels={false}
            withInnerLines={false}
            withOuterLines={false}
            renderDotContent={({ x, y, index }) => {
                const point = filter.ano
                    ? agrupadoPorMesArray[index] // { mes, total }
                        ? { date: agrupadoPorMesArray[index].mes, value: agrupadoPorMesArray[index].total }
                        : { date: '', value: 0 }
                    : agrupado[index] // { date, value }
                        ? { date: agrupado[index].date, value: agrupado[index].value }
                        : { date: '', value: 0 };

                if (
                    selectedIndex &&
                    selectedIndex.data === point.date &&
                    selectedIndex.value === point.value
                ) {
                    return (
                        <View
                            key={index}
                            style={{
                                backgroundColor: 'rgba(81, 165, 131, 1)',
                                width: 50,
                                height: 35,
                                position: 'absolute',
                                top: y - 42,
                                left: x - 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
                                {point.value.toFixed(2)}
                            </Text>
                        </View>
                    );
                }
                return null;
            }}
            chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2,
                color: (opacity = 0.65) => `rgba(81, 165, 131, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    id: 'dots',
                },
                ...chartConfigOverrides,
            }}
            bezier
        />
    );

    // Se filtro mês, envolve em ScrollView horizontal
    if (filter.mes) {
        return (
            <View>
                <ScrollView
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{alignItems: 'center', justifyContent: 'center', paddingTop: 25}}
                >
                    {chart}
                </ScrollView>
            </View>
        );
    }

    return chart;
};

export default ReusableLineChart;
