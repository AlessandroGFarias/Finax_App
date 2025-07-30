import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const IconOptionButton = ({
    title,
    onPress,
    icon,
    iconSize,
    iconColor,
    style,
    textStyle,
    children,
}) => (
    <TouchableOpacity style={[styles.listItem, style]} onPress={onPress}>
        {icon && (
            <MaterialCommunityIcons name={icon} size={iconSize} color={iconColor} />
        )}
        <Text style={[styles.textInfo, textStyle]}>
            {children || title}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    textInfo: {
        marginLeft: 12,
        fontSize: 16,
        color: '#000',
    },
});

export default IconOptionButton;