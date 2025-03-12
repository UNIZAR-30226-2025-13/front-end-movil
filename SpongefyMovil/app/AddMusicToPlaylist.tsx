import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const allSongs = [
    { id: 1, title: 'Canción X' },
    { id: 2, title: 'Canción Y' },
    { id: 3, title: 'Canción Z' },
    { id: 4, title: 'Canción W' },
];

export default function AddMusicToPlaylist() {
    const router = useRouter();
    const [selectedSongs, setSelectedSongs] = useState<number[]>([]);

    const toggleSong = (songId: number) => {
        setSelectedSongs((prev) => {
            if (prev.includes(songId)) {
                return prev.filter((id) => id !== songId);
            } else {
                return [...prev, songId];
            }
        });
    };

    const handleConfirm = () => {
        console.log("Musiques sélectionnées :", selectedSongs);
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Añade música a tu lista de reproducción</Text>
            <ScrollView style={styles.scrollContainer}>
                {allSongs.map((song) => {
                    const isSelected = selectedSongs.includes(song.id);
                    return (
                        <TouchableOpacity
                            key={song.id}
                            style={[styles.songRow, isSelected && styles.songRowSelected]}
                            onPress={() => toggleSong(song.id)}
                        >
                            <Text style={styles.songText}>{song.title}</Text>
                            {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
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
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    songRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#222',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    songRowSelected: {
        backgroundColor: '#9400D3',
    },
    songText: {
        color: '#fff',
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: '#9400D3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
