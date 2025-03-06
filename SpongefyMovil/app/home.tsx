import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions
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

    return (
        <View style={styles.container}>
            {/* Barre supérieure */}
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Home</Text>
                <Ionicons name="search" size={24} color="#fff" />
            </View>

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

            {/* Contenu principal défilant */}
            <ScrollView style={styles.scrollContainer}>

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

                {/* Exemple de section supplémentaire (TOP 10, etc.) */}
                <Text style={styles.sectionTitle}>Lo mejor de cada artista</Text>
                {/* Tu peux réutiliser le même composant horizontal ou en créer un autre. */}
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
        backgroundColor: '#000', // Fond noir
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
    scrollContainer: {
        flex: 1,
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
