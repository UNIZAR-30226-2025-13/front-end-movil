import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Pressable, Modal, FlatList, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { usePlayer } from "./PlayerContext";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../utils/storage";

const PlayerComponent = () => {
  const { currentSong, isPlaying, setIsPlaying } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Estado para la barra de progreso
  const audioPlayer = useRef<Audio.Sound | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;

  // Listado de playlists estáticas (puedes agregar más si lo necesitas)
  /*
  const playlists = [
    { id: 1, nombre: "Playlist 1" },
    { id: 2, nombre: "Playlist 2" },
    { id: 3, nombre: "Playlist 3" },
  ];*/
  useEffect(() => {
    if (!currentSong || !currentSong.link_cm) {
      console.error("❌ No se encontró el link_cm en la canción.");
      setIsLoading(false);
      return;
    }

    const loadAndPlaySong = async () => {
      setIsLoading(true);

      try {
        if (audioPlayer.current) {
          await audioPlayer.current.unloadAsync();
          audioPlayer.current = null;
        }

        const newSound = new Audio.Sound();
        await newSound.loadAsync({ uri: currentSong.link_cm as string });
        await newSound.playAsync();

        audioPlayer.current = newSound;
        setIsPlaying(true);

        Animated.timing(rotation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();

        // Escuchar el progreso de la canción
        newSound.setOnPlaybackStatusUpdate(updateProgress);
      } catch (error) {
        console.error("❌ Error cargando la canción:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndPlaySong();

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.unloadAsync();
      }
    };
  }, [currentSong]);

  // Función para actualizar la barra de progreso
  const updateProgress = async (status: any) => {
    if (status.isLoaded && status.durationMillis) {
      setProgress(status.positionMillis / status.durationMillis);
    }
  };

  const togglePlayPause = async () => {
    if (audioPlayer.current) {
      if (isPlaying) {
        await audioPlayer.current.pauseAsync();
      } else {
        await audioPlayer.current.playAsync();
      }
      setIsPlaying(!isPlaying);
      Animated.timing(rotation, {
        toValue: isPlaying ? 0 : 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };



    const [playlists, setPlaylists] = useState<{ id_lista: number; nombre: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
  
    // Función para abrir el modal y obtener las playlists
    const toggleAddtoPlaylist = async () => {
      //await fetchPlaylists(); // Llamamos a la función para obtener las playlists
      const fetchPlaylists = async () => {
        setLoading(true);
        try {
          const username = await getData("username");
          console.log("👤 Usuario obtenido:", username);
          const url = `https://spongefy-back-end.onrender.com/get-playlists?nombre_usuario=${username}`;
          
          
          const response = await fetch(url);
          const data = await response.json();
  
          if (response.ok) {
            setPlaylists(data);
            console.log("Playlists obtenidas:", playlists); // Puedes hacer algo con las playlists si es necesario
          } else {
            console.error("❌ Error al obtener playlists:", data);
          }
        } catch (error) {
          console.error("⚠️ Error en la solicitud:", error);
        } finally {
          setLoading(false);
        }
      };
  
      // Ejecutar la consulta
      fetchPlaylists();

      console.log("Id Cancion actual:", currentSong?.id);


      setModalVisible(true);  // Abrimos el modal
      
    };
  
    // Función para manejar la selección de una playlist
    const selectPlaylist = (playlistId: number) => {
      console.log("Playlist seleccionada:", playlistId);
      //Añadir currentSong.id a la playlist seleccionada
      
        const addSongToPlaylist = async () => {
          try {
            const url = `https://spongefy-back-end.onrender.com/add-song-playlist`;
            const bodyData = {
              "id_cancion": currentSong?.id,
              "id_playlist": playlistId
            }
            const response = await fetch(url, {
              method: "POST", // Cambiado a POST
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyData),
            });
            const data = await response.json();
            console.log("Respuesta de la API:", data);
          } catch (error) {
            console.error("❌ Error al añadir canción a playlist:", error);
          }  
        };
        addSongToPlaylist();
        setModalVisible(false);  // Cerrar el modal después de seleccionar
      
      
    };

  if (isLoading) {
    return <Text>Cargando canción...</Text>;
  }

  if (!currentSong) {
    return <Text>No se pudo cargar la canción.</Text>;
  }

  const featuringArtists = currentSong.artistas_featuring
    ? currentSong.artistas_featuring.split(',').join(', ')
    : '';

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <View style={styles.songInfo}>
          {currentSong.link_imagen && (
            <Image source={{ uri: currentSong.link_imagen }} style={styles.songImage} />
          )}
          <View>
            <Text style={styles.songTitle}>{currentSong.titulo}</Text>
            <Text style={styles.songArtists}>
              {currentSong.autor}{featuringArtists && `, ${featuringArtists}`}
            </Text>
          </View>
        </View>
        <Pressable onPress={() => toggleAddtoPlaylist()} style={styles.controls}>
          <Image
            source={require("../assets/anyadirplaylist.png")}
            style={styles.icon}
          />
        </Pressable>
         {/* Modal con las playlists */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Añadir a Playlist</Text>
              {loading ? (
                <Text>Cargando listas...</Text>
              ) : (
                <FlatList
                  data={playlists}
                  keyExtractor={(item) => item.id_lista ? item.id_lista.toString() : String(item.nombre)}  // Usa 'id_lista' en lugar de 'id'
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.playlistItem}
                      onPress={() => {
                        if (item.id_lista) {
                          console.log("ID de la playlist:", item.id_lista);  // Verifica que id_lista es el valor correcto
                          selectPlaylist(item.id_lista);  // Usa 'id_lista' para pasar el valor correcto
                        } else {
                          console.error("No se encontró un ID para este item:", item);
                        }
                      }}
                    >
                      <Text style={styles.playlistText}>{item.nombre}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Pressable onPress={togglePlayPause} style={styles.controls}>
          <Image
            source={require("../assets/heart.png")}
            style={styles.icon}
          />
          <Animated.Image
            source={isPlaying ? require("../assets/pause.png") : require("../assets/play.png")}
            style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
            fadeDuration={2}
            />
        </Pressable>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#A200F4",
    padding: 15,
    borderRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
    width: "100%",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  songImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  songTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  songArtists: {
    color: "white",
    fontSize: 12,
  },
  progressBarContainer: {
    width: "95%",
    height: 2,
    backgroundColor: "transparent",
    borderRadius: 1,
    marginVertical: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: "white",
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  playlistItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  playlistText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PlayerComponent;