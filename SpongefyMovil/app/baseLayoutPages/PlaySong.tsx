// app/baseLayoutPages/Playsong.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Pressable, Modal, FlatList, TouchableOpacity, Alert, Dimensions, ScrollView } from "react-native";
import { Audio } from "expo-av";
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../utils/storage";
import { usePlayer } from './PlayerContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const THUMB_SIZE = 200;

export default function SongDetail() {
    const { currentSong, isPlaying, setIsPlaying } = usePlayer();
    const router = useRouter();
    const [progress, setProgress] = useState(0); // Estado para la barra de progreso
    const audioPlayer = useRef<Audio.Sound | null>(null);
    const rotation = useRef(new Animated.Value(0)).current;
    const [showOptions, setShowOptions] = useState(false);
    const { fetchAndPlaySong } = usePlayer();
    //indice de la cola
    const [queueIndex, setQueueIndex] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    // Listado de playlists estáticas (puedes agregar más si lo necesitas)
    /*
    const playlists = [
      { id: 1, nombre: "Playlist 1" },
      { id: 2, nombre: "Playlist 2" },
      { id: 3, nombre: "Playlist 3" },
    ];*/

    const toggleLoop = () => {
        setIsLooping(prev => {
            const next = !prev;
            if (audioPlayer.current) {
                audioPlayer.current.setIsLoopingAsync(next);
            }
            return next;
        });
    };
    useEffect(() => {
        if (!currentSong || !currentSong.link_cm) {
            console.error("❌ No se encontró el link_cm en la canción.");
            setLoading(false);
            return;
        }

        const loadAndPlaySong = async () => {
            setLoading(true);

            try {
                if (audioPlayer.current) {
                    await audioPlayer.current.unloadAsync();
                    audioPlayer.current = null;
                }

                const newSound = new Audio.Sound();
                await newSound.loadAsync({ uri: currentSong.link_cm as string });
                await newSound.playAsync();
                await newSound.setIsLoopingAsync(isLooping);

                audioPlayer.current = newSound;
                setIsPlaying(true);

                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();

                // Escuchar el progreso de la canción
                newSound.setOnPlaybackStatusUpdate(updateProgress);
            } catch (error) {
                console.error("❌ Error cargando la canción:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAndPlaySong();

        return () => {
            if (audioPlayer.current) {
                audioPlayer.current.unloadAsync();
            }
        };
    }, [currentSong, isLooping]);

    const handleSongEnd = async () => {
        //aumentar el indice de la cola
        setQueueIndex(prevIndex => {
            const newIndex = prevIndex + 1;
            console.log("Nuevo índice:", newIndex);
            fetchNextSong(newIndex); // Llamar a la función con el índice actualizado
            return newIndex;
        });
        //console.log("Índice de cola actualizado:", queueIndex);

        //reproducir esa posicion de cola
    }
    const fetchNextSong = async (index: number) => {
        try {
            const username = await getData("username");
            console.log("👤 Usuario obtenido:", username);
            const url = `https://spongefy-back-end.onrender.com/queue/get-cm?nombre_usuario=${username}&posicion=${index}`;

            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                console.log("Respuesta de la API:", data);
                // Aquí puedes reproducir la canción obtenida
                audioPlayer.current?.unloadAsync(); // Descargar la canción actual
                audioPlayer.current = null; // Limpiar el audio actual
                fetchAndPlaySong(data.id_cm); // Llama a la función para reproducir la canción
            }
        } catch (error) {
            console.error("⚠️ Error en la solicitud:", error);
        } finally {
            setLoading(false);
        }
    }
    // Función para actualizar la barra de progreso
    const updateProgress = async (status: any) => {
        if (status.isLoaded && status.durationMillis) {
            setProgress(status.positionMillis / status.durationMillis);
        }
        // Verificar si la canción ha terminado
        if (!isLooping && status.positionMillis === status.durationMillis) {
            console.log("La canción ha terminado");
            // Aquí puedes realizar la acción que desees cuando termine la canción

            handleSongEnd(); // Función que manejaría la acción al terminar la canción
        }
    };

    const togglePlayPause = async () => {
        if (audioPlayer.current) {
            if (isPlaying) {
                await audioPlayer.current.pauseAsync();
            } else {
                await audioPlayer.current.playAsync();
            }
            setIsPlaying(!isPlaying);
            Animated.timing(rotation, {
                toValue: isPlaying ? 0 : 1,
                duration: 100,
                useNativeDriver: true,
            }).start();
        }
    };



    const [playlists, setPlaylists] = useState<{ id_lista: number; nombre: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Función para abrir el modal y obtener las playlists
    const toggleAddtoPlaylist = async () => {
        //await fetchPlaylists(); // Llamamos a la función para obtener las playlists
        const fetchPlaylists = async () => {
            setLoading(true);
            try {
                const username = await getData("username");
                console.log("👤 Usuario obtenido:", username);
                const url = `https://spongefy-back-end.onrender.com/get-playlists?nombre_usuario=${username}`;


                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    setPlaylists(data);
                    console.log("Playlists obtenidas:", playlists); // Puedes hacer algo con las playlists si es necesario
                } else {
                    console.error("❌ Error al obtener playlists:", data);
                }
            } catch (error) {
                console.error("⚠️ Error en la solicitud:", error);
            } finally {
                setLoading(false);
            }
        };

        // Ejecutar la consulta
        fetchPlaylists();

        console.log("Id Cancion actual:", currentSong?.id);


        setModalVisible(true);  // Abrimos el modal

    };

    // Función para manejar la selección de una playlist
    const selectPlaylist = (playlistId: number) => {
        console.log("Playlist seleccionada:", playlistId);
        //Añadir currentSong.id a la playlist seleccionada

        const addSongToPlaylist = async () => {
            try {
                const url = `https://spongefy-back-end.onrender.com/add-song-playlist`;
                const bodyData = {
                    "id_cancion": currentSong?.id,
                    "id_playlist": playlistId
                }
                const response = await fetch(url, {
                    method: "POST", // Cambiado a POST
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                });
                const data = await response.json();
                console.log("Respuesta de la API:", data);
                Alert.alert("Canción añadida a la playlist.");
                if (data.success) {

                }
            } catch (error) {
                console.error("❌ Error al añadir canción a playlist:", error);
            }
        };
        addSongToPlaylist();
        setModalVisible(false);  // Cerrar el modal después de seleccionar


    };
    type Content = {
        titulo: string;
        duracion: string;
        link_imagen: string;
        fecha_pub: string;
        posicion: number;
        artista: string;
        featurings: string[];
        podcast: string;
    };
    //Modal de la cola

    const [queueModalVisible, setQueueModalVisible] = useState(false);
    const [queue, setQueue] = useState<Content[]>([]);
    const toggleQueue = () => {

        const fetchQueue = async () => {
            try {
                const username = await getData("username");
                console.log("👤 Usuario obtenido:", username);
                const url = `https://spongefy-back-end.onrender.com/queue/show?nombre_usuario=${username}&posicion=0`;
                const response = await fetch(url);
                const data = await response.json();
                console.log("Respuesta de la API:", data);
                if (response.ok) {
                    setQueue(data.cola);
                    console.log("Cola obtenida:", queue); // Puedes hacer algo con las playlists si es necesario
                }
            } catch (error) {
                console.error("⚠️ Error en la solicitud:", error);
            }
        };
        fetchQueue();
        setQueueModalVisible(true);
    }
    const toggleBorrarQueue = async (borrar: boolean) => {
        const clearQueue = async () => {
            try {
                const username = await getData("username");
                const url = `https://spongefy-back-end.onrender.com/queue/clear`;
                const bodyData = {
                    "nombre_usuario": username // Cambia esto por el nombre de usuario real
                }
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                });
                const data = await response.json();
                console.log("Respuesta de la API:", data);
            } catch (error) {
                console.error("❌ Error al borrar cola:", error);
            }

        }
        clearQueue();
        setQueue([]);
    };
    const toggleRandomQueue = async (aleatorio: boolean) => {
        const randomQueue = async () => {
            try {
                const username = await getData("username");
                const url = `https://spongefy-back-end.onrender.com/queue/shuffle`;
                const bodyData = {
                    "nombre_usuario": username, // Cambia esto por el nombre de usuario real
                    "posicion": 0
                }
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                });
                const data = await response.json();
                console.log("Respuesta de la API:", data);
            } catch (error) {
                console.error("❌ Error al aleatorizar cola:", error);
            }

        }
        randomQueue();
        const fetchQueue = async () => {
            try {
                const username = await getData("username");
                console.log("👤 Usuario obtenido:", username);
                const url = `https://spongefy-back-end.onrender.com/queue/show?nombre_usuario=${username}&posicion=0`;
                const response = await fetch(url);
                const data = await response.json();
                console.log("Respuesta de la API:", data);
                if (response.ok) {
                    setQueue(data.cola);
                    console.log("Cola obtenida:", queue); // Puedes hacer algo con las playlists si es necesario
                }
            } catch (error) {
                console.error("⚠️ Error en la solicitud:", error);
            }
        };
        fetchQueue();
    };

    const goToNext = () => {
        setQueueIndex(i => {
            const next = i + 1;
            fetchNextSong(next);
            return next;
        });
    };
    const goToPrevious = () => {
        setQueueIndex(i => {
            const prev = i - 1;
            fetchNextSong(prev);
            return prev;
        });
    };

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
    });

    if (!currentSong) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune chanson chargée.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Bouton retour */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                {currentSong.link_imagen ? (
                    <Image
                        source={{ uri: currentSong.link_imagen }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.coverFallback} />
                )}
            </View>

            {/* Titre & artiste */}
            <View style={styles.infoContainer}>
                <Text style={styles.songTitle}>{currentSong.titulo}</Text>
                <View style={styles.artistRow}>
                    <Text style={styles.songArtists}>{currentSong.autor}</Text>
                    <Pressable onPress={() => setShowOptions(true)} style={styles.ellipsisBtn}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>

            {/* Contrôles de lecture */}
            <View style={styles.controlsRow}>
                <TouchableOpacity onPress={() => toggleRandomQueue(true)} style={styles.controlBtn}>
                    <Image source={require('../../assets/aleatorio.png')} style={styles.controlIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToPrevious} style={styles.controlBtn}>
                    <Ionicons name="play-skip-back" size={32} color="#fff" />
                </TouchableOpacity>

                <Pressable onPress={togglePlayPause} style={styles.controlBtn}>
                    <Animated.Image
                        source={isPlaying ? require("../../assets/pause.png") : require("../../assets/play.png")}
                        style={[
                            styles.controlIcon,
                            { transform: [{ rotate: rotateInterpolate }] }
                        ]}
                        fadeDuration={2}
                    />
                </Pressable>

                <TouchableOpacity onPress={goToNext} style={styles.controlBtn}>
                    <Ionicons name="play-skip-forward" size={32} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleLoop} style={styles.controlBtn}>
                    <Image source={require('../../assets/bucle.png')} style={styles.controlIcon} />
                </TouchableOpacity>
            </View>

            {/* Bottom actions */}
            <View style={styles.bottomRow}>
                <TouchableOpacity style={styles.bottomBtn} onPress={() => toggleAddtoPlaylist()}>
                    <Image source={require('../../assets/anyadirplaylist.png')} style={styles.controlIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBtn} onPress={() => router.push(`/baseLayoutPages/lyrics/${currentSong.id}`)}>
                    <Text style={styles.lyricsText}>Letra</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBtn} onPress={() => console.log('Favorite')}>
                    <Image source={require('../../assets/heart.png')} style={styles.controlIcon} />
                </TouchableOpacity>
            </View>
            {/* Modal con las playlists */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir a Playlist</Text>
                        {loading ? (
                            <Text>Cargando listas...</Text>
                        ) : (
                            <FlatList
                                data={playlists}
                                keyExtractor={(item) => item.id_lista ? item.id_lista.toString() : String(item.nombre)}  // Usa 'id_lista' en lugar de 'id'
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.playlistItem}
                                        onPress={() => {
                                            if (item.id_lista) {
                                                console.log("ID de la playlist:", item.id_lista);  // Verifica que id_lista es el valor correcto
                                                selectPlaylist(item.id_lista);  // Usa 'id_lista' para pasar el valor correcto
                                            } else {
                                                console.error("No se encontró un ID para este item:", item);
                                            }
                                        }}
                                    >
                                        <Text style={styles.playlistText}>{item.nombre}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {showOptions && (
                <View style={styles.optionsOverlay}>
                    <View style={styles.optionsMenu}>
                        <TouchableOpacity onPress={() => router.push(`/baseLayoutPages/artista/${currentSong.autor}`)} style={styles.optionItem}>
                            <Text style={styles.optionText}>Ver Artista</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push(`/baseLayoutPages/playlist/${currentSong.id}`)} style={styles.optionItem}>
                            <Text style={styles.optionText}>Ver Álbum</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/baseLayoutPages/SongDetail')} style={styles.optionItem}>
                            <Text style={styles.optionText}>Ver información</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowOptions(false)} style={styles.optionItem}>
                            <Text style={styles.optionText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#fff',
    },

    backButton: {
        margin: 16,
    },
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ellipsisBtn: {
        marginLeft: 12,
        padding: 4,
    },
    playlistItem: {
        padding: 10,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 3,
    },
    playlistText: {
        fontSize: 16,
    },
    coverContainer: {
        alignItems: 'center',
    },
    coverImage: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.6,
        borderRadius: 12,
        backgroundColor: '#222',
    },
    coverFallback: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.7,
        borderRadius: 12,
        backgroundColor: '#333',
    },

    infoContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    songTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    songArtists: {
        color: '#ccc',
        fontSize: 16,
        marginTop: 4,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#000000",
        borderRadius: 5,
        alignItems: "center",
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    Queue: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        backgroundColor: "#CDCDCD",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: 'transparent',
        borderRadius: 2,
        marginVertical: 20,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: "white",
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
    },

    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',

        alignItems: 'center',
        marginBottom: 20,
    },
    controlBtn: {
        padding: 12,
    },
    controlIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    bottomBtn: {
        alignItems: 'center',
    },
    lyricsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionsOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsMenu: {
        width: 200,
        backgroundColor: '#6A0DAD',  // violet
        borderRadius: 12,
        paddingVertical: 8,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
    },
});
