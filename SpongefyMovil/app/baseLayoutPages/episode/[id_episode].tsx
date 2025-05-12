import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getData } from '../../../utils/storage';
import { usePlayer } from '../PlayerContext';

export default function PlaylistDetailScreen() {
    const router = useRouter();
    const { id_episode } = useLocalSearchParams<{ id_episode: string | string[] }>();
    const { fetchAndPlayEp } = usePlayer();
    
    const[showOptions, setShowOptions] = useState(false);
    interface EpisodioInfo {
        nombre_ep: string;
        id_podcast: number;
        nombre_podcast: string;
        link_imagen: string;
        descripcion: string;
        fecha_pub: string; // si quieres ser más estricto podrías usar Date, pero viendo el JSON parece un string
    }
    const [episodeData, setEpisodeData] = useState<EpisodioInfo>({
        nombre_ep: '',
        id_podcast: 0,
        nombre_podcast: '',
        link_imagen: '',
        descripcion: '',
        fecha_pub: '',
    });
    const rotation = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [myRating, setMyRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [myProvRating, setMyProvRating] = useState(0);

    useEffect(() => {
        const loadEpisode = async () => {
            if (!id_episode) return;
            setLoading(true);
            try {
                const username = await getData('username');
                const episodeId = Array.isArray(id_episode) ? id_episode[0] : id_episode;
                const url = `https://spongefy-back-end.onrender.com/get-episode?id_ep=${episodeId}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    console.log('Podcast data:', data);
                    setEpisodeData(data);
                } else {
                    console.error('API error', data);
                }
            } catch (err) {
                console.error('Failed to load playlist:', err);
            } finally {
                setLoading(false);
            }
        };
        loadEpisode();
        const getRating = async () => {
                    try {
                        const response = await fetch(`https://spongefy-back-end.onrender.com/get-average-rate?id_cm=${id_episode}`);
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
                        const response = await fetch(`https://spongefy-back-end.onrender.com/get-rate?id_cm=${id_episode}&nombre_usuario=${username}`);
                        const data = await response.json();
                        
                        console.log("📥 Respuesta de la API:", data);
                        
                        console.log("⭐️ Valoración mia:", data.valoracion);
                        setMyRating(data.valoracion);
                        setMyProvRating(data.valoracion);
                        return data;
                    }
                    catch (error) {
                        console.error("❌ Error en fetchSongById:", error);
                        return null;
                    }
                }
                getMyRating();
                getRating();
    }, [id_episode]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#9400D3" />
            </View>
        );
    }
    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
    });
    const togglePlayPause = () => {
        fetchAndPlayEp(id_episode as string);
        setIsPlaying(!isPlaying);
        Animated.timing(rotation, {
                    toValue: isPlaying ? 0 : 1,
                    duration: 100,
                    useNativeDriver: true,
        }).start();
    };
    const handleMyValoration = async () => {
            console.log("Valorar Canción");
            //borrar rating anterior
            const deleteRating = async () => {
                try {
                    const username = await getData("username");
                    const bodyData = {
                        "id_cm": id_episode,
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
                        "id_cm": id_episode,
                        "nombre_usuario": username,
                        "valoracion": myProvRating
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
            setMyRating(myProvRating);
            setShowOptions(false);
        }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                <View style={[styles.coverBox, { backgroundColor: "#420D09" }]}>
                    <Image
                        source={{ uri: episodeData.link_imagen }}
                        style={{ width: 200, height: 200, borderRadius: 8, marginTop: 20 }}
                        resizeMode="cover"
                    />
                    <Text style={styles.coverText}>{episodeData.nombre_ep} | {episodeData.nombre_podcast}</Text>
                    <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                        <Animated.Image
                            source={isPlaying ? require("../../../assets/pause.png") : require("../../../assets/play.png")}
                            style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
                            fadeDuration={2}
                        />
                    </TouchableOpacity>
                </View>
                
            </View>

           
            <View style={styles.valorationsContainer}>
                <View style={styles.myRatingContainer}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Mi valoración:</Text>
                    <View style={styles.starsContainer}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <Ionicons
                            key={i}
                            name={i < myRating ? 'star' : 'star-outline'} // Llena si i < rating, vacía si no
                            size={20}
                            color="#fff"
                            />
                        ))}
                    </View>
                    <TouchableOpacity onPress={() => setShowOptions(true)}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Editar valoración</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Valoración media:</Text>
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
                </View>
            </View>
            {showOptions && (
                <View style={styles.optionsOverlay}>
                    <View style={styles.optionsMenu}>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginBottom: 10 }}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <TouchableOpacity key={i} onPress={() => setMyProvRating(i + 1)}>
                                <Ionicons
                                    name={i < myProvRating ? 'star' : 'star-outline'}
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
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{episodeData.descripcion}</Text>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 16 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    backButton: { marginBottom: 16 },

    coverContainer: { alignItems: 'center', marginBottom: 16 },
    coverBox: { width: 350, height: 400, justifyContent: 'flex-start',alignItems: 'center', borderRadius: 8},
    coverText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    metaText: { color: '#bbb', fontSize: 14, marginTop: 8 },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 20, paddingHorizontal: 12, height: 40, marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 8, color: '#fff' },

    valorationsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
    controlButton: { marginHorizontal: 8 },
    icon: {
    width: 50,
    height: 50,
    tintColor: "white",
    marginTop: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    myRatingContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        borderRadius: 8,
        padding: 10,
        width: 200,
    },
    ratingContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        borderRadius: 8,
        padding: 10,
        width: 200,
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
    descriptionContainer: {
        backgroundColor: '#111',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    descriptionText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 20,
    },
    songList: { flex: 1 },
    songItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    songImage: { width: 50, height: 50, borderRadius: 5, marginRight: 12 },
    songText: { flex: 1 },
    songTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    songArtist: { color: '#bbb', fontSize: 14 }
});