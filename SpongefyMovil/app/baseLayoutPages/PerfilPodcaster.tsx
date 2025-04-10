import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Pressable, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import { fetchArtistByName } from 'songService';
// import { usePlayer } from 'PlayerContext';
import { getData } from '../../utils/storage';
import { fetchAndSavePodcaster } from '../../utils/fetch'




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

    const [nombre_podcaster, setNombrePodcaster] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [podcasterData, setPodcasterData] = useState<PodcasterData | null>(null);


    useEffect(() => {

      const fetchPodcasterInfo = async () => {

        const nombre_podcaster = await getData("podcaster");
        setNombrePodcaster(nombre_podcaster);
        console.log("Nombre del podcaster:", nombre_podcaster);
        await fetchAndSavePodcaster(nombre_podcaster);
        const podcasterProfileData = await getData("podcaster_profile");
        if (podcasterProfileData) {
            const parsedPodcasterData: PodcasterData = JSON.parse(podcasterProfileData);
            setPodcasterData(parsedPodcasterData);
          }
        }

        //   const checkIfFollowing = async () => {
    //     try {
    //       const nombre_usuario = await getData("username");
    //       const nombre_creador = await getData("artist");
      
    //       if (!nombre_usuario || !nombre_creador) return;
      
    //       const response = await fetch(
    //         `https://spongefy-back-end.onrender.com/is-a-follower-of-creator?nombre_usuario=${nombre_usuario}&nombre_creador=${nombre_creador}`
    //       );
      
    //       if (!response.ok) {
    //         const errorResponse = await response.text();
    //         console.error("Error al comprobar si sigue:", errorResponse);
    //         return;
    //       }
      
    //       const result = await response.json();

    //       console.log("¿Sigue al artista?:", result.es_seguidor);

    //       setIsFollowing(result.es_seguidor);
      
    //     } catch (error) {
    //       console.error("Error en checkIfFollowing:", error);
    //     }
    //   };

        fetchPodcasterInfo();
    //  checkIfFollowing();

      }, []);

    const handleFollow = async () => {
      // const nombre_usuario = await getData("username");
      // const nombre_creador = await getData("artist");
    
      // if (isFollowing) {
      //   try {
      //     const response = await fetch("https://spongefy-back-end.onrender.com/unfollow-creator", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         nombre_usuario,
      //         nombre_creador,
      //       }),
      //     });
    
      //     const data = await response.json();
    
      //     if (response.ok) {
      //       console.log("Ya no sigues al creador:", data);
      //       setIsFollowing(false);
      //     } else {
      //       console.error("Error al dejar de seguir al creador:", data);
      //     }
      //   } catch (error) {
      //     console.error("Error en handleFollow:", error);
      //   }
      // } else {
      //   try {
      //     const response = await fetch("https://spongefy-back-end.onrender.com/follow-creator", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         nombre_usuario,
      //         nombre_creador,
      //       }),
      //     });
    
      //     const data = await response.json();
    
      //     if (response.ok) {
      //       console.log("Ahora sigues al creador:", data);
      //       setIsFollowing(true);
      //     } else {
      //       console.error("Error al seguir al creador:", data);
      //     }
      //   } catch (error) {
      //     console.error("Error en handleFollow:", error);
      //   }
      // }
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
  
          {/* Biografía */}
          <Text style={[styles.section2Title, { paddingHorizontal: 20 }]}>Biografía</Text>
          <Text style={{ color: "#fff", paddingHorizontal: 20 }}>{podcasterData.biografia}</Text>
  
          {/* Lista This is */}
          {podcasterData.lista_this_is && (
            <View style={styles.favoriteSection}>
              <Text style={styles.sectionTitle}>This is</Text>
              <View style={styles.favoriteImageContainer}>
                <Image
                  source={{ uri: podcasterData.link_imagen }}
                  style={styles.favoriteArtistImage}
                />
                <Image source={require("../../assets/heart.png")} style={styles.heartIcon} />
              </View>
              <Text style={{ color: "#fff" }}>{podcasterData.lista_this_is.nombre}</Text>
            </View>
          )}
  
          {/* Podcasts */}
          <View style={styles.albumsWrapper}>
            <Text style={styles.section2Title}>Podcasts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumsContainer}>
              {podcasterData.podcasts_info?.map((podcast) => (
                <View key={podcast.id_podcast} style={styles.albumCard}>
                  <Image source={{ uri: podcast.link_imagen }} style={styles.albumImage} />
                  <Text style={styles.albumTitle}>{podcast.nombre}</Text>
                </View>
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
                  onPress={() => {
                    // Aquí podrías poner lógica para reproducir o navegar al episodio
                  }}
                >
                  <Image source={{ uri: ep.link_imagen }} style={styles.songImage} />
                  <Text style={styles.songTitle}>{ep.titulo_episodio}</Text>
                  <Text style={styles.artistTitle}>{ep.nombre}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
  
          {/* Más reciente */}
          <View style={styles.songsWrapper}>
            <Text style={styles.section2Title}>Más reciente</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.songsContainer}>
              {podcasterData.ep_mas_reciente?.map((ep) => (
                <View key={ep.id_episodio} style={styles.songCard}>
                  <Image source={{ uri: ep.link_imagen }} style={styles.songImage} />
                  <Text style={styles.songTitle}>{ep.titulo_episodio}</Text>
                  <Text style={styles.artistTitle}>{ep.nombre}</Text>
                </View>
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
    alignItems: 'flex-start',
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
  errorText: {
    color: 'red',
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
  // Estilos para el Modal
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#A200F4",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});


