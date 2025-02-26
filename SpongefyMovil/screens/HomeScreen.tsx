import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

// Définition du type pour une chanson
interface Song {
    id: string;
    title: string;
    url: string;
}

// Liste des chansons (mockées pour l’instant)
const songs: Song[] = [
    { id: "1", title: "Song 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: "2", title: "Song 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: "3", title: "Song 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

const HomeScreen: React.FC = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // Fonction pour jouer un son
    async function playSound(songUrl: string) {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: songUrl },
            { shouldPlay: true }
        );

        setSound(newSound);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎵 Spongify - Home</Text>
            <FlatList
                data={songs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.songItem} onPress={() => playSound(item.url)}>
                        <Text style={styles.songText}>{item.title}</Text>
