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
    const { id_podcast } = useLocalSearchParams<{ id_podcast: string | string[] }>();
    const { fetchAndPlaySong } = usePlayer();

    interface PodcastResponse {
        podcast: {
        nombre_podcast: string;
        descripcion: string; 
        link_imagen: string;
        };
        episodios: Array<{
            id_ep: number;
            nombre_ep: string;
            duracion: string;
            descripcion: string;
            valoracion_del_usuario: number;
            valoracion_media: number;
        }>;
        creadores: string[];
    }
    
    const [podcastData, setPodcastData] = useState<PodcastResponse>({
    podcast: {
        nombre_podcast: '',
        descripcion: '',
        link_imagen: '',
    },
    episodios: [],
    creadores: [],
    });

    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadPodcast = async () => {
            if (!id_podcast) return;
            setLoading(true);
            try {
                const username = await getData('username');
                const podcastId = Array.isArray(id_podcast) ? id_podcast[0] : id_podcast;
                const url = `https://spongefy-back-end.onrender.com/get-podcast?id_podcast=${podcastId}&nombre_usuario=${username}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    console.log('Podcast data:', data);
                    setPodcastData(data);
                } else {
                    console.error('API error', data);
                }
            } catch (err) {
                console.error('Failed to load podcast:', err);
            } finally {
                setLoading(false);
            }
        };
    loadPodcast()
    }, [id_podcast]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#9400D3" />
            </View>
        );
    }

    const descripcionCortada = (texto: string, maxLength: number) => {
        if (texto.length <= maxLength) return texto;
        return texto.slice(0, maxLength) + '...';
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                <View style={[styles.coverBox, { backgroundColor: "#420D09" }]}>
                    <Image
                        source={{ uri: podcastData.podcast.link_imagen }}
                        style={{ width: 300, height: 300, borderRadius: 8 }}
                        resizeMode="cover"
                    />
                    <Text style={styles.coverText}>{podcastData.podcast.nombre_podcast}</Text>
                    <Text style={styles.metaText}>Creadores: {podcastData.creadores.join(', ')}</Text>
                </View>
                
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar podcast..."
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)} style={styles.controlButton}>
                    <Ionicons
                        name={isPlaying ? 'pause-circle' : 'play-circle'}
                        size={48}
                        color="#9400D3"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Shuffle')} style={styles.controlButton}>
                    <Ionicons name="shuffle" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('../AddMusicToPlaylist')} style={styles.controlButton}>
                    <Ionicons name="add-circle" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Options')} style={styles.controlButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.songList}>
                {podcastData.episodios.map((ep) => (
                    <TouchableOpacity
                        key={ep.id_ep}
                        style={styles.songItem}
                        onPress={()=> {console.log('Episodio: ', ep.nombre_ep)}}
                    >
                        <Image
                            source={{ uri: podcastData.podcast.link_imagen }}
                            style={styles.songImage}
                        />
                        <View style={styles.songText}>
                            <Text style={styles.songTitle}>{ep.nombre_ep}</Text>
                            <Text style={styles.songArtist}>{descripcionCortada(ep.descripcion, 200)}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 16 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    backButton: { marginBottom: 16 },

    coverContainer: { alignItems: 'center', marginBottom: 16 },
    coverBox: { width: 380, height: 450, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    coverText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    metaText: { color: '#bbb', fontSize: 14, marginTop: 8 },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 20, paddingHorizontal: 12, height: 40, marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 8, color: '#fff' },

    controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
    controlButton: { marginHorizontal: 8 },

    songList: { flex: 1 },
    songItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    songImage: { width: 50, height: 50, borderRadius: 5, marginRight: 12 },
    songText: { flex: 1 },
    songTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    songArtist: { color: '#bbb', fontSize: 14 }
});