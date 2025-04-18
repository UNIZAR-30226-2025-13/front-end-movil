// app/FriendsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getData } from '../../utils/storage';
import { fetchAndSaveFriendsList } from '@/utils/fetch';

export default function FriendsScreen() {
    const router = useRouter();
    const [friends, setFriends] = useState<string[]>([]);

    useEffect(() => {
        const loadFriends = async () => {
            const username = await getData('username');
            if (!username) return;

            await fetchAndSaveFriendsList(username);

            const stored = await getData('friendsList');

            if (Array.isArray(stored)) {
                setFriends(stored);
            }
            else if (stored && Array.isArray((stored as any).amigos)) {
                setFriends((stored as any).amigos);
            }
        };
        loadFriends();
    }, []);

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.row}>
            <Text style={styles.username}>{item}</Text>
            <TouchableOpacity style={styles.chatButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Flèche de retour */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Tus amigos</Text>

            <FlatList
                data={friends}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 30,
        zIndex: 10,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 20,
    },
    list: {
        paddingBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#222',
    },
    username: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    chatButton: {
        backgroundColor: '#9400D3',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
