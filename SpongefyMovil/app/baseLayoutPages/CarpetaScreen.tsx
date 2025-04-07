import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getData } from "../../utils/storage";
import { fetchAndSaveFolder } from "../../utils/fetch";

interface PlaylistLista {
    id_lista: number;
    nombre: string;
    color: string;
}

export default function CarpetaScreen() {
    const router = useRouter();
    const [listas, setListas] = useState<PlaylistLista[]>([]);
    const [nombreCarpeta, setNombreCarpeta] = useState<string>("");
    const [showOptions, setShowOptions] = useState<boolean>(false);

    useEffect(() => {
        const loadPlaylists = async () => {
            const id_carpeta = await getData("id_folder");
            if (id_carpeta) {
                await fetchAndSaveFolder(id_carpeta);
                const datosCarpeta = await getData("folder");
                if (datosCarpeta) {
                    setListas(datosCarpeta.listas || []);
                    setNombreCarpeta(datosCarpeta.nombre_carpeta || "");
                }
            }
        };
        loadPlaylists();
    }, []);

    const handleAddPlaylist = () => {
        router.push('/AddPlaylistToFolder');
    };

    const handleDeleteFolder = async () => {
        try {
            const id_carpeta = await getData("id_folder");
            const nombre_usuario = await getData("username");

            if (!id_carpeta || !nombre_usuario) {
                console.error("Error: faltan datos necesarios.");
                return;
            }

            const response = await fetch("https://spongefy-back-end.onrender.com/remove-folder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_usuario, id_carpeta }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Carpeta eliminada con éxito:", data);
                router.push("/Biblioteca");
            } else {
                console.error("Error al eliminar la carpeta:", data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error de conexión con el servidor");
        }
    };

    const handleDeletePlaylist = async (id_lista: number) => {
        try {
            const id_carpeta = await getData("id_folder");
            const nombre_usuario = await getData("username");
    
            if (!id_carpeta || !nombre_usuario) {
                console.error("Error: faltan datos necesarios.");
                return;
            }
    
            const response = await fetch("https://spongefy-back-end.onrender.com/remove-list-from-folder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_usuario, id_carpeta, id_lista }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Playlist eliminada con éxito:", data);
                setListas(prevListas => prevListas.filter(lista => lista.id_lista !== id_lista));
            } else {
                console.error("Error al eliminar la playlist:", data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.title}>{nombreCarpeta}</Text>

                {/* Menú hamburguesa */}
                <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Opciones del menú */}
                {showOptions && (
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={handleDeleteFolder}>
                            <Text style={styles.optionText}>Eliminar carpeta</Text>
                        </TouchableOpacity>

                    </View>
                )}
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                <ScrollView style={styles.scrollView}>

                    {listas.length > 0 ? (
                    listas.map((lista, index) => (
                        <View key={index} style={styles.playlistContainer}>
                            <TouchableOpacity
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>{lista.nombre}</Text>
                            </TouchableOpacity>
                    
                            {/* Botón de opciones */}
                            <TouchableOpacity 
                                style={styles.optionsButton} 
                                onPress={() => handleDeletePlaylist(lista.id_lista)}
                            >
                                <Ionicons name="trash" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ))

                    ) : (
                        <Text style={styles.playlistText}>Esta carpeta no tiene listas</Text>
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.addButton} onPress={handleAddPlaylist}>
                    <Ionicons name="add" size={24} color="white" />
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
        textAlign: 'center', 
        flex: 1,
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
    playlistContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#222",
        marginVertical: 5,
        borderRadius: 10,
    },
    optionsButton: {
        padding: 10,
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
        top: 40, 
        right: 10,
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 10,
        zIndex: 10, // Eleva el menú sobre otros elementos
        elevation: 5, // Eleva el menú en Android
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
