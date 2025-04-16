import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveData, getData, removeData } from "../../../utils/storage";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { usePlayer } from '../PlayerContext';

export default function PlaylistDetailScreen() {
    const router = useRouter();
    const { id_playlist } = useLocalSearchParams<{ id_playlist: string | string[] }>();
    const { fetchAndPlaySong } = usePlayer(); 
    console.log("PlaylistDetailScreen: ", id_playlist);
    // Liste de chansons statiques
    const [playlistData, setPlaylistData] = useState({
        nombre: '',
        color: '',
        es_playlist: false,
        es_publica: false,
        nombre_usuario: '',
        contenido: []
    });
    
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const getPlaylistData = async () => {
            //Usar get-list-data para hacer llamada a la API y obtener datos de la playlist con el id correcto
            setLoading(true);
            try{
                const username = await getData("username");
                console.log("👤 Usuario obtenido:", username);
                const url = `https://spongefy-back-end.onrender.com/get-list-data?id_lista=${id_playlist}&nombre_usuario=${username}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    console.log("Respuesta de la API:", data);
                    setPlaylistData({
                        nombre: data.nombre,
                        color: data.color,
                        es_playlist: data.es_playlist,
                        es_publica: data.es_publica,
                        nombre_usuario: data.nombre_usuario,
                        contenido: data.contenido
                    });
                }
            }catch (error) {
                console.error("⚠️ Error en la solicitud:", error);
            } finally{
                setLoading(false);
            }

        }
        getPlaylistData();
    }, []);
    
    // Convertir una duración HH:mm:ss a segundos
    const convertToSeconds = (duration: string) => {
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    // Sumar todas las duraciones
    const getTotalDuration = (contenido: any[]) => {
        return contenido.reduce((total, cancion) => {
        return total + convertToSeconds(cancion.duracion);
        }, 0);
    };

    // Convertir los segundos totales a formato HH:mm:ss
    const convertSecondsToTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        return `${String(hours).padStart(2, '0')} h ${String(minutes).padStart(2, '0')} min ${String(remainingSeconds).padStart(2, '0')} s`;
    };

    // Obtener la duración total de la playlist
    const totalDuration = getTotalDuration(playlistData.contenido);
    const formattedDuration = convertSecondsToTime(totalDuration);
    const handleShuffle = () => {
        console.log("Bouton shuffle cliqué");
    };

    const handleAddMusic = () => {
        // Navigue vers l'écran d'ajout de musiques
        router.push('./AddMusicToPlaylist');
    };

    const handleMoreOptions = () => {
        console.log("Plus d'options...");
    };

    return (
        <View style={styles.container}>
            {/* Bouton retour */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Pochette et info */}
            <View style={styles.coverContainer}>
                <View style={[styles.bigCover, { backgroundColor: playlistData.color }]}>
                    <Text style={styles.bigCoverText}>{playlistData.nombre}</Text>
                </View>
                <Text style={styles.playlistInfo}>{playlistData.es_publica ? 'Pública' : 'Privada'} | {playlistData.contenido.length} canciones | {formattedDuration}</Text>
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.iconLeft} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#888"
                />
            </View>

            {/* Barre d’actions (shuffle, add, menu) */}
            <View style={styles.actionsBar}>
                <TouchableOpacity onPress={handleShuffle} style={styles.actionButton}>
                    <Ionicons name="shuffle" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddMusic} style={styles.actionButton}>
                    <Ionicons name="add-circle" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleMoreOptions} style={styles.actionButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.songsContainer}>
                {playlistData.contenido.map((song) => (
                    <TouchableOpacity
                        key={song.id_cm}
                        style={styles.songRow}
                        onPress={() => {
                            fetchAndPlaySong(song.id_cm);
                          }}
                    >
                        <Image source={song.link_imagen} style={styles.artistAvatar} />
                        <View style={styles.songInfo}>
                            <Text style={styles.songTitle}>{song.titulo}</Text>
                            <Text style={styles.songArtist}>{song.nombre_creador}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Barre de navigation inférieure */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('../home')}
                >
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('../Biblioteca')}
                >
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('../perfil')}
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
        backgroundColor: '#000',
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    backButton: {
        marginBottom: 20,
    },
    coverContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    bigCover: {
        width: 300,
        height: 300,
        backgroundColor: '#2F4F4F', // Couleur de fond (ou un <Image>)
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    bigCoverText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    playlistInfo: {
        color: '#bbb',
        fontSize: 14,
    },
    actionsBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    actionButton: {
        marginRight: 20,
    },
    songsContainer: {
        flex: 1,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    artistAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        resizeMode: 'cover',
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    songArtist: {
        color: '#bbb',
        fontSize: 14,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderColor: '#9400D3',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
        marginHorizontal: 16,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    iconLeft: {
        marginRight: 8,
    },
});
