import React, { useState, useEffect } from 'react';
import {View,
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
    const [playlists, setPlaylists] = useState([]);
    const username = getData("username");

      const handlePressDebug = async () => {
        console.log("Debug Pressed");
        const username = await getData("username");
        console.log(username);  // Debería mostrar "javi"
      };

    useEffect(() => {
        fetchAndSavePlaylists(username);
        const storedPlaylists = getData("playlists");
        console.log("Playlists almacenadas:", storedPlaylists);
        //setPlaylists(storedPlaylists || []);
      }, []);
    

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
                    <ScrollView>
                    </ScrollView>
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
                            </View>
                        ))}
                    </ScrollView>
                );

            case 'Podcastas':
                return <Text style={styles.sectionText}>Aquí van tus episodios favoritos...</Text>;

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
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="library" size={24} color="#fff" />
                <Text style={styles.title}>Tu biblioteca</Text>
                <TouchableOpacity style={styles.button} onPress={handlePressDebug}>
                              <Text style={styles.playlistText}>DEBUG</Text>
                </TouchableOpacity>
            </View>

            <SearchBar />



            <ScrollView
                horizontal
                style={styles.tabsContainer}
                showsHorizontalScrollIndicator={false}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.tabSelected
                        ]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab && styles.tabTextSelected
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        borderColor: '#9400D3',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
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
    },
    // Onglets
    tabsContainer: {
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    tab: {
        backgroundColor: '#333',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    tabSelected: {
        backgroundColor: '#fff',
    },
    tabText: {
        color: '#fff',
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
    button: {
        backgroundColor: "#9400D3",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
      },
});
