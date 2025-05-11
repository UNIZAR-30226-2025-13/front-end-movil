import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Pressable, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import { fetchArtistByName } from 'songService';
// import { usePlayer } from 'PlayerContext';
import { getData } from '../../../utils/storage';
import { fetchAndSavePodcaster } from '../../../utils/fetch'
import { goToEpisode, goToPodcast } from '@/utils/navigation';




interface ThisIsList {
    id_lista: number;
    nombre: string;
  }
  interface PodcastInfo {
    id_podcast: number;
    nombre: string;
    link_imagen: string;
  }

  interface Episodio {
    nombre: string;
    link_imagen: string;
    id_episodio: number;
    titulo_episodio: string;
  }
  
  interface EpisodioReciente extends Episodio {
    descripcion: string;
    id_podcast: number;
  }
  
  interface PodcasterData {
    nombre_podcaster: string;
    biografia: string;
    link_imagen: string;
    seguidores: number;
    lista_this_is: ThisIsList;
    podcasts_info: PodcastInfo[];
    list_episodios: Episodio[];
    ep_mas_reciente: EpisodioReciente[];
  }



export default function PodcasterScreen() {
    const { nombre_podcaster } = useLocalSearchParams<{ nombre_podcaster: string | string[] }>();
    console.log("Pantalla Artista para:", nombre_podcaster);
    
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [podcasterData, setPodcasterData] = useState<PodcasterData | null>(null);


    const mockPodcasterData: PodcasterData = {
      nombre_podcaster: "Nombre Ejemplo",
      biografia: "Esta es una biografía de ejemplo para el podcaster.",
      link_imagen: "https://placehold.co/300x300", // imagen de prueba
      seguidores: 1234,
      lista_this_is: {
        id_lista: 1,
        nombre: "This is Nombre Ejemplo"
      },
      podcasts_info: [
        {
          id_podcast: 1,
          nombre: "Podcast Uno",
          link_imagen: "https://placehold.co/100x100"
        },
        {
          id_podcast: 2,
          nombre: "Podcast Dos",
          link_imagen: "https://placehold.co/100x100"
        }
      ],
      list_episodios: [
        {
          nombre: "Podcast Uno",
          link_imagen: "https://placehold.co/100x100",
          id_episodio: 1,
          titulo_episodio: "Episodio 1"
        },
        {
          nombre: "Podcast Dos",
          link_imagen: "https://placehold.co/100x100",
          id_episodio: 2,
          titulo_episodio: "Episodio 2"
        }
      ],
      ep_mas_reciente: [
        {
          id_podcast: 1,
          nombre: "Podcast Uno",
          link_imagen: "https://placehold.co/100x100",
          id_episodio: 3,
          titulo_episodio: "Episodio Reciente",
          descripcion: "Este es el episodio más reciente."
        }
      ]
    };
    const fetchPodcasterByName = async (nombre_podcaster: string): Promise<PodcasterData | null> => {  
      try {
        const nombre_podcaster_encoded = encodeURIComponent(nombre_podcaster);
        const response = await fetch(`https://spongefy-back-end.onrender.com/podcaster?nombre_podcaster=${nombre_podcaster_encoded}`);
        const data = await response.json();
    
        console.log("📥 Respuesta de la API:", data);
    
    
        return data;
      } catch (error) {
        console.error("❌ Error en fetchPodcasterByName:", error);
        return null;
      }
    };
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchArtistInfo = async () => {
          if (nombre_podcaster) {
            const podcastername = Array.isArray(nombre_podcaster) ? nombre_podcaster[0] : nombre_podcaster;
            console.log("Nombre del artista:", podcastername);
            setIsLoading(true);
            try {
              const podcaster = await fetchPodcasterByName(podcastername);
              console.log("Datos del artista obtenidos:", podcaster);
              if (podcaster) {
                setPodcasterData(podcaster);
                setError(null);
              } else {
                setError("No se encontraron datos del artista.");
              }
            } catch (err) {
              setError("Hubo un error al obtener la información del artista.");
              console.error(err);
            } finally {
              setIsLoading(false);
            }
          }
        };
    
        const checkIfFollowing = async () => {
          try {
            const nombre_usuario = await getData("username");
    
            if (!nombre_usuario || !nombre_podcaster) return;
    
            const response = await fetch(
              `https://spongefy-back-end.onrender.com/is-a-follower-of-creator?nombre_usuario=${nombre_usuario}&nombre_creador=${nombre_podcaster}`
            );
    
            if (!response.ok) {
              const errorResponse = await response.text();
              console.error("Error al comprobar si sigue:", errorResponse);
              return;
            }
    
            const result = await response.json();
    
            console.log("¿Sigue al artista?:", result.es_seguidor);
            if (result.es_seguidor === true) {
              setIsFollowing(true);
              console.log("Ya sigues al creador:", nombre_podcaster);
            }
            else if (result.es_seguidor === false) {
              setIsFollowing(false);
            }
    
          } catch (error) {
            console.error("Error en checkIfFollowing:", error);
          }
        };
    
        fetchArtistInfo();
        checkIfFollowing();
      }, [nombre_podcaster]);

    const handleFollow = async () => {
      const nombre_usuario = await getData("username");
      const nombre_creador = nombre_podcaster;
  
      if (isFollowing) {
        try {
          const response = await fetch("https://spongefy-back-end.onrender.com/unfollow-creator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre_usuario,
              nombre_creador,
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            console.log("Ya no sigues al creador:", data);
            setIsFollowing(false);
          } else {
            console.error("Error al dejar de seguir al creador:", data);
          }
        } catch (error) {
          console.error("Error en handleFollow:", error);
        }
      } else {
        try {
          const response = await fetch("https://spongefy-back-end.onrender.com/follow-creator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre_usuario,
              nombre_creador,
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            console.log("Ahora sigues al creador:", data);
            setIsFollowing(true);
          } else {
            console.error("Error al seguir al creador:", data);
          }
        } catch (error) {
          console.error("Error en handleFollow:", error);
        }
      }
    };

    const handleGoToPlaylist = (id_playlist: number) => {
        console.log("Boton Playlist pulsado para:", id_playlist);
        router.push(`../playlist/${id_playlist}`);
    };

  return (
    <View style={styles.container}>
      {!podcasterData ? (
        <ActivityIndicator size="large" color="#8A2BE2" style={{ marginTop: 100 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
  
          {/* Cabecera del podcaster */}
          <View style={styles.header}>
            <Image source={{ uri: podcasterData.link_imagen }} style={styles.artistImage} />
            <View style={styles.artistInfo}>
              <View style={styles.artistLabel}>
                <Text style={styles.artistLabelText}>Podcaster</Text>
                <Image source={require("../../../assets/certification.png")} style={styles.icon} />
              </View>
              <Text style={styles.artistName}>{podcasterData.nombre_podcaster}</Text>
              <View style={styles.followContainer}>
                <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                  <Text style={styles.followText}>
                    {isFollowing === true ? "Siguiendo" : "+ Seguir"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.followers}>{podcasterData.seguidores} seguidores</Text>
              </View>
            </View>
          </View>


          <View style={styles.favoriteSection}>
            <TouchableOpacity style={styles.favoriteSection} onPress={() => handleGoToPlaylist(podcasterData.lista_this_is.id_lista)}>
            <Text style={styles.sectionTitle}>Todos los episodios</Text>
            <View style={styles.favoriteImageContainer}>
              <Image source={{ uri: podcasterData.link_imagen }} style={styles.favoriteArtistImage} />
              <Image source={require("../../../assets/heart.png")} style={styles.heartIcon} />
            </View>
            </TouchableOpacity>
          </View>

          {/* Más reciente */}
          <View style={styles.songsWrapper}>
            <Text style={styles.section2Title}>Más reciente</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.songsContainer}>
              {podcasterData.ep_mas_reciente?.map((ep) => (
                <Pressable
                  key={ep.id_episodio}
                  style={({ pressed }) => [ styles.recentEpisodeCard, pressed && { opacity: 0.7 }
                  ]} onPress={() => { console.log("Episodio ID:", ep.id_episodio) }}>
                  <Image source={{ uri: ep.link_imagen }} style={styles.songImage} />
                  <View style={styles.recentEpisodeTextContainer}>
                    <Text style={styles.songTitle}>{ep.titulo_episodio}</Text>
                    <Text style={styles.artistTitle}>{ep.nombre}</Text>
                    <Text style={styles.artistTitle}>{ep.descripcion}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          
  
          {/* Podcasts */}
          <View style={styles.albumsWrapper}>
            <Text style={styles.section2Title}>Podcasts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumsContainer}>
              {podcasterData.podcasts_info?.map((podcast) => (
                <Pressable key={podcast.id_podcast} style={styles.albumCard} onPress={() => { console.log("Podcast ID:", podcast.id_podcast); goToPodcast(podcast.id_podcast) }}>
                  <Image source={{ uri: podcast.link_imagen }} style={styles.albumImage} />
                  <Text style={styles.albumTitle}>{podcast.nombre}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
  
          {/* Episodios */}
          <View style={styles.songsWrapper}>
            <Text style={styles.section2Title}>Episodios</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.songsContainer}>
              {podcasterData.list_episodios?.map((ep) => (
                <Pressable
                  key={ep.id_episodio}
                  style={({ pressed }) => [
                    styles.songCard,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => { console.log("Episodio ID:", ep.id_episodio); goToEpisode(ep.id_episodio) } }
                >
                  <Image source={{ uri: ep.link_imagen }} style={styles.songImage} />
                  <Text style={styles.songTitle}>{ep.titulo_episodio}</Text>
                  <Text style={styles.artistTitle}>{ep.nombre}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
  

        </ScrollView>
      )}
    </View>
  );
  


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    // overflow: 'scroll',
  },
  header: {
    backgroundColor: '#666',
    padding: 20,
    borderRadius: 40,
    alignItems: 'flex-start',
    width: '100%',
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
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 5,
  },
  artistInfo: {
    alignItems: 'flex-start',
  },
  artistLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistLabelText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5,
  },
  artistName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  followContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#A020F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  followers: {
    fontSize: 14,
    color: '#fff',
  },
  favoriteSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  favoriteImageContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  favoriteArtistImage: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },
  heartIcon: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  sectionTitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'right',
    width: 150,
    marginRight: 20,
    fontWeight: 'bold',
  },
  section2Title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  albumCard: {
    width: 100,
    marginRight: 10,
  },
  albumImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  albumTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  songCard: {
    width: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  songImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  songTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  artistTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  icon: {
    width: 15,
    height: 15,
  },
  albumsWrapper: {
    width: '100%',
  },
  albumsContainer: {
    flexDirection: 'row',
  },
  songsWrapper: {
    width: '100%',
  },
  songsContainer: {
    flexDirection: 'row',
  },
  recentEpisodeTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  recentEpisodeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 300,
  },
});


