// app/baseLayoutPages/PlaySong/[id_song].tsx
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchAndSaveLyrics } from '../../../utils/fetch';
import { getData } from '../../../utils/storage';

const { width } = Dimensions.get('window');

export default function LyricsScreen() {
    const router = useRouter();
    const { id_song } = useLocalSearchParams<{ id_song: string }>();
    const [lyrics, setLyrics] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadLyrics = async () => {
            if (!id_song) {
                setLyrics('Aucune chanson sélectionnée.');
                setLoading(false);
                return;
            }

            // 1) Appel à l’API et stockage
            await fetchAndSaveLyrics(id_song);

            // 2) Lecture depuis le storage (clé "lyrics")
            const stored: string | null = await getData('lyrics');
            setLyrics(stored ?? 'Paroles introuvables.');
            setLoading(false);
        };

        loadLyrics();
    }, [id_song]);

    return (
        <SafeAreaView style={styles.safe}>
            {/* Bouton retour */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator
                    style={{ flex: 1, justifyContent: 'center' }}
                    size="large"
                    color="#9400D3"
                />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.lyricsContainer}>
                        <Text style={styles.lyricsText}>{lyrics}</Text>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#000',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
    },
    scrollContent: {
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    lyricsContainer: {
        backgroundColor: '#1F3A2F',
        borderRadius: 24,
        padding: 20,
        minHeight: 200,
        width: width - 32,
        alignSelf: 'center',
    },
    lyricsText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24,
    },
});
