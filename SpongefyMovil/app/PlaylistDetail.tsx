import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PlaylistDetailScreen() {
    const router = useRouter();

    // Liste de chansons statiques
    const songs = [
        { id: 1, title: 'A quién le importa', artist: 'Alaska y Dinarama', cover: require('../assets/exemple_song_1.png') },
        { id: 2, title: 'Ave María', artist: 'David Bisbal', cover: require('../assets/exemple_song_1.png') },
        { id: 3, title: 'Chiquilla', artist: 'Seguridad Social', cover: require('../assets/exemple_song_1.png') },
        { id: 4, title: 'Zapatillas', artist: 'El Canto Del Loco', cover: require('../assets/exemple_song_1.png') },
        { id: 5, title: 'Devuélveme a mi chica', artist: 'Hombres G', cover: require('../assets/exemple_song_1.png') },
    ];

    const handleShuffle = () => {
        console.log("Bouton shuffle cliqué");
    };

    const handleAddMusic = () => {
        // Navigue vers l'écran d'ajout de musiques
        router.push('/AddMusicToPlaylist');
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
                <View style={styles.bigCover}>
                    <Text style={styles.bigCoverText}>a la ducha</Text>
                </View>
                <Text style={styles.playlistInfo}>Pública | 5 canciones | 15 mins 18 s</Text>
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
                {songs.map((song) => (
                    <TouchableOpacity
                        key={song.id}
                        style={styles.songRow}
                        onPress={() => router.push('/SongDetail')} // <-- Navigation
                    >
                        <Image source={song.cover} style={styles.artistAvatar} />
                        <View style={styles.songInfo}>
                            <Text style={styles.songTitle}>{song.title}</Text>
                            <Text style={styles.songArtist}>{song.artist}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Barre de navigation inférieure */}
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
                    onPress={() => router.push('/Biblioteca')}
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
