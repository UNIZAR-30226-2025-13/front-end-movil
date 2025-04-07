import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { saveData, getData, removeData } from "../../utils/storage" ;
import { fetchAndSaveLibrary, fetchAndSaveSearchLista } from "../../utils/fetch";

const screenWidth = Dimensions.get('window').width;

interface BibliotecaCarpeta {
    id_carpeta: number;
    nombre: string;
}
interface BibliotecaArtistaFavorito {
    nombre_artista: string;
    link_imagen: string;
}
interface BibliotecaPodcastFavorito {
    nombre_podcaster: string;
    link_imagen: string;
}

interface MusicaListaGenero {
    id_lista: number;
    nombre: string;
    color: string;
}

interface MusicaListaIdioma {
    id_lista: number;
    nombre: string;
    color: string;
}

interface MusicaListaArtistas {
    id_lista: number;
    nombre: string;
    nombre_creador: string;
    link_imagen: string;
}

interface MusicaListaAleatorio {
    id_lista: number;
    nombre: string;
    color: string;
}

interface Lista {
    id_lista: number;
    nombre: string;
    color: string;
    link_compartir: string;
    similitud: number;
    tipo: string;
}
interface MusicaListaArtistas {
    id_lista: number;
    nombre: string;
    nombre_creador: string;
    link_imagen: string;
}

interface CreadorSearch {
    nombre_creador: string;
    link_imagen: string;
    similitud: number;
    tipo: string;
}

interface AlbumSearch {
    id_album: number;
    nombre_album: string;
    link_imagen: string;
    artista: string;
    similitud: number;
}

interface Podcast {
    id_podcast: number;
    nombre: string;
    link_imagen: string;
    similitud: number;
}

interface SearchResults {
    listas: Lista[];
    creadores: CreadorSearch[];
    podcasts: Podcast[];
}

export default function BibliotecaScreen() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('Listas');
    const [showOptions, setShowOptions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const tabs = ['Listas', 'Podcasts', 'Artistas'];

    const [listas, setListas] = useState<Lista[]>([]);
    const [carpetas, setCarpetas] = useState<BibliotecaCarpeta[]>([]);
    const [artistasFavoritos, setArtistasFavoritos] = useState<BibliotecaArtistaFavorito[]>([]);
    const [podcastsFavoritos, setPodcastsFavoritos] = useState<BibliotecaPodcastFavorito[]>([]);

    useEffect(() => {
        const loadLibrary = async () => {
            const username = await getData("username");
            console.log(username);
            if (username) {
                await fetchAndSaveLibrary(username);
                const datosBiblioteca = await getData("library");
                if (datosBiblioteca) {
                    setListas(datosBiblioteca.listas || []);
                    setCarpetas(datosBiblioteca.carpetas || []);
                    setArtistasFavoritos(datosBiblioteca.artistas_favoritos || []);
                    setPodcastsFavoritos(datosBiblioteca.podcasts_favoritos || []);
                }
            }
        };

        loadLibrary();
    }, []);

    const handleAddPlaylist = async () => {
        console.log("Boton añadir playlist pulsado");
        router.push('/baseLayoutPages/CrearPlaylist');
    };
    const handleAddFolder = async () => {
        console.log("Boton añadir carpeta pulsado");
        router.push('/baseLayoutPages/CrearCarpeta');
    };
    const handleGoToArtista = (nombre_artista: string) => {
        console.log("Boton Artista pulsado para:", nombre_artista);
        router.push({ pathname: '/baseLayoutPages/artista/[nombre_artista]', params: { nombre_artista } });
    };

    const handleGoToPlaylist = (id_lista: number) => {
        console.log("Boton Playlist pulsado para:", id_lista);
        router.push(`/playlist/${id_lista}`);
    };

    const handleGoToFolder = async (id_folder: number) => {
        await saveData("id_folder", id_folder);
        console.log("Carpeta seleccionada con id:", id_folder);
        router.push('/baseLayoutPages/CarpetaScreen');
    };

    const handleSearch = async () => {


        if (searchQuery.trim() === '') {
            setSearchResults(null);
            return;
        }


        switch (selectedTab) {
            case 'Listas':
                await fetchAndSaveSearchLista(searchQuery);
                const searchGlobalData = await getData("searchGlobal");

                if (searchGlobalData) {
                    setSearchResults({
                        listas: searchGlobalData.listas || [],
                        creadores: [],
                        podcasts: [],
                    });
                }
                break;

            default:
                return;
        }

    };

    const SearchBar = () => {
        return (
            <View style={styles.searchContainer}>
                {/* Icono de búsqueda a la izquierda */}
                <Ionicons name="search" size={20} color="#fff" style={styles.iconLeft} />

                {/* Input de búsqueda */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch} // Ejecuta al presionar Enter
                    returnKeyType="search" // Hace que el botón de teclado muestre "Buscar"
                />

                {/*    
                    <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                        <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
                    </TouchableOpacity> */}

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
                            {/* <TouchableOpacity style={styles.favItem} onPress={() => router.push('./PlaylistDetail')}>
                                <Text style={styles.favItemText}>Tus canciones favoritas</Text>
                                <Ionicons name="heart" size={16} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.favItem} onPress={() => router.push('./PlaylistDetail')}>
                                <Text style={styles.favItemText}>Tus episodios favoritos</Text>
                                <Ionicons name="heart" size={16} color="#fff" />
                            </TouchableOpacity> */}


                            <ScrollView style={styles.scrollView}>
                                {Array.isArray(listas) ? listas.map((lista, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.playlistItem}
                                        onPress={() => handleGoToPlaylist(lista.id_lista)}
                                    >
                                        <Text style={styles.playlistText}>{lista.nombre}</Text>
                                        <Text style={styles.playlistText}>{lista.id_lista}</Text>
                                    </TouchableOpacity>
                                )) : <Text style={styles.playlistText}>No tienes listas</Text>}
                            </ScrollView>


                            {Array.isArray(carpetas) ? carpetas.map((carpeta, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.folderItem}
                                    onPress={() => handleGoToFolder(carpeta.id_carpeta)}
                                >
                                    <Text style={styles.playlistText}>{carpeta.nombre}</Text>
                                    <Ionicons name="folder" size={20} color="#fff" style={styles.folderIcon} />
                                </TouchableOpacity>
                            )) : <Text style={styles.playlistText}>No tienes carpetas</Text>}

                            {/* Playlists statiques
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
                            </TouchableOpacity> */}
                        </ScrollView>
                        <TouchableOpacity style={styles.addButton} onPress={() => setShowOptions(!showOptions)}>
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>

                        {showOptions && (
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity style={styles.optionButton} onPress={handleAddPlaylist}>
                                    <Text style={styles.optionText}>Nueva Playlist</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionButton} onPress={handleAddFolder}>
                                    <Text style={styles.optionText}>Nueva Carpeta</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>
                );
            case 'Podcasts':
                return (
                    <ScrollView style={styles.artistasContainer}>
                        {Array.isArray(podcastsFavoritos) ? podcastsFavoritos.map((podcast, index) => (
                            <TouchableOpacity key={index} style={styles.podcastItem}>
                                <Image source={{ uri: podcast.link_imagen }} style={styles.podcastImage} />
                                <Text style={styles.podcastText}>{podcast.nombre_podcaster}</Text>
                            </TouchableOpacity>
                        )) : <Text style={styles.playlistText}>No hay podcasts favoritos</Text>}
                    </ScrollView>
                );
            case 'Artistas':
                return (
                    <ScrollView style={styles.artistasContainer}>
                        {Array.isArray(artistasFavoritos) ? artistasFavoritos.map((artista, index) => (
                            <TouchableOpacity key={index} style={styles.podcastItem} onPress={() => handleGoToArtista(artista.nombre_artista)}>
                                <Image source={{ uri: artista.link_imagen }} style={styles.podcastImage} />
                                <Text style={styles.podcastText}>{artista.nombre_artista}</Text>
                            </TouchableOpacity>
                        )) : <Text style={styles.playlistText}>No hay artistas favoritos</Text>}
                    </ScrollView>
                );
            default:
                return <Text style={styles.sectionText}>Selecciona una sección</Text>;
        }
    };

    const handleBiblioteca = () => {
        router.push('/baseLayoutPages/Biblioteca');
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
    folderItem: {
        backgroundColor: "#222",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: "row",  // Organiza los elementos en fila
        justifyContent: "space-between", // Separa el texto y el icono
        alignItems: "center", // Centra verticalmente los elementos 
    },
    folderIcon: {
        marginLeft: 10,
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
    podcastItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    podcastImage: {
        width: 80,
        height: 80,
        borderRadius: 25,
        marginRight: 15,
    },
    podcastText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 10,
    },

    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },

    optionText: {
        color: 'white',
        fontSize: 16,
    },
    itemContainer: { marginRight: 10, alignItems: 'center' },
    itemImage: { width: 80, height: 80, borderRadius: 10 },
    itemText: { color: '#fff', fontSize: 11, marginTop: 8, textAlign: 'center', width: 80 },
});
