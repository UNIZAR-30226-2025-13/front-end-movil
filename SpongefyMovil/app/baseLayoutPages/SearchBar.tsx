// --- SearchBar.tsx ---
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    onSearch: () => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch }: Props) {
    return (
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#fff" style={styles.iconLeft} />
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={onSearch}
                returnKeyType="search"
                blurOnSubmit={true}
                autoCorrect={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
    iconLeft: { marginRight: 8 },
    searchInput: { flex: 1, color: '#fff', fontSize: 16 },
});