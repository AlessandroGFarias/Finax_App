import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons'

const FilterDropdown = ({
    options,
    selected,
    onChange,
    style,
    iconName,
    iconSize,
    iconColor,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={style.containerFiltroGastoOuReceita}>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.4}
                style={[style.buttonFilterGastoOuReceita,
                    modalVisible && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                ]}
            >
                <Text style={style.buttonText}>
                    {selected}
                </Text>
                { iconName && (<Octicons name={iconName} size={iconSize ? iconSize : 15} color={iconColor ? iconColor : '#fff'} />)}
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
                animationType="fade"
            >
                <View style={style.filterGastoOuReceita}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[style.buttonFilterGastoOuReceita, {borderRadius:0}]}
                            onPress={() => {
                                onChange(option);
                                setModalVisible(false);
                            }}
                        >
                            <Text style={{ textAlign: 'center', color: '#616161' }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
};

export default FilterDropdown;