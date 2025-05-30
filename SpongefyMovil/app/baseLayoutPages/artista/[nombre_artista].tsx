import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Pressable, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchArtistByName } from '../songService';
import { usePlayer } from '../PlayerContext';
import { getData } from '../../../utils/storage';
import { addToQueue, clearQueue, initializeQueue } from '@/utils/fetch';

const ArtistScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { nombre_artista } = useLocalSearchParams<{ nombre_artista: string | string[] }>();
  console.log("Pantalla Artista para:", nombre_artista);
  const { fetchAndPlaySong } = usePlayer();

  const [artistData, setArtistData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancion, setCancion] = useState<any>(null); // Estado para la canción seleccionada
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      if (nombre_artista) {
        const artistName = Array.isArray(nombre_artista) ? nombre_artista[0] : nombre_artista;
        console.log("Nombre del artista:", artistName);
        setIsLoading(true);
        try {
          const artist = await fetchArtistByName(artistName);
          console.log("Datos del artista obtenidos:", artist);
          if (artist) {
            setArtistData(artist);
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
        const nombre_creador = await getData("artist");

        if (!nombre_usuario || !nombre_creador) return;

        const response = await fetch(
          `https://spongefy-back-end.onrender.com/is-a-follower-of-creator?nombre_usuario=${nombre_usuario}&nombre_creador=${nombre_creador}`
        );

        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("Error al comprobar si sigue:", errorResponse);
          return;
        }

        const result = await response.json();

        console.log("¿Sigue al artista?:", result.es_seguidor);

        setIsFollowing(result.es_seguidor);

      } catch (error) {
        console.error("Error en checkIfFollowing:", error);
      }
    };

    fetchArtistInfo();
    checkIfFollowing();
  }, [nombre_artista]);


  const handleLongPress = (cancion: any) => {
    console.log("Manteniendo pulsado:", cancion);
    setCancion(cancion); // Guardar la canción seleccionada en el estado
    //Abrir Desplegable de opciones con Añadir a la cola o añadir a playlist
    setModalVisible(true);
  }
  const closeModal = () => {
    setModalVisible(false);
  };
  const onAddToQueue = async (cancion: any) => {
    console.log("Añadir a la cola:", cancion);
    // Aquí puedes implementar la lógica para añadir a la cola
    try {
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      addToQueue(username, cancion);
      console.log("Canción añadida a la cola:", cancion);
    } catch (error) {
      console.error("⚠️ Error en la solicitud:", error);
    }
  };
  const elimQueue = async () => {
    try {
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      clearQueue(username);
      console.log("Cola eliminada para el usuario:", username);
    } catch (error) {
      console.error("❌ Error al borrar cola:", error);
    }
  }
  const iniQueue = async (id: string) => {
    try {
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      initializeQueue(username);
      addToQueue(username, id);
      console.log("Cancion añadida a la cola:", id);
    } catch (error) {
      console.error("⚠️ Error en la solicitud:", error);
    }
  };

  const handleFollow = async () => {
    const nombre_usuario = await getData("username");
    const nombre_creador = await getData("artist");

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
      const handleGoToAlbum = (id_album: number) => {
          console.log("Boton Album pulsado para:", id_album);
          router.push(`../album/${id_album}`);
      };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#8A2BE2" />
      ) : artistData ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Cabecera del artista */}
          <View style={styles.header}>
            <Image source={{ uri: artistData.link_imagen }} style={styles.artistImage} />
            <View style={styles.artistInfo}>
              <View style={styles.artistLabel}>
                <Text style={styles.artistLabelText}>Artista</Text>
                <Image source={require("../../../assets/certification.png")} style={styles.icon} />
              </View>
              <Text style={styles.artistName}>{artistData.nombre_artista}</Text>
              <View style={styles.followContainer}>
                <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                  <Text style={styles.followText}>
                    {isFollowing === true ? "Siguiendo" : "+ Seguir"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.followers}>{artistData.seguidores} seguidores</Text>
              </View>
            </View>
          </View>

          {/* Sección de favoritas */}
          <View style={styles.favoriteSection}>
            <TouchableOpacity style={styles.favoriteSection} onPress={() => handleGoToPlaylist(artistData.lista_this_is.id_lista)}>
            <Text style={styles.sectionTitle}>Todas las canciones</Text>
            <View style={styles.favoriteImageContainer}>
              <Image source={{ uri: artistData.link_imagen }} style={styles.favoriteArtistImage} />
              <Image source={require("../../../assets/heart.png")} style={styles.heartIcon} />
            </View>
            </TouchableOpacity>
          </View>

          {/* Álbumes */}
          <View style={styles.albumsWrapper}>
            <Text style={styles.section2Title}>Álbumes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumsContainer} >
              {artistData.albumes?.map((album: any) => (
                <TouchableOpacity key={album.id_album} style={styles.albumCard} onPress={() => handleGoToAlbum(album.id_album)}>
                  <Image source={{ uri: album.link_imagen }} style={styles.albumImage} />
                  <Text style={styles.albumTitle}>{album.nombre_album}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Canciones */}
          <View style={styles.songsWrapper}>
            <Text style={styles.section2Title}>Canciones</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.songsContainer}>
              {artistData.canciones?.map((cancion: any) => (
                <Pressable
                  key={cancion.id}
                  style={({ pressed }) => [
                    styles.songCard,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => {
                    fetchAndPlaySong(cancion.id_cancion);
                    elimQueue();
                    iniQueue(cancion.id_cancion);
                  }}
                  onLongPress={() => handleLongPress(cancion.id_cancion)}
                >
                  <Image source={{ uri: cancion.link_imagen }} style={styles.songImage} />
                  <Text style={styles.songTitle}>{cancion.titulo}</Text>
                  <Text style={styles.artistTitle}>{cancion.nombre_artista}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Modal fuera del ScrollView */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Opciones</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                onAddToQueue(cancion);
                closeModal();
              }}
            >
              <Text style={styles.modalButtonText}>Añadir a la cola</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                console.log("Añadir a playlist:", cancion);
                closeModal();
              }}
            >
              <Text style={styles.modalButtonText}>Añadir a una playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'flex-start',
    padding: 20,
    overflowY: 'scroll',
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

export default ArtistScreen;
