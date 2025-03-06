import React, { useState } from 'react';
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

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
    const [selectedTab, setSelectedTab] = useState('Todo');

    // Exemple de données fictives pour "Lo mejor de cada artista"
    const bestArtists = [
        { id: '1', name: 'This is Bad Bunny', image: require('../assets/exemple_song_1.png') },
        { id: '2', name: 'This is Feid', image: require('../assets/exemple_song_2.png') },
        { id: '3', name: 'This is Cruz Cafuné', image: require('../assets/exemple_song_3.png') },
        { id: '4', name: 'This is Lola Índigo', image: require('../assets/exemple_song_3.png') },
    ];

    // Exemple de données pour "Descubre música nueva"
    const newMusicCategories = [
        { id: '1', label: 'POP', color: '#F44336' },
        { id: '2', label: 'ROCK', color: '#9C27B0' },
        { id: '3', label: 'HIP HOP', color: '#2196F3' },
        { id: '4', label: 'INDIE', color: '#FF9800' },
        { id: '5', label: 'TOP 10 GLOBAL', color: '#4CAF50' },
        { id: '6', label: 'TOP 10 ITALIANO', color: '#3F51B5' },
        { id: '7', label: 'TOP 10 ESPAÑOL', color: '#009688' },
    ];

    const handleTabPress = (tabName) => {
        setSelectedTab(tabName);
    };

    // Barre de recherche
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

    return (
        <View style={styles.container}>

            {/* ScrollView pour tout le contenu sauf la barre inférieure */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Barre supérieure */}
                <View style={styles.topBar}>
                    <Text style={styles.topBarTitle}>Home</Text>
                </View>

                {/* Barre de recherche */}
                <SearchBar />

                {/* Onglets (Todo, Música, Pódcasts) */}
                <View style={styles.tabsContainer}>
                    {['Todo', 'Música', 'Pódcasts'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => handleTabPress(tab)}
                            style={[
                                styles.tab,
                                selectedTab === tab && styles.tabSelected
                            ]}
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
                </View>

                {/* Contenu défilant */}
                {/* Sección: Lo mejor de cada artista */}
                <Text style={styles.sectionTitle}>Lo mejor de cada artista</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {bestArtists.map((artist) => (
                        <View key={artist.id} style={styles.artistCard}>
                            <Image source={artist.image} style={styles.artistImage} />
                            <Text style={styles.artistName}>{artist.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Sección: Descubre música nueva */}
                <Text style={styles.sectionTitle}>Descubre música nueva</Text>
                <View style={styles.categoriesContainer}>
                    {newMusicCategories.map((cat) => (
                        <View
                            key={cat.id}
                            style={[
                                styles.categoryBox,
                                { backgroundColor: cat.color }
                            ]}
                        >
                            <Text style={styles.categoryText}>{cat.label}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.sectionTitle}>Conoce la mejor música de cada idioma</Text>
                <Text style={styles.sectionTitle}>Lo mejor de cada artista</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {bestArtists.map((artist) => (
                        <View key={artist.id} style={styles.artistCard}>
                            <Image source={artist.image} style={styles.artistImage} />
                            <Text style={styles.artistName}>{artist.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Barre de lecture (player) */}
                <View style={styles.playerBar}>
                    <Image
                        source={require('../assets/exemple_song_1.png')}
                        style={styles.albumArt}
                    />
                    <View style={styles.playerInfo}>
                        <Text style={styles.songTitle}>capaz (merengueton)</Text>
                        <Text style={styles.songArtist}>Alleh, Yorgbaki</Text>
                        <View style={styles.progressBar}>
                            <View style={styles.progressBarFill} />
                        </View>
                    </View>
                    <View style={styles.playerActions}>
                        <TouchableOpacity>
                            <Ionicons name="add-circle-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 12 }}>
                            <Ionicons name="heart-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 12 }}>
                            <Ionicons name="play" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Barre de navigation inférieure */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomBarItem}>
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                    <Ionicons name="library" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Tu biblioteca</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                    <Ionicons name="person" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Perfil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContainer: {
        flex: 1,
    },
    // Espace pour scroller sous la bottom bar
    scrollContent: {
        paddingBottom: 100,
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    topBarTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    // Barre de recherche
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

    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    tab: {
        marginRight: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#333',
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

    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 16,
    },
    horizontalScroll: {
        paddingLeft: 16,
        marginBottom: 16,
    },
    artistCard: {
        width: 120,
        marginRight: 12,
        alignItems: 'center',
    },
    artistImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 4,
        resizeMode: 'cover',
    },
    artistName: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 16,
    },
    categoryBox: {
        width: '48%',
        height: 80,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Barre de lecture (mini player)
    playerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9400D3',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 10,
        borderRadius: 20,
    },
    albumArt: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
    },
    playerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    songTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    songArtist: {
        color: '#eee',
        fontSize: 12,
        marginBottom: 4,
    },
    progressBar: {
        height: 2,
        backgroundColor: '#aaa',
        marginTop: 4,
    },
    progressBarFill: {
        width: '40%',
        height: '100%',
        backgroundColor: '#fff',
    },
    playerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
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
});
