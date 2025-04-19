import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
    const router = useRouter();
    const { nombre_usuario } = useLocalSearchParams<{ nombre_usuario: string }>();
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{nombre_usuario || 'Amigo'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.messagesContainer}>
                <View style={styles.bubbleLeft}>
                    <View style={styles.card}>
                        <Image
                            source={require('../../assets/exemple_song_1.png')}
                            style={styles.cardImage}
                        />
                        <View style={styles.cardText}>
                            <Text style={styles.songTitle}>Golden (Fine Line)</Text>
                            <Text style={styles.songArtist}>Harry Styles</Text>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Ver canción</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.messageText}>Mira esta canción!</Text>
                </View>

                {/* Message envoyé */}
                <View style={styles.bubbleRight}>
                    <Text style={styles.messageText}>Me encanta!!</Text>
                </View>
            </ScrollView>

            {/* Input */}
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#4B2E83',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    backButton: {
        padding: 4
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 0
    },
    bubbleLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#9400D3',
        borderRadius: 16,
        marginBottom: 12,
        padding: 12,
        maxWidth: width * 0.8
    },
    bubbleRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#9400D3',
        borderRadius: 16,
        marginBottom: 12,
        padding: 12,
        maxWidth: width * 0.6
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#4B2E83',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8
    },
    cardImage: {
        width: 60,
        height: 60
    },
    cardText: {
        padding: 8,
        justifyContent: 'center'
    },
    songTitle: {
        color: '#fff',
        fontWeight: 'bold'
    },
    songArtist: {
        color: '#ddd',
        fontSize: 12,
        marginBottom: 4
    },
    linkText: {
        color: '#fff',
        textDecorationLine: 'underline',
        fontSize: 12
    },
    messageText: {
        color: '#fff',
        fontSize: 16
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        margin: 16,
        borderRadius: 20,
        paddingHorizontal: 12
    },
    input: {
        flex: 1,
        color: '#fff',
        height: 40
    },
    sendButton: {
        padding: 8
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#111',
        paddingVertical: 8
    },
    navItem: {
        alignItems: 'center'
    },
    navText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 2
    },
    navTextActive: {
        color: '#9400D3',
        fontSize: 12,
        marginTop: 2,
        fontWeight: 'bold'
    }
});
