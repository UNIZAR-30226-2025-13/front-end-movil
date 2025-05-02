import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
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
    const { fetchAndPlaySong } = usePlayer();

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

    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadEpisode = async () => {
            if (!id_episode) return;
            setLoading(true);
            try {
                const username = await getData('username');
                const episodeId = Array.isArray(id_episode) ? id_episode[0] : id_episode;
                const url = `https://spongefy-back-end.onrender.com/get-episode?id_episode=${episodeId}`;
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
    }, [id_episode]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#9400D3" />
            </View>
        );
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
                                    style={{ width: 300, height: 300, borderRadius: 8 }}
                                    resizeMode="cover"
                                />
                                <Text style={styles.coverText}>{episodeData.nombre_ep} | {episodeData.nombre_podcast}</Text>
                                <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)} style={styles.controlButton}>
                                    <Ionicons
                                        name={isPlaying ? 'pause-circle' : 'play-circle'}
                                        size={48}
                                        color="#9400D3"
                                    />
                                </TouchableOpacity>
                            </View>
                            
                        </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar canción..."
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.valorationsContainer}>
                
            </View>

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 16 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    backButton: { marginBottom: 16 },

    coverContainer: { alignItems: 'center', marginBottom: 16 },
    coverBox: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    coverText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    metaText: { color: '#bbb', fontSize: 14, marginTop: 8 },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 20, paddingHorizontal: 12, height: 40, marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 8, color: '#fff' },

    valorationsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
    controlButton: { marginHorizontal: 8 },

    songList: { flex: 1 },
    songItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    songImage: { width: 50, height: 50, borderRadius: 5, marginRight: 12 },
    songText: { flex: 1 },
    songTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    songArtist: { color: '#bbb', fontSize: 14 }
});