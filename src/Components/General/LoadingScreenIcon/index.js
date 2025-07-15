import React from 'react';
import { Modal, View, Image, StyleSheet } from 'react-native';

const LoadingScreenIcon = ({ visible, imageUrl }) => (
    <Modal
        animationType="fade"
        visible={visible}
    >
        <View style={styles.container}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#4EAE7D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
    },
});

export default LoadingScreenIcon;