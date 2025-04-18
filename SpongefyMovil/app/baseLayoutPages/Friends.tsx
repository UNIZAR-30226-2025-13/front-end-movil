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

export default function FriendsScreen() {
    const router = useRouter();

    const [friends, setFriends] = useState<string[]>([
        'jorgehache',
        'marioclavero',
        'marta_zgz',
    ]);

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.row}>
            <Text style={styles.username}>{item}</Text>
            <TouchableOpacity style={styles.chatButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Tus amigos</Text>
            <FlatList
                data={friends}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
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
    title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginLeft: 8, marginTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
});
