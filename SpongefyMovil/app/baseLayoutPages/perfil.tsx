import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
//import { fetchAndSaveProfile } from '../../utils/fetch';
import { saveData, getData, removeData } from "../../utils/storage";

export default function ProfileScreen() {
    const router = useRouter();
    const [perfil, setPerfil] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            const nombre_usuario = await getData("username");
            //await fetchAndSaveProfile(nombre_usuario); 
            const datosPerfil = await getData("profile");

            if (datosPerfil) {
                const perfilObj = JSON.parse(datosPerfil);
                setPerfil(perfilObj);
            }
        };
    
        loadProfile();
    }, []);


    const handleBack = () => {
        router.push('/baseLayoutPages/home');
    };

    const handleEditProfile = () => {
        router.push('/baseLayoutPages/EditPerfil');
    };

    const handleLogout = () => {
        console.log("Cerrar Sesión");
    };

    const handleDeleteAccount = () => {
        console.log("Eliminar Cuenta");
    };

    const handleBiblioteca = () => {
        router.push('/baseLayoutPages/Biblioteca');
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/logo.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.profileTitle}>Tu perfil</Text>
                    <Text style={styles.subtitle}>Datos personales</Text>


            
                        
                    <Text style={styles.label}>Contraseña</Text>
                    <Text style={styles.value}>********</Text>

                    <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                        <Text style={styles.buttonText}>Editar perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Cerrar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDeleteAccount}
                    >
                        <Text style={[styles.buttonText, styles.deleteButtonText]}>
                            Eliminar Cuenta
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('/baseLayoutPages/home')}>
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarItem} onPress={handleBiblioteca}>
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('/baseLayoutPages/perfil')}
                >
                    <Ionicons name="person" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Perfil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9400D3',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    content: {
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 50,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 20,
    },
    username: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 14,
        borderRadius: 25,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#9400D3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#fff',
        marginTop: 20,
    },
    deleteButtonText: {
        color: '#fff',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#111',
        paddingVertical: 8,
    },
    bottomBarItem: {
        alignItems: 'center',
    },
    bottomBarText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 2,
    },
});
