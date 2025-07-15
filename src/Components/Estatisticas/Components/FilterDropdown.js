import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons'

const FilterDropdown = ({
    options = [],
    selected,
    onChange,
    style,
    dropdownStyle,
    textStyle,
    iconColor = '#616161',
    iconSize = 15,
    placeholder = 'Selecione',
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={style}>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.4}
                style={[
                    styles.button,
                    modalVisible && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                ]}
            >
                <Text style={[styles.text, textStyle]}>
                    {selected || placeholder}
                </Text>
                <Octicons name="chevron-down" size={iconSize} color={iconColor} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                onRequestClose={() => setModalVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setModalVisible(false)}
                    activeOpacity={1}
                >
                    <View style={[styles.dropdown, dropdownStyle]}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.option}
                                onPress={() => {
                                    onChange(option);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={{ textAlign: 'center', color: '#616161' }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#ccc',
        justifyContent: 'space-between',
    },
    text: {
        color: '#616161',
        fontSize: 14,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    option: {
        padding: 20,
        borderWidth: 0.5,
        borderColor: '#eee',
    },
});

export default FilterDropdown;