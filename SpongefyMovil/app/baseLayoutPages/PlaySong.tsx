import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SongDetail = () => {
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);
    // Pour l'exemple, une progression statique (50 %)
    const [progress] = useState(0.5);

    const song = {
        coverTitle: 'ciudad',
        title: 'capaz (merengueton)',
        artists: 'Alleh, Yorhgaki',
        playCount: '95.138.294',
        rating: 5,
        duration: '3:59',
        releaseDate: '21 de marzo de 2025',
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // Ici, vous ajouterez la logique de lecture réelle
    };

    // Composant pour afficher la barre de progression
    const ProgressBar = ({ progress }) => {
        return (
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                <View style={[styles.progressDot, { left: `${progress * 100}%` }]} />
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coverContainer}>
                <View style={styles.bigCover}>
                    <Text style={styles.coverText}>{song.coverTitle}</Text>
                </View>
                <View style={styles.titleRow}>
                    <Text style={styles.songTitle}>{song.title}</Text>
                    <TouchableOpacity style={styles.moreOptions} onPress={() => router.push('./SongDetail')}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.artistNameLeft}>{song.artists}</Text>
            </View>

            <View style={styles.playbackInfo}>
                <ProgressBar progress={progress} />
            </View>

            <View style={styles.playerControls}>
                <TouchableOpacity style={styles.controlButton} onPress={() => console.log("Shuffle")}>
                    <Image source={require('../../assets/aleatorio.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => console.log("Previous")}>
                    <Ionicons name="play-skip-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
                    <Image source={require('../../assets/play.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => console.log("Next")}>
                    <Image source={require('../../assets/adelante.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => console.log("Bucle")}>
                    <Image source={require('../../assets/bucle.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.lyricsRow}>
                <TouchableOpacity style={styles.controlButton} onPress={() => console.log("Add to playlist")}>
                    <Image source={require('../../assets/anyadirplaylist.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <Text style={styles.lyricsButtonText}>Letra</Text>
                <TouchableOpacity style={styles.controlButton} onPress={() => console.log("Add to playlist")}>
                    <Image source={require('../../assets/heart.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
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
        </ScrollView>
    );
};

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
        borderRadius: 8,
    },
    coverText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    songTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    moreOptions: {
        marginTop: 5,
    },
    songArtist: {
        color: '#bbb',
        fontSize: 16,
        marginTop: 2,
    },
    playbackInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    artistNameLeft: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#555',
        borderRadius: 2,
        flex: 1,
        marginLeft: 10,
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
        position: 'absolute',
        top: -4,
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
    playerControls: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    controlButton: {
        marginHorizontal: 10,
    },
    playPauseButton: {
        backgroundColor: '#9400D3',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lyricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#9400D3',
        borderRadius: 20,
        paddingVertical: 10,
        width: '95%',
        alignSelf: 'center',
    },
    lyricsButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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

export default SongDetail;
