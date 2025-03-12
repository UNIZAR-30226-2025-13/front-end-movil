import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { saveData, getData, removeData } from "../utils/storage";
import { fetchAndSavePlaylists } from "../utils/fetch";

const screenWidth = Dimensions.get('window').width;

const artistsData = [
    { id: '1', name: 'Bad Bunny' },
    { id: '2', name: 'Feid' },
    { id: '3', name: 'Cruz Cafuné' },
    { id: '4', name: 'Lola Indigo' },
    { id: '5', name: 'Fernando Costa' },
];

const songsData = [
    { id: '1', name: 'Song 1' },
    { id: '2', name: 'Song 2' },
    { id: '3', name: 'Song 3' },
    { id: '4', name: 'Song 4' },
    { id: '5', name: 'Song 5' },
];

export default function BibliotecaScreen() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('Listas');
    const tabs = ['Listas', 'Podcastas', 'Artistas'];
    const [playlists, setPlaylists] = useState<{ id_lista: number; nombre: string }[]>([]);

    useEffect(() => {
        const loadPlaylists = async () => {
            const username = await getData("username");
            if (username) {
                await fetchAndSavePlaylists(username);
                const playlistsGuardadas = await getData("playlists");
                if (playlistsGuardadas) {
                    setPlaylists(playlistsGuardadas);
                }
            }
        };

        loadPlaylists();
    }, []);

    const handleAddPlaylist = async () => {
        console.log("Boton añadir playlist pulsado");
    };

    const SearchBar = () => {
        const handleMoreOptions = () => {
            console.log("Plus d'options");
        };

        return (
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#fff" style={styles.iconLeft} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={handleMoreOptions}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#fff" style={styles.iconRight} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderSectionContent = () => {
        switch (selectedTab) {
            case 'Listas':
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView style={styles.scrollView}>
                            {/* Favoris */}
                            <TouchableOpacity style={styles.favItem}>
                                <Text style={styles.favItemText}>Tus canciones favoritas</Text>
                                <Ionicons name="heart" size={16} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.favItem}>
                                <Text style={styles.favItemText}>Tus episodios favoritos</Text>
                                <Ionicons name="heart" size={16} color="#fff" />
                            </TouchableOpacity>
                            {/* Playlists statiques */}
                            {playlists.map((playlist, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.playlistItem}
                                    onPress={() => router.push('./PlaylistDetail')}
                                >
                                    <Text style={styles.playlistText}>{playlist.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>discos4ever</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>¿</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>2025</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>Mi playlist nº94329</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>a la ducha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.playlistItem}
                                onPress={() => router.push('./PlaylistDetail')}
                            >
                                <Text style={styles.playlistText}>Camino uni</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddPlaylist}>
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                );
            case 'Podcastas':
                return (
                    <ScrollView style={styles.artistasContainer}>
                        {songsData.map((song) => (
                            <View key={song.id} style={styles.artistRow}>
                                <Image
                                    source={require('../assets/exemple_song_1.png')}
                                    style={styles.artistAvatar}
                                />
                                <Text style={styles.artistName}>{song.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                );
            case 'Artistas':
                return (
                    <ScrollView style={styles.artistasContainer}>
                        {artistsData.map((artist) => (
                            <View key={artist.id} style={styles.artistRow}>
                                <Image
                                    source={require('../assets/image_test_artiste.png')}
                                    style={styles.artistAvatar}
                                />
                                <Text style={styles.artistName}>{artist.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                );
            default:
                return <Text style={styles.sectionText}>Selecciona una sección</Text>;
        }
    };

    const handleBiblioteca = () => {
        router.push('/Biblioteca');
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Ionicons name="library-outline" size={28} color="white" />
                <Text style={styles.title}>Tu biblioteca</Text>
            </View>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.iconLeft} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#888"
                />
            </View>

            {/* Tabs de navegación */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, selectedTab === tab && styles.tabSelected]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && styles.tabTextSelected]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Contenu de la section sélectionnée */}
            <View style={styles.content}>
                {renderSectionContent()}
            </View>

            {/* Barre de navigation inférieure */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('/home')}
                >
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={handleBiblioteca}
                >
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('/perfil')}
                >
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Barre de recherche
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
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    // Tabs de navigation
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    tab: {
        backgroundColor: '#333',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 10,
    },
    tabSelected: {
        backgroundColor: '#fff',
    },
    tabText: {
        color: '#fff',
        fontSize: 14,
    },
    tabTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    // Contenu
    content: {
        flex: 1,
        marginHorizontal: 16,
    },
    sectionText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
    },
    // Liste d'artistes ou chansons
    artistasContainer: {
        marginTop: 10,
    },
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    artistAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        resizeMode: 'cover',
    },
    artistName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Barre de navigation inférieure
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#111',
        paddingVertical: 8,
    },
    bottomBarItem: {
        alignItems: 'center',
    },
    bottomBarText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 2,
    },
    // Styles pour les playlists dans l'onglet "Listas"
    playlistItem: {
        backgroundColor: "#222",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
    },
    playlistText: {
        color: "#fff",
        fontSize: 16,
    },
    favItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9400D3', // Violet
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    favItemText: {
        color: '#fff',
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'purple',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
