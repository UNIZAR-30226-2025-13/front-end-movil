import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { saveData, getData, removeData } from "../../utils/storage";
import { fetchAndSaveHomeData, fetchAndSaveHomeMusicData, fetchAndSaveHomePodcastData, fetchAndSaveSearchHomeAll } from "../../utils/fetch";
import { goToEpisode, goToPerfil, goToPodcast, goToPodcasterPerfil } from '../../utils/navigation';
import SearchBar from './SearchBar';

const SIMILARITY_THRESHOLD = 1;

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

//Todo Search

interface MultimediaSearch {
    id_cm: number;
    titulo: string;
    link_imagen: string;
    similitud: number;
    tipo: string;
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

interface Usuario {
    nombre_usuario: string;
    correo: string;
    similitud: number;
}

interface Lista {
    id_lista: number;
    nombre: string;
    color: string;
    link_compartir: string;
    similitud: number;
    tipo: string;
}

interface SearchResults {
    multimedia: MultimediaSearch[];
    creadores: CreadorSearch[];
    albumes: AlbumSearch[];
    podcasts: Podcast[];
    usuarios: Usuario[];
    listas: Lista[];
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


//Podcat

interface PodcastEpisodio {
    id_ep: number;
    titulo: string;
    link_imagen: string;
    fecha_pub: string;
}

interface PodcastCompleto {
    id_podcast: number;
    nombre_podcast: string;
    foto_podcast: string;
    episodios_recientes: PodcastEpisodio[];
}

interface PodcastListaPodcastersInfo {
    id_lista: number;
    nombre: string;
    nombre_creador: string;
    link_imagen: string;
}

interface PodcastListaAleatorioInfo {
    id_lista: number;
    nombre: string;
    color: string;
}

interface Props {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    onSearch: () => void;
}



export default function HomeScreen() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('Todo');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [isSearching, setIsSearching] = useState(false);
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

    //Podcast

    const [listasPodcastPodcastersInfo, setListasPodcastPodcastersInfo] = useState<PodcastListaPodcastersInfo[]>([]);
    const [listasPodcastAleatorioInfo, setListasPodcastAleatorioInfo] = useState<PodcastListaAleatorioInfo[]>([]);
    const [listasPodcastCompleto, setListasPodcastCompleto] = useState<PodcastCompleto[]>([]);
    const [podcastCompleto, setPodcastCompleto] = useState<PodcastCompleto | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            // Todo
            await fetchAndSaveHomeData();
            const homeData = await getData('home');
            if (homeData) {
                setListasArtistas(homeData.listas_artistas_info || []);
                setListasGeneros(homeData.listas_genero_info || []);
                setListasIdiomas(homeData.listas_idioma_info || []);
                setListasPodcast(homeData.podcasts || []);
            }

            // Musica
            await fetchAndSaveHomeMusicData();
            const homeMusic = await getData('homeMusic');
            if (homeMusic) {
                setListasMusicaGenero(homeMusic.listas_genero_info || []);
                setListasMusicaIdioma(homeMusic.listas_idioma_info || []);
                setListasMusicaArtistas(homeMusic.listas_artistas_info || []);
                setListasMusicaAleatorio(homeMusic.listas_aleatorio_info || []);
                setListasMusicaArtista(homeMusic.artista || null);
            }

            // Podcasts
            await fetchAndSaveHomePodcastData();
            const homePodcast = await getData('homePodcast');
            if (homePodcast) {
                setListasPodcastPodcastersInfo(homePodcast.listas_podcasters_info || []);
                setListasPodcastAleatorioInfo(homePodcast.listas_aleatorio_info || []);
                setListasPodcastCompleto(homePodcast.podcasts || []);
                setPodcastCompleto(homePodcast.podcast || null);
            }
        };

        fetchAll();
    }, []);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }
        if (selectedTab === 'Todo') {
            await fetchAndSaveSearchHomeAll(searchQuery);
            const data = await getData('searchGlobal');
            if (data) {
                setSearchResults({
                    multimedia: data.multimedia || [],
                    creadores: data.creadores || [],
                    albumes: data.albumes || [],
                    podcasts: data.podcasts || [],
                    usuarios: data.usuarios || [],
                    listas: data.listas || []
                });
            }
        }
    }, [searchQuery, selectedTab]);

    const handlePerfilPodcaster = async (name: string) => {
        await saveData('podcaster', name);
        console.log('Podcaster name:', name);
        goToPodcasterPerfil(name);
    };
    const handlePodcast = async (id: number) => {
        await saveData('podcast', id);
        goToPodcast(id);
    };
    const handleEpisodio = async (id: number) => {
        await saveData('episode', id);
        goToEpisode(id);
    };
    const handleGoToArtista = async (name: string) => {
        await saveData('artist', name);
        router.push(`/baseLayoutPages/artista/${name}`);
    };

    const handleGoToUser = async (name: string) => {
        goToPerfil(name);
    };

    // const SearchBar = () => (
    //     <View style={styles.searchContainer}>
    //         <Ionicons name="search" size={20} color="#fff" style={styles.iconLeft} />
    //         <TextInput
    //             style={styles.searchInput}
    //             placeholder="Buscar"
    //             placeholderTextColor="#888"
    //             value={searchQuery}
    //             onChangeText={setSearchQuery}
    //             onSubmitEditing={handleSearch}
    //             returnKeyType="search"
    //         />
    //     </View>
    // );

    const renderSectionContent = () => {
        if (searchResults) {
            return (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {!!searchResults.multimedia.length && (
                        <>
                            <Text style={styles.subtitle}>Multimedia</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                {searchResults.multimedia
                                    .filter(x => x.similitud >= SIMILARITY_THRESHOLD)
                                    .map((item, i) => (
                                        <TouchableOpacity key={i} style={styles.itemContainer}>
                                            <Image source={{ uri: item.link_imagen }} style={styles.itemImage} />
                                            <Text style={styles.itemText}>{item.titulo}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Creadores */}
                    {!!searchResults.creadores.length && (
                        <>
                            <Text style={styles.subtitle}>Creadores</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                {searchResults.creadores
                                    .filter(x => x.similitud >= SIMILARITY_THRESHOLD)
                                    .map((item, i) => (
                                        <TouchableOpacity key={i} style={styles.itemContainer} onPress={() => handlePerfilPodcaster(item.nombre_creador)}>
                                            <Image source={{ uri: item.link_imagen }} style={styles.itemImage} />
                                            <Text style={styles.itemText}>{item.nombre_creador}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Albumes */}
                    {!!searchResults.albumes.length && (
                        <>
                            <Text style={styles.subtitle}>Álbumes</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                {searchResults.albumes
                                    .filter(x => x.similitud >= SIMILARITY_THRESHOLD)
                                    .map((item, i) => (
                                        <TouchableOpacity key={i} style={styles.itemContainer}>
                                            <Image source={{ uri: item.link_imagen }} style={styles.itemImage} />
                                            <Text style={styles.itemText}>{item.nombre_album}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Podcasts */}
                    {!!searchResults.podcasts.length && (
                        <>
                            <Text style={styles.subtitle}>Podcasts</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                {searchResults.podcasts
                                    .filter(x => x.similitud >= SIMILARITY_THRESHOLD)
                                    .map((item, i) => (
                                        <TouchableOpacity key={i} style={styles.itemContainer}>
                                            <Image source={{ uri: item.link_imagen }} style={styles.itemImage} />
                                            <Text style={styles.itemText}>{item.nombre}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Usuarios */}
                    {!!searchResults.usuarios.length && (
                        <>
                            <Text style={styles.subtitle}>Usuarios</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                {searchResults.usuarios
                                    .filter(x => x.similitud >= SIMILARITY_THRESHOLD)
                                    .map((u, i) => (
                                        <TouchableOpacity key={i} style={styles.userContainer} onPress={() => handleGoToUser(u.nombre_usuario)}>
                                            <View style={styles.userIcon}>
                                                <Text style={styles.userInitial}>{u.nombre_usuario.charAt(0).toUpperCase()}</Text>
                                            </View>
                                            <Text style={styles.itemText}>{u.nombre_usuario}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Listas */}
                    {!!searchResults.listas.length && (
                        <>
                            <Text style={styles.subtitle}>Listas</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                {searchResults.listas
                                    .filter(x => x.similitud >= SIMILARITY_THRESHOLD)
                                    .map(l => (
                                        <TouchableOpacity key={l.id_lista} style={[styles.genreItem, { backgroundColor: l.color }]}>
                                            <Text style={styles.genreText}>{l.nombre}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </>
                    )}
                </ScrollView>
            );
        }

        switch (selectedTab) {
            case 'Todo':
                return (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <Text style={styles.subtitle}>Lo mejor de cada artista</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.scrollView}
                        >
                            {listasArtistas.map(a => (
                                <TouchableOpacity
                                    key={a.id_lista}
                                    style={styles.itemContainer}
                                    onPress={() => router.push(`/baseLayoutPages/playlist/${a.id_lista}`)}
                                >
                                    <Image
                                        source={{ uri: a.link_imagen }}
                                        style={styles.itemImage}
                                    />
                                    <Text style={styles.itemText}>{a.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.subtitle}>Descubre música nueva</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                            {listasGeneros.map(g => (
                                <TouchableOpacity key={g.id_lista} style={[styles.genreItem, { backgroundColor: g.color }]} onPress={() => router.push(`/baseLayoutPages/playlist/${g.id_lista}`)}>
                                    <Text style={styles.genreText}>{g.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.subtitle}>Conoce la mejor música de cada idioma</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                            {listasIdiomas.map(i => (
                                <TouchableOpacity key={i.id_lista} style={[styles.genreItem, { backgroundColor: i.color }]} onPress={() => router.push(`/baseLayoutPages/playlist/${i.id_lista}`)}>
                                    <Text style={styles.genreText}>{i.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.subtitle}>Lo mejor en podcasts</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                            {listasPodcast.map(p => (
                                <TouchableOpacity key={p.id_podcast} style={styles.itemContainer} onPress={() => handlePodcast(p.id_podcast)}>
                                    <Image source={{ uri: p.link_imagen }} style={styles.itemImage} />
                                    <Text style={styles.itemText}>{p.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </ScrollView>
                );

            case 'Musica':
                return (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {listasMusicaArtista && (
                            <>
                                <Text style={styles.subtitle}>Lo mejor de {listasMusicaArtista.nombre_artista}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                    <TouchableOpacity onPress={() => handleGoToArtista(listasMusicaArtista.nombre_artista)}>
                                        <Image source={{ uri: listasMusicaArtista.link_imagen }} style={styles.artistaImage} />
                                        <Text style={styles.itemText}>{listasMusicaArtista.nombre_artista}</Text>
                                    </TouchableOpacity>
                                    {listasMusicaArtista.canciones_albumes.map((c, i) => (
                                        <TouchableOpacity key={i} style={styles.itemContainer}>
                                            <Image source={{ uri: c.link_imagen }} style={styles.itemImage} />
                                            <Text style={styles.itemText}>{c.titulo}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </>
                        )}

                        <Text style={styles.subtitle}>Spongefy recomienda</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                            {listasMusicaAleatorio.map(i => (
                                <TouchableOpacity key={i.id_lista} style={[styles.genreItem, { backgroundColor: i.color }]} onPress={() => router.push(`/baseLayoutPages/playlist/${i.id_lista}`)}>
                                    <Text style={styles.genreText}>{i.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                    </ScrollView>
                );

            case 'Podcasts':
                return (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {podcastCompleto && (
                            <>
                                <Text style={styles.subtitle}>Lo mejor de {podcastCompleto.nombre_podcast}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                                    <TouchableOpacity onPress={() => handlePodcast(podcastCompleto.id_podcast)}>
                                    <Image source={{ uri: podcastCompleto.foto_podcast }} style={styles.artistaImage} />
                                    <Text style={styles.itemText}>{podcastCompleto.nombre_podcast}</Text>
                                    </TouchableOpacity>
                                    
                                    {podcastCompleto.episodios_recientes.map((e, i) => (
                                        <TouchableOpacity key={i} style={styles.itemContainer} onPress={() => handleEpisodio(e.id_ep)}>
                                            <Image source={{ uri: e.link_imagen }} style={styles.itemImage} />
                                            <Text style={styles.itemText}>{e.titulo}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </>
                        )}

                        <Text style={styles.subtitle}>Spongefy recomienda</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                            {listasPodcastAleatorioInfo.map(a => (
                                <TouchableOpacity key={a.id_lista} onPress={() => router.push(`/baseLayoutPages/playlist/${a.id_lista}`)} style={[styles.genreItem, { backgroundColor: a.color }]}> 
                                    <Text style={styles.genreText}>{a.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.subtitle}>Los mejores creadores de podcasts</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                            {listasPodcastPodcastersInfo.map(p => (
                                <TouchableOpacity key={p.id_lista} onPress={() => handlePerfilPodcaster(p.nombre_creador)} style={styles.itemContainer}>
                                    <Image source={{ uri: p.link_imagen }} style={styles.itemImage} />
                                    <Text style={styles.itemText}>{p.nombre}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </ScrollView>
                );

            default:
                return <Text style={styles.sectionText}>Selecciona una sección</Text>;
        }
    };

    return (
        <View style={styles.container}>
            {/* — Header — */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="home-outline" size={28} color="#fff" />
                    <Text style={styles.title}>Home</Text>
                </View>
            </View>

            {/* — SearchBar — */}
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
            />

            <View style={styles.tabsContainer}>
                {tabs.map(tab => (
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

            {renderSectionContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginLeft: 8 },
    friendsIcon: { width: 28, height: 28 },

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
        marginBottom: 10
    },
    iconLeft: { marginRight: 8 },
    searchInput: { flex: 1, color: '#fff', fontSize: 16 },

    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 10
    },
    tab: {
        backgroundColor: '#333',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 10
    },
    tabSelected: { backgroundColor: '#fff' },
    tabText: { color: '#fff', fontSize: 14 },
    tabTextSelected: { color: '#000', fontWeight: 'bold' },

    content: { flex: 1, marginHorizontal: 16 },
    subtitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginVertical: 8 },
    scrollView: { marginBottom: 16 },

    itemContainer: { marginRight: 10, alignItems: 'center' },
    itemImage: { width: 80, height: 80, borderRadius: 10 },
    itemText: { color: '#fff', fontSize: 11, marginTop: 8, textAlign: 'center', width: 80 },

    // “Usuarios”
    userContainer: { marginRight: 10, alignItems: 'center' },
    userIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userInitial: { color: '#000', fontSize: 24, fontWeight: 'bold' },

    // Genre / Listas
    genreItem: {
        width: 80,
        height: 80,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    genreText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },

    // Artista / Podcast large
    artistaImage: { width: 100, height: 100, borderRadius: 10 },

    sectionText: { color: '#fff', fontSize: 16, marginTop: 20 }
});
