import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

// PeriodSelector.js

const PeriodSelector = ({ options, activeOption, onSelect, styles, color }) => (
    <View style={styles.containerButtons}>
        {options.map(option => (
            <TouchableOpacity
                key={option.key}
                onPress={() => onSelect(option.key)}
                style={[
                    styles.button,
                    { backgroundColor: activeOption === option.key ? color.color1 : color.color2 }
                ]}
            >
                <Text
                    style={[
                        styles.buttonText,
                        { color: activeOption === option.key ? color.colorText1 : color.colorText2 }
                    ]}
                >
                    {option.label}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default PeriodSelector;
