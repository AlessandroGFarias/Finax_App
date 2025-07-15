import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const EstatisticsLoading = ({ visible, mensagem }) => (
    <Modal
        animationType="fade"
        visible={visible}
    >
        <View style={styles.overlay}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#51A583" />
                { mensagem &&
                <Text style={styles.text}>{mensagem}</Text>
                }
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        paddingBottom: 10,
    },
});

export default EstatisticsLoading;