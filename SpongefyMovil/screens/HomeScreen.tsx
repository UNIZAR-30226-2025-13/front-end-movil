import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const songs = [
    { id: "1", title: "Song 1" },
    { id: "2", title: "Song 2" },
    { id: "3", title: "Song 3" },
    { id: "4", title: "Song 4" },
    { id: "5", title: "Song 5" },
];

const HomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎵 Spongefy - Home</Text>
            <FlatList
                data={songs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.songItem}>
                        <Text style={styles.songText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    songItem: {
        padding: 15,
        backgroundColor: "#282828",
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    songText: {
        color: "#fff",
        fontSize: 18,
    },
});

export default HomeScreen;
