import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native';

// Item reutilizável
export function TransactionItem({
    item,
    selected,
    onPress,
    renderIcon,
    renderValue,
    renderAction,
    styles: customStyles = {},
    textColor,
    backgroundColor
}) {
    return (
        <SafeAreaView style={[styles.container, customStyles.container]}>
            <TouchableOpacity
                activeOpacity={0.7}
                style={[{ borderRadius: 5, backgroundColor }, customStyles.touchable]}
                onPress={() => onPress?.(item)}
            >
                <View style={[styles.historico, customStyles.historico]}>
                    <View style={styles.containerDadosHistorico}>
                        <View style={styles.containerIcone}>
                            {renderIcon
                                ? renderIcon(item)
                                : (
                                    <Image
                                        style={styles.icone}
                                        source={{ uri: 'https://i.pinimg.com/736x/94/2d/ad/942dad6843904cf0a9cdbe9f4d845cb0.jpg' }}
                                    />
                                )
                            }
                        </View>
                        <View style={styles.areaDadosTransferencia}>
                            <Text style={[styles.tituloDaDespesa, { color: textColor }]}>{item.description}</Text>
                            <Text style={[styles.dataDaDespesa, { color: textColor }]}>{item.date}</Text>
                        </View>
                    </View>
                    {renderValue
                        ? renderValue(item)
                        : renderAction
                            ? renderAction(item)
                            : (
                                <Text
                                    style={[
                                        styles.valorDaDespesa,
                                        { color: item.type === "despesa" ? '#ED0000' : '#55D96B' }
                                    ]}
                                >
                                    {item.type === "despesa" ? '- R$ ' : '+ R$ '}{item.value.toFixed(2)}
                                </Text>
                            )
                    }
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

// Lista reutilizável
export default function ListTransaction({
    data,
    isSelected,
    onSelect,
    ListEmptyComponent,
    renderIcon,
    renderValue,
    renderAction,
    styles: customStyles = {}
}) {
    return (
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
                const selected = typeof isSelected === 'function' ? isSelected(item) : false;
                const backgroundColor = selected ? '#51A583' : '#fff';
                const textColor = selected ? '#fff' : '#000';
                return (
                    <TransactionItem
                        item={item}
                        selected={selected}
                        onPress={onSelect}
                        renderIcon={renderIcon}
                        renderValue={renderValue}
                        renderAction={renderAction}
                        styles={customStyles}
                        textColor={textColor}
                        backgroundColor={backgroundColor}
                    />
                );
            }}
            ListEmptyComponent={ListEmptyComponent}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: '3%',
        marginRight: '3%',
        padding: 5
    },
    containerDadosHistorico: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    historico: {
        width: '100%',
        paddingBottom: 10,
        paddingTop: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerIcone: {
        backgroundColor: '#F0F6F5',
        padding: 5,
        borderRadius: 15,
    },
    icone: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
    areaDadosTransferencia: {
        gap: 8
    },
    tituloDaDespesa: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold'
    },
    dataDaDespesa: {
        color: '#7C7C7C'
    },
    valorDaDespesa: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    botaoPagarConta: {
        padding: 10,
        paddingRight: 25,
        paddingLeft: 25,
        borderRadius: 15,
        backgroundColor: '#ECF9F8',
    }
});