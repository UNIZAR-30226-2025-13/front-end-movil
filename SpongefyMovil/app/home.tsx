import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

    const handleLogout = () => {
        // Exemple: rediriger vers l'écran de connexion
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a Spongefy</Text>
            <Text style={styles.subtitle}>Esta es la página de inicio</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#9400D3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
