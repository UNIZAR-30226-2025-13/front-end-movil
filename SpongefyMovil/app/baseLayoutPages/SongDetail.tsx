import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SongDetail() {
    const router = useRouter();

    const song = {
        coverTitle: 'la ciudad',
        title: 'capaz (merengueton)',
        artists: 'Alleh, Yorhgaki',
        playCount: '95.138.294',
        rating: 5,
        duration: '3:59',
        releaseDate: '21 de marzo de 2025',
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                <View style={styles.bigCover}>
                    <Text style={styles.coverText}>{song.coverTitle}</Text>
                </View>
                <Text style={styles.songTitle}>{song.title}</Text>
                <Text style={styles.songArtist}>{song.artists}</Text>
                <TouchableOpacity style={styles.moreOptions}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.playCount}>{song.playCount}</Text>

                <View style={styles.starsContainer}>
                    {Array.from({ length: song.rating }, (_, i) => (
                        <Ionicons key={i} name="star" size={20} color="#fff" />
                    ))}
                </View>

                <Text style={styles.infoText}>Duración: {song.duration}</Text>
                <Text style={styles.infoText}>fecha de publicación: {song.releaseDate}</Text>
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('./home')}>
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('./Biblioteca')}>
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomBarItem} onPress={() => router.push('./perfil')}>
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
        marginTop: 5,
    },
    infoContainer: {
        marginTop: 20,
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
});
