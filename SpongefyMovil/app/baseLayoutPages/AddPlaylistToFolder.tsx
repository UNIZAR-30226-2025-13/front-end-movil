import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getData } from "../../utils/storage";
import { fetchAndSaveAllPlaylists } from "../../utils/fetch";

interface Playlist {
    id_lista: number;
    nombre: string;
}
interface ListaPlaylists {
    listas: Playlist[];
}

export default function CarpetaScreen() {
    const router = useRouter();
    const [listas, setListas] = useState<Playlist[]>([]);

    useEffect(() => {
        const loadLibrary = async () => {
            const username = await getData("username");
            console.log(username);
            if (username) {
                await fetchAndSaveAllPlaylists(username);
                const datosPlaylists = await getData("playlists");

                if (datosPlaylists) {
                    setListas(datosPlaylists); 
                }
            }
        };

        loadLibrary();
    }, []);

    const handleAddPlaylist = async (id_playlist: number) => {
        try {
            const id_carpeta = await getData("id_folder");
            const nombre_usuario = await getData("username");
    
            if (!id_carpeta || !nombre_usuario) {
                console.error("No se pudo obtener id_carpeta o nombre_usuario");
                return;
            }
    
            const response = await fetch("https://spongefy-back-end.onrender.com/add-list-to-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_usuario,
                    id_carpeta: Number(id_carpeta),
                    id_lista: id_playlist,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Playlist añadida con éxito:", data);
                router.push('/baseLayoutPages/CarpetaScreen');
            } else {
                console.error("Error al añadir la playlist:", data.message);

            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            alert("Error de conexión con el servidor");
        }
    };

    const handleBiblioteca = () => {
        router.push('/baseLayoutPages/Biblioteca');
    };


    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.title}>{"Añadir playlists"}</Text>
                </View>

            </View>

            {/* Contenido */}
            <View style={styles.content}>
                <ScrollView style={styles.scrollView}>
                    {listas.length > 0 ? (
                        listas.map((lista, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.playlistItem}
                                onPress={() => handleAddPlaylist(lista.id_lista)}
                            >
                                <Text style={styles.playlistText}>{lista.nombre}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.playlistText}>No tienes playlists</Text>
                    )}
                </ScrollView>

            </View>

            {/* Barra de navegación inferior */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('/baseLayoutPages/home')}>
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarItem} onPress={handleBiblioteca}>
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('../perfil')}>
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
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    title: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginHorizontal: 16,
    },
    playlistItem: {
        backgroundColor: "#222",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
    },
    playlistText: {
        color: "#fff",
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'purple',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
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
    optionsContainer: {
        position: 'absolute',
        top: 35,
        right: 10,
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 10,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
});

