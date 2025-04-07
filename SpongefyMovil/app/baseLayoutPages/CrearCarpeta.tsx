import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getData } from "../../utils/storage";

export default function CreateCarpetaScreen() {
    const router = useRouter();
    const [folderName, setFolderName] = useState('');
    const [username, setUsername] = useState(''); // Guarda el nombre de usuario

    useEffect(() => {
        const loadUser = async () => {
            const storedUsername = await getData("username");
            console.log("Usuario obtenido:", storedUsername);
            setUsername(storedUsername || ""); // Guarda el usuario
        };
        loadUser();
    }, []);

    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            console.log("Error", "El nombre de la carpeta no puede estar vacío.");
            return;
        }
        if (!username) {
            console.log("Error", "No se pudo obtener el nombre de usuario.");
            return;
        }

        try {
            const url = `https://spongefy-back-end.onrender.com/create-folder`;

            const bodyData = {
                nombre_usuario: username, 
                nombre_carpeta: folderName,
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Carpeta creada exitosamente:", data);
                router.push("/Biblioteca");
            } else {
                console.error("Error al crear la carpeta:", data);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };


    return (
        <View style={styles.container}>
            {/* Contenedor del título y la flecha */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Biblioteca')}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Nueva Carpeta</Text>
            </View>

            {/* Contenedor centrado para el input y el botón */}
            <View style={styles.centeredContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la carpeta"
                    placeholderTextColor="#888"
                    value={folderName}
                    onChangeText={setFolderName}
                />

                <TouchableOpacity style={styles.confirmButton} onPress={handleCreateFolder}>
                    <Text style={styles.confirmButtonText}>Crear carpeta</Text>
                </TouchableOpacity>
            </View>

            {/* Barra de navegación inferior */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('/home')}>
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('/Biblioteca')}>
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('/perfil')}>
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
        backgroundColor: '#000',
        paddingBottom: 60,
    },
    header: {
        flexDirection: "row", // Alinea la flecha y el título en la misma fila
        alignItems: "center", // Asegura alineación vertical
        paddingHorizontal: 16,
        marginTop: 40,
        marginBottom: 20,
    },
    
    title: {
        flex: 1, 
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: "center", 
    },
    backButton: {
        marginRight: 1,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        backgroundColor: '#222',
        color: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: 'purple',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#111',
        paddingVertical: 10,
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
