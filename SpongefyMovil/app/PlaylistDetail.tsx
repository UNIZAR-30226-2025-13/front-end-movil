import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PlaylistDetailScreen() {
    const router = useRouter();

    const handleBiblioteca = () => {
        router.push('/Biblioteca');
    };

    // Liste de chansons statiques (même contenu)
    const songs = [
        { id: 1, title: 'A quién le importa', artist: 'Alaska y Dinarama', cover: require('../assets/exemple_song_1.png') },
        { id: 2, title: 'Ave María', artist: 'David Bisbal', cover: require('../assets/exemple_song_1.png') },
        { id: 3, title: 'Chiquilla', artist: 'Seguridad Social', cover: require('../assets/exemple_song_1.png') },
        { id: 4, title: 'Zapatillas', artist: 'El Canto Del Loco', cover: require('../assets/exemple_song_1.png') },
        { id: 5, title: 'Devuélveme a mi chica', artist: 'Hombres G', cover: require('../assets/exemple_song_1.png') },
    ];

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                <View style={styles.bigCover}>
                    <Text style={styles.bigCoverText}>a la ducha</Text>
                </View>
                <Text style={styles.playlistInfo}>Pública | 5 canciones | 15 mins 18 s</Text>
            </View>

            <ScrollView style={styles.songsContainer}>
                {songs.map((song) => (
                    <View key={song.id} style={styles.songRow}>
                        <Image
                            source={require('../assets/exemple_song_1.png')}
                            style={styles.artistAvatar}
                        />
                        <View style={styles.songInfo}>
                            <Text style={styles.songTitle}>{song.title}</Text>
                            <Text style={styles.songArtist}>{song.artist}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('/home')}
                >
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={handleBiblioteca}
                >
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('/perfil')}
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
        backgroundColor: '#2F4F4F', // ou un image
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
    songsContainer: {
        flex: 1,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    songCover: {
        width: 50,
        height: 50,
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
    artistAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        resizeMode: 'cover',
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
});
