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
import { fetchAndSaveHomeData, fetchAndSaveHomeMusicData, fetchAndSaveHomePodcastData } from "../utils/fetch";

//Todo
interface Artista {
    id_lista: number;
    link_imagen: string;
    nombre: string;
    nombre_creador: string;
}

interface Genero {
    id_lista: number;
    nombre: string;
    color: string;
}

interface Idioma {
    id_lista: number;
    nombre: string;
    color: string;
}

interface Podcast {
    id_podcast: number;
    link_imagen: string;
    nombre: string;
}

//Musica
interface MusicaCancionAlbum {
    id: number;
    titulo: string;
    link_imagen: string;
    fecha_pub: string;
    tipo: string;
}

interface MusicaArtista {
    nombre_artista: string;
    link_imagen: string;
    canciones_albumes: MusicaCancionAlbum[];
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



export default function HomeScreen() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('Todo');
    const tabs = ['Todo', 'Musica', 'Podcasts'];

    //Todo

    const [listasArtistas, setListasArtistas] = useState<Artista[]>([]);
    const [listasGeneros, setListasGeneros] = useState<Genero[]>([]);
    const [listasIdiomas, setListasIdiomas] = useState<Idioma[]>([]);
    const [listasPodcast, setListasPodcast] = useState<Podcast[]>([]);

    //Musica

    const [listasMusicaGenero, setListasMusicaGenero] = useState<MusicaListaGenero[]>([]);
    const [listasMusicaIdioma, setListasMusicaIdioma] = useState<MusicaListaIdioma[]>([]);
    const [listasMusicaArtistas, setListasMusicaArtistas] = useState<MusicaListaArtistas[]>([]);
    const [listasMusicaAleatorio, setListasMusicaAleatorio] = useState<MusicaListaAleatorio[]>([]);
    const [listasMusicaArtista, setListasMusicaArtista] = useState<MusicaArtista | null>(null);

    useEffect(() => {
        const fetchData = async () => {

            //Todo
            await fetchAndSaveHomeData();
            const homeData = await getData("home"); 
            if (homeData) {
                setListasArtistas(homeData.listas_artistas_info || []);
                setListasGeneros(homeData.listas_genero_info || []);
                setListasIdiomas(homeData.listas_idioma_info || []);
                setListasPodcast(homeData.podcasts || [])
            }

            //Musica
            await fetchAndSaveHomeMusicData();
            const homeMusicData = await getData("homeMusic");
            if (homeMusicData) {
                setListasMusicaGenero(homeMusicData.listas_genero_info || []);
                setListasMusicaIdioma(homeMusicData.listas_idioma_info || []);
                setListasMusicaArtistas(homeMusicData.listas_artistas_info || []);
                setListasMusicaAleatorio(homeMusicData.listas_aleatorio_info || []);
                setListasMusicaArtista(homeMusicData.artista || null);
            }


        };
        fetchData();
    }, []);
    
    const handleDebug = async () => {
        console.log("DEBUG");
        const username = await getData("username"); 
        if (username) {
            await fetchAndSaveHomePodcastData();
        }
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
            case 'Todo':
                return (
                    <ScrollView style={styles.containerVerticalScroll} showsVerticalScrollIndicator={false}>    
                        
                            <Text style={styles.subtitle}>Lo mejor de cada artista</Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasArtistas.map((artista) => (
                                    <TouchableOpacity key={artista.id_lista} style={styles.itemContainer}>
                                        <Image source={{ uri: artista.link_imagen }} style={styles.itemImage} />
                                        <Text style={styles.itemText}>{artista.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.subtitle}>Descubre musica nueva</Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasGeneros.map((genero) => (
                                    <TouchableOpacity 
                                        key={genero.id_lista} 
                                        style={[styles.genreItem, { backgroundColor: genero.color }]}
                                    >
                                        <Text style={styles.genreText}>{genero.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.subtitle}>Conoce la mejor musica de cada idioma </Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasIdiomas.map((idioma) => (
                                    <TouchableOpacity 
                                        key={idioma.id_lista} 
                                        style={[styles.genreItem, { backgroundColor: idioma.color }]}
                                    >
                                        <Text style={styles.genreText}>{idioma.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.subtitle}>Lo mejor en podcasts</Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasPodcast.map((artista) => (
                                    <TouchableOpacity key={artista.id_podcast} style={styles.itemContainer}>
                                        <Image source={{ uri: artista.link_imagen }} style={styles.itemImage} />
                                        <Text style={styles.itemText}>{artista.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <TouchableOpacity style={styles.addButton} onPress={handleDebug}>
                                <Ionicons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        
                    </ScrollView>
                );
            
            case 'Musica':
                return (
                    <ScrollView style={styles.containerVerticalScroll} showsVerticalScrollIndicator={false}>    
                        
                        <Text style={styles.subtitle}>Spongefy recomienda </Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasMusicaAleatorio.map((idioma) => (
                                    <TouchableOpacity 
                                        key={idioma.id_lista} 
                                        style={[styles.genreItem, { backgroundColor: idioma.color }]}
                                    >
                                        <Text style={styles.genreText}>{idioma.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.subtitle}>Descubre musica nueva</Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasMusicaGenero.map((genero) => (
                                    <TouchableOpacity 
                                        key={genero.id_lista} 
                                        style={[styles.genreItem, { backgroundColor: genero.color }]}
                                    >
                                        <Text style={styles.genreText}>{genero.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.subtitle}>Conoce la mejor musica de cada idioma </Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasMusicaIdioma.map((idioma) => (
                                    <TouchableOpacity 
                                        key={idioma.id_lista} 
                                        style={[styles.genreItem, { backgroundColor: idioma.color }]}
                                    >
                                        <Text style={styles.genreText}>{idioma.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.subtitle}>Lo mejor de cada artista</Text>
                            <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                                {listasMusicaArtistas.map((artista) => (
                                    <TouchableOpacity key={artista.id_lista} style={styles.itemContainer}>
                                        <Image source={{ uri: artista.link_imagen }} style={styles.itemImage} />
                                        <Text style={styles.itemText}>{artista.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        
                    </ScrollView>
                );

            case 'Podcasts':
                return ;

            default:
                return <Text style={styles.sectionText}>Selecciona una sección</Text>;
        }
    };

    return (
        <View style={styles.container}>
            
                {/* Encabezado */}
            <View style={styles.header}>
                <Ionicons name="library-outline" size={28} color="white" />
                <Text style={styles.title}>Home</Text>
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



            <View style={styles.content}>
                {renderSectionContent()}
            </View>


            

            {/* Barre de navigation inférieure */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.bottomBarItem}
                >
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.bottomBarText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomBarItem}
                    onPress={() => router.push('/Biblioteca')}
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
    containerVerticalScroll: {
        flex: 1,
        backgroundColor: '#000',
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
    subtitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 10,
        margin: 10,
    },
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
    // Onglets
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
      scrollView: {
        flex: 1, // Ocupar todo el espacio posible
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
    itemContainer: { marginRight: 10, alignItems: 'center' },
    itemImage: { width: 80, height: 80, borderRadius: 10 },
    itemText: { color: '#fff', fontSize: 11, marginTop: 8, textAlign: 'center' },
    genreItem: { 
        width: 80, 
        height: 80, 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 10 
    },
    genreText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});
