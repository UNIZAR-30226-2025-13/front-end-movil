import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getData } from '../../../utils/storage';
import { usePlayer } from '../PlayerContext';
import { changeListPrivacy, deletePlaylist } from '../../../utils/fetch';


import { Picker } from '@react-native-picker/picker';



export default function PlaylistDetailScreen() {
    const router = useRouter();
    const { id_playlist } = useLocalSearchParams<{ id_playlist: string | string[] }>();
    const { fetchAndPlaySong } = usePlayer();
    const [showOptions, setShowOptions] = useState(false);

    const [sortKey, setSortKey] = useState<'fecha_pub' | 'titulo' | 'nombre_creador' | 'duracion' | 'valoracion_media'>('fecha_pub');
    const [ascending, setAscending] = useState(true);
    const [sortedSongs, setSortedSongs] = useState<typeof playlistData.contenido>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');



    interface Song {
        id_cm: number;
        titulo: string;
        link_imagen: string;
        duracion: string;
        fecha_pub: string;
        nombre_creador: string;
        artistas_feat: string;
        valoracion_media: number;
    }
    const [playlistData, setPlaylistData] = useState<{
        nombre: string;
        color: string;
        es_playlist: boolean;
        es_publica: boolean;
        nombre_usuario: string;
        contenido: Song[];
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


    const getMyRating = async (id_cm: number) => {
        try {
            const username = await getData("username");
            const response = await fetch(`https://spongefy-back-end.onrender.com/get-rate?id_cm=${id_cm}&nombre_usuario=${username}`);
            const data = await response.json();

            console.log("📥 Respuesta de la API:", data);

            console.log("⭐️ Valoración mia:", data.valoracion);
            return data;
        }
        catch (error) {
            console.error("❌ Error en fetchSongById:", error);
            return null;
        }
    }

    const handleTogglePrivacy = async () => {
        try {
            const playlistId = Array.isArray(id_playlist) ? +id_playlist[0] : +id_playlist!;
            const username = playlistData.nombre_usuario;
            const result = await changeListPrivacy(playlistId, username);
            console.log('Privacy changé:', result.message);
            // setPlaylistData(prev => ({
            //     ...prev,
            //     es_publica: !prev.es_publica
            // }));
        } catch (err) {
            console.error('Impossible de changer la confidentialité', err);
        } finally {
            setShowOptions(false);
        }
    };

    useEffect(() => {
        const loadPlaylist = async () => {
            if (!id_playlist) return;
            setLoading(true);
            try {
                const username = await getData('username');
                const playlistId = Array.isArray(id_playlist) ? id_playlist[0] : id_playlist;
                const url = `https://spongefy-back-end.onrender.com/get-list-data?id_lista=${playlistId}&nombre_usuario=${username}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    const baseSongs = data.contenido as Omit<Song, 'valoracion_media'>[];

                    const cancionesConValoraciones: Song[] = await Promise.all(
                        baseSongs.map(async song => {
                            try {
                                // const rateRes = await fetch(
                                //     `https://spongefy-back-end.onrender.com/get-rate?id_cm=${song.id_cm}&nombre_usuario=${username}`
                                // );
                                // const rateJson = await rateRes.json();
                                // return {
                                //     ...song,
                                //     valoracion_media: rateJson.valoracion_media ?? 0
                                // };
                                var valoracion = await getMyRating(song.id_cm);
                                return {
                                    ...song,
                                    valoracion_media: valoracion.valoracion
                                };
                            } catch {
                                return { ...song, valoracion_media: 0 };
                            }
                        })
                    );

                    setPlaylistData({
                        nombre: data.nombre,
                        color: data.color,
                        es_playlist: data.es_playlist,
                        es_publica: data.es_publica,
                        nombre_usuario: data.nombre_usuario,
                        contenido: cancionesConValoraciones
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
    }, [id_playlist]);

    useEffect(() => {
        const songs = [...playlistData.contenido];
        switch (sortKey) {
            case 'fecha_pub':
                songs.sort((a, b) => {
                    return new Date(a.fecha_pub).getTime() - new Date(b.fecha_pub).getTime();
                });
                break;
            case 'titulo':
                songs.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'nombre_creador':
                songs.sort((a, b) => a.nombre_creador.localeCompare(b.nombre_creador));
                break;
            case 'duracion':
                songs.sort((a, b) => convertToSeconds(a.duracion) - convertToSeconds(b.duracion));
                break;
            case 'valoracion_media':
                songs.sort((a, b) => a.valoracion_media - b.valoracion_media);
                break;
        }
        if (!ascending) songs.reverse();
        setSortedSongs(songs);
    }, [playlistData.contenido, sortKey, ascending]);

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

    const handleDelete = async () => {
        try {
            const { message } = await deletePlaylist(id_playlist);
            router.push('../Biblioteca');
        } catch (err) {
            Alert.alert("No se ha podido eliminar la lista");
        }
    };

    const displayedSongs = sortedSongs.filter(song =>
        song.titulo
            .toLowerCase()
            .startsWith(searchTerm.trim().toLowerCase())
    );
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
                    {playlistData.es_publica ? 'Pública' : 'Privada'} | {playlistData.contenido.length} canciones | {formatTime(totalSeconds)}
                </Text>
            </View>





            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar canción..."
                    placeholderTextColor="#888"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    onPress={() => {
                        const newPlaying = !isPlaying;
                        setIsPlaying(newPlaying);
                        if (newPlaying && sortedSongs.length > 0) {
                            fetchAndPlaySong(sortedSongs[0].id_cm.toString());
                        }
                    }}
                    style={styles.controlButton}
                >
                    <Ionicons
                        name={isPlaying ? 'pause-circle' : 'play-circle'}
                        size={48}
                        color="#9400D3"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Shuffle')} style={styles.controlButton}>
                    <Ionicons name="shuffle" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.controlButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <View>
                <View style={styles.sortContainer}>
                    <Picker
                        selectedValue={sortKey}
                        onValueChange={(v: any) => {
                            setSortKey(v as any);
                            setAscending(true);
                        }}
                        style={styles.optionsMenu}
                    >
                        <Picker.Item label="Fecha de publicacion" value="fecha_pub" style={styles.optionText} />
                        <Picker.Item label="Titulo" value="titulo" style={styles.optionText} />
                        <Picker.Item label="Artista" value="nombre_creador" style={styles.optionText} />
                        <Picker.Item label="Duracion" value="duracion" style={styles.optionText} />
                        <Picker.Item label="Mi Valoracion" value="valoracion_media" style={styles.optionText} />
                    </Picker>
                    <TouchableOpacity onPress={() => setAscending(!ascending)} style={styles.orderButton}>
                        <Ionicons name={ascending ? 'arrow-down' : 'arrow-up'} size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.songList}>
                {displayedSongs.map((song) => (<TouchableOpacity
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

            {/* <ScrollView style={styles.songList}>
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
            </ScrollView> */}
            {showOptions && (
                <View style={styles.optionsOverlay}>
                    <View style={styles.optionsMenu}>
                        <TouchableOpacity onPress={handleDelete}>
                            <Text style={styles.optionText}>
                                Eliminar lista
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleTogglePrivacy}>
                            <Text style={styles.optionText}>
                                {playlistData.es_publica ? 'Cambiar a privada' : 'Cambiar a pública'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowOptions(false)}>
                            <Text style={styles.optionText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    songArtist: { color: '#bbb', fontSize: 14 },
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
        color: '#fff',
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    Picker: {
        flex: 1,
        color: '#fff',
        backgroundColor: '#111',
    },
    orderButton: {
        padding: 8,
        marginLeft: 8,
    },


});