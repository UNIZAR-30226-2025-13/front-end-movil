import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getData } from "../utils/storage";
import { fetchAndSaveFolder } from "../utils/fetch";

interface PlaylistLista {
    id_lista: number;
    nombre: string;
    color: string;
}
interface Carpeta {
    nombre_carpeta: string;
    listas: PlaylistLista[];
}

export default function CarpetaScreen() {
    const router = useRouter();
    const [listas, setListas] = useState<PlaylistLista[]>([]);
    const [nombreCarpeta, setNombreCarpeta] = useState<string>(""); 
    const [showOptions, setShowOptions] = useState<boolean>(false); 

    useEffect(() => {
        const loadPlaylists = async () => {
            const id_carpeta = await getData("id_folder");
            console.log("ID carpeta:", id_carpeta);
            if (id_carpeta) {
                await fetchAndSaveFolder(id_carpeta);
                const datosCarpeta = await getData("folder");
                if (datosCarpeta) {
                    setListas(datosCarpeta.listas || []);
                    setNombreCarpeta(datosCarpeta.nombre_carpeta || ""); // Guardar nombre de la carpeta
                }
            }
        };
        loadPlaylists();
    }, []);

    const handleAddPlaylist = () => {
        console.log("Botón añadir playlist pulsado");
        router.push('/CrearPlaylist');
    };

    const handleBiblioteca = () => {
        router.push('/Biblioteca');
    };

    const handleDeleteFolder = () => {
        console.log("Eliminar carpeta pulsado");
        setShowOptions(false);
        // Aquí puedes llamar a la API para eliminar la carpeta
    };

    const handleDeletePlaylists = () => {
        console.log("Eliminar todas las playlists de la carpeta");
        setShowOptions(false);
        // Aquí puedes agregar la lógica para eliminar playlists
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.title}>{nombreCarpeta}</Text>
                </View>

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
                        <TouchableOpacity style={styles.optionButton} onPress={handleDeletePlaylists}>
                            <Text style={styles.optionText}>Eliminar playlists</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                <ScrollView style={styles.scrollView}>
                    {listas.length > 0 ? (
                        listas.map((lista, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>{lista.nombre}</Text>
                            </TouchableOpacity>
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

                <TouchableOpacity style={styles.bottomBarItem} onPress={handleBiblioteca}>
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

