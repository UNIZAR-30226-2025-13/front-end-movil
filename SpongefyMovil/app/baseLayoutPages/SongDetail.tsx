import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePlayer } from './PlayerContext';
import { useState } from 'react';
import { getData } from '../../utils/storage';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export default function SongDetail() {
    const { currentSong, isPlaying, setIsPlaying } = usePlayer();
    const router = useRouter();
    const [playCount, setPlayCount] = useState(0);
    const [rating, setRating] = useState(0);
    const [duration, setDuration] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const[showOptions, setShowOptions] = useState(false);
    const [myRating, setMyRating] = useState(0);
    useEffect(() => {
        if (!currentSong || !currentSong.link_cm) {
            console.error("❌ No se encontró el link_cm en la canción.");
            return;
        }
        const fetchSong = async () => {
            try {
                const response = await fetch(`https://spongefy-back-end.onrender.com/song/show?id_cancion=${currentSong?.id}`);
                const data = await response.json();
                
                console.log("📥 Respuesta de la API:", data);
                
                if (!data || !data.link_cm) {
                return null;
                }
                data.id = currentSong?.id;
                setPlayCount(data.reproducciones);
                setDuration(data.duracion);
                setReleaseDate(data.fecha_pub);
                return data;
            } catch (error) {
                console.error("❌ Error en fetchSongById:", error);
                return null;
            }
        }
        const getRating = async () => {
            try {
                const response = await fetch(`https://spongefy-back-end.onrender.com/get-average-rate?id_cm=${currentSong?.id}`);
                const data = await response.json();
                
                console.log("📥 Respuesta de la API:", data);
                
                console.log("⭐️ Valoración media:", data.valoracion_media);
                setRating(data.valoracion_media);
                return data;
            } catch (error) {
                console.error("❌ Error en fetchSongById:", error);
                return null;
            }
        }
        const getMyRating = async () => {
            try {
                const username = await getData("username");
                const response = await fetch(`https://spongefy-back-end.onrender.com/get-rate?id_cm=${currentSong?.id}&nombre_usuario=${username}`);
                const data = await response.json();
                
                console.log("📥 Respuesta de la API:", data);
                
                console.log("⭐️ Valoración mia:", data.valoracion_media);
                setMyRating(data.valoracion_media);
                return data;
            }
            catch (error) {
                console.error("❌ Error en fetchSongById:", error);
                return null;
            }
        }
        getMyRating();
        getRating();
        fetchSong();
    }, []);
    const handleMyValoration = async () => {
        console.log("Valorar Canción");
        //borrar rating anterior
        const deleteRating = async () => {
            try {
                const username = await getData("username");
                const bodyData = {
                    "id_cm": currentSong?.id,
                    "nombre_usuario": username
                }
                const response = await fetch(`https://spongefy-back-end.onrender.com/delete-rate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                });
                const data = await response.json();
                
                console.log("Respuesta de la API:", data);
                
                if (response.ok) {
                    console.log("Valoración borrada:", myRating);
                }
            } catch (error) {
                console.error("⚠️ Error en la solicitud:", error);
            }
        }
        await deleteRating();
        // Opcion de guardar valoración
        const saveRating = async () => {
            try {
                const username = await getData("username");
                const bodyData = {
                    "id_cm": currentSong?.id,
                    "nombre_usuario": username,
                    "valoracion": myRating
                }
                const response = await fetch(`https://spongefy-back-end.onrender.com/post-rate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                });
                const data = await response.json();
                
                console.log("Respuesta de la API:", data);
                
                if (response.ok) {
                    console.log("Valoración guardada:", myRating);
                }
            } catch (error) {
                console.error("⚠️ Error en la solicitud:", error);
            }
        }
        await saveRating();
        setShowOptions(false);
    }
    return currentSong ? (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                <View style={styles.bigCover}>
                    {currentSong.link_imagen ? (
                        <Image
                            source={{ uri: currentSong.link_imagen }}
                            style={styles.coverImage}
                        />
                    ) : (
                        <View style={styles.coverFallback} />
                    )}
                </View>
            </View>
            <View style={styles.titleContainer}>
                
                <Text style={styles.songTitle}>{currentSong.titulo}</Text>
                <Text style={styles.songArtist}>{currentSong.autor}</Text>
                <TouchableOpacity style={styles.moreOptions} onPress={() => setShowOptions(true)}>
                    <Text style={styles.songArtist}>Valorar </Text>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.playCount}>
                    Reproducciones: {playCount.toLocaleString('de-DE')}
                </Text>

                <View style={styles.starsContainer}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Ionicons
                        key={i}
                        name={i < rating ? 'star' : 'star-outline'} // Llena si i < rating, vacía si no
                        size={20}
                        color="#fff"
                        />
                    ))}
                </View>
                <Text style={styles.infoText}>Duración: {duration}</Text>
                <Text style={styles.infoText}>Fecha de Publicación: {releaseDate}</Text>
            </View>
            {showOptions && (
                <View style={styles.optionsOverlay}>
                    <View style={styles.optionsMenu}>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginBottom: 10 }}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <TouchableOpacity key={i} onPress={() => setMyRating(i + 1)}>
                                <Ionicons
                                    name={i < myRating ? 'star' : 'star-outline'}
                                    size={24}
                                    color="#FFD700" // Amarillo para destacar
                                />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={() => handleMyValoration()} style={styles.optionItem}>
                            <Text style={styles.optionText}>Guardar Valoración</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => setShowOptions(false)} style={styles.optionItem}>
                            <Text style={styles.optionText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    ) : null;

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
        marginTop: 80,
        marginBottom: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 300,
        marginBottom: 20,
    },
    bigCover: {
        width: 50,
        height: 50,
        backgroundColor: '#2F4F4F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    coverText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    songTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    songArtist: {
        color: '#bbb',
        fontSize: 16,
    },
    moreOptions: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'space-between',
    },
    infoContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    playCount: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoText: {
        color: '#bbb',
        fontSize: 14,
        marginBottom: 5,
    },
    coverImage: {
        width: SCREEN_WIDTH * 0.7,
        height: SCREEN_HEIGHT * 0.5,
        borderRadius: 12,
        marginTop: 200,
        backgroundColor: '#222',
    },
    coverFallback: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.7,
        borderRadius: 12,
        backgroundColor: '#333',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#111',
        paddingVertical: 8,
        marginTop: 'auto',
    },
    bottomBarItem: {
        alignItems: 'center',
    },
    bottomBarText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 2,
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