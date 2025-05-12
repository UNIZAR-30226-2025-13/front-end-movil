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
    const { id_album } = useLocalSearchParams<{ id_album: string | string[] }>();
    const { fetchAndPlaySong } = usePlayer();

    const [albumData, setAlbumData] = useState<{
        nombre: string;
        imagen: string;
        fecha_pub: string;
        artista: string;
        canciones: Array<{
            id_cancion: number;
            titulo: string;
            n_repros: number;
            duracion: string;
            fecha_pub: string;
            nombre_artista: string;
            artistas_feat: string;
        }>;
    }>({
        nombre: '',
        imagen: '#2F4F4F',
        fecha_pub: '',
        artista: '',
        canciones: []
    });

    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadPlaylist = async () => {
            if (!id_album) return;
            setLoading(true);
            try {
                const username = await getData('username');
                const albumId = Array.isArray(id_album) ? id_album[0] : id_album;
                const url = `https://spongefy-back-end.onrender.com/album?id_album=${albumId}&nombre_usuario=${username}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    console.log('Album data:', data);
                    setAlbumData({
                        nombre: data.album.nombre,
                        imagen: data.album.link_imagen,
                        fecha_pub: data.album.fecha_pub,
                        artista: data.artista,
                        canciones: data.canciones
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
    }, [id_album]);

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
    const totalSeconds = albumData.canciones.reduce(
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
                <Image style={styles.coverBox} source={{ uri: albumData.imagen }}></Image>
                    <Text style={styles.coverText}>{albumData.nombre}</Text>
                
                <Text style={styles.metaText}>
                    {albumData.fecha_pub} | {albumData.canciones.length} canciones | {formatTime(totalSeconds)}
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar canción..."
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
                {albumData.canciones.map((song) => (
                    <TouchableOpacity
                        key={song.id_cancion}
                        style={styles.songItem}
                        onPress={() => fetchAndPlaySong(song.id_cancion.toString())}    
                    >
                        <Image
                            source={{ uri: albumData.imagen }}
                            style={styles.songImage}
                        />
                        <View style={styles.songText}>
                            <Text style={styles.songTitle}>{song.titulo}</Text>
                            <Text style={styles.songArtist}>{song.nombre_artista}{song.artistas_feat ? `, feat: ${song.artistas_feat}` : ''}</Text>
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