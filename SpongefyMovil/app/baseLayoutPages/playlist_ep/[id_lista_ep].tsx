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
    const { id_lista_ep } = useLocalSearchParams<{ id_lista_ep: string | string[] }>();
    const { fetchAndPlaySong } = usePlayer();

    const [playlistData, setPlaylistData] = useState<{
        nombre: string;
        color: string;
        es_playlist: boolean;
        es_publica: boolean;
        nombre_usuario: string;
        contenido: Array<{
            id_cm: number;
            titulo: string;
            link_imagen: string;
            duracion: string;
            fecha_pub: string;
            nombre_creador: string;
            artistas_feat: string;
        }>;
    }>({
        nombre: '',
        color: '#2F4F4F',
        es_playlist: false,
        es_publica: false,
        nombre_usuario: '',
        contenido: []
    });

    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadPlaylist = async () => {
            if (!id_lista_ep) return;
            setLoading(true);
            try {
                const username = await getData('username');
                const playlistId = Array.isArray(id_lista_ep) ? id_lista_ep[0] : id_lista_ep;
                const url = `https://spongefy-back-end.onrender.com/get-list-data?id_lista=${playlistId}&nombre_usuario=${username}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    setPlaylistData({
                        nombre: data.nombre,
                        color: data.color,
                        es_playlist: data.es_playlist,
                        es_publica: data.es_publica,
                        nombre_usuario: data.nombre_usuario,
                        contenido: data.contenido
                    });
                } else {
                    console.error('API error', data);
                }
            } catch (err) {
                console.error('Failed to load playlist:', err);
            } finally {
                setLoading(false);
            }
        };
        loadPlaylist();
    }, [id_lista_ep]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#9400D3" />
            </View>
        );
    }

    // Convert HH:mm:ss to seconds
    const convertToSeconds = (duration: string) => {
        const [h = '0', m = '0', s = '0'] = duration.split(':');
        return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
    };

    // Total duration in seconds
    const totalSeconds = playlistData.contenido.reduce(
        (sum, song) => sum + convertToSeconds(song.duracion),
        0
    );

    // Format seconds to h m s
    const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                <View style={[styles.coverBox, { backgroundColor: playlistData.color }]}>
                    <Text style={styles.coverText}>{playlistData.nombre}</Text>
                </View>
                <Text style={styles.metaText}>
                    {playlistData.es_publica ? 'Pública' : 'Privada'} | {playlistData.contenido.length} podcasts | {formatTime(totalSeconds)}
                </Text>
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
            <Text style={styles.EpText}>Episodios:</Text>
            <View style={styles.separator} />
            <ScrollView style={styles.songList}>
                {playlistData.contenido.map((song) => (
                    <TouchableOpacity
                        key={song.id_cm}
                        style={styles.songItem}
                        onPress={() => fetchAndPlaySong(song.id_cm.toString())}
                    >
                        <Image
                            source={{ uri: song.link_imagen }}
                            style={styles.songImage}
                        />
                        <View style={styles.songText}>
                            <Text style={styles.songTitle}>{song.titulo}</Text>
                            <Text style={styles.songArtist}>{song.nombre_creador}</Text>
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
    coverBox: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    coverText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    metaText: { color: '#bbb', fontSize: 14, marginTop: 8 },

    EpText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 0 },
    separator: {
        height: 1,
        backgroundColor: '#ccc', // puedes cambiar el color
        width: '100%',
        marginVertical: 10,
    },
    controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
    controlButton: { marginHorizontal: 8 },

    songList: { flex: 1 },
    songItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    songImage: { width: 50, height: 50, borderRadius: 5, marginRight: 12 },
    songText: { flex: 1 },
    songTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    songArtist: { color: '#bbb', fontSize: 14 }
});