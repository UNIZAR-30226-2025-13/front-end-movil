import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Pressable, Modal, FlatList, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
import { usePlayer } from "./PlayerContext";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../utils/storage";

const PlayerComponent = () => {
  const { currentSong, isPlaying, setIsPlaying } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Estado para la barra de progreso
  const audioPlayer = useRef<Audio.Sound | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const { fetchAndPlaySong } = usePlayer();
  //indice de la cola
  const [queueIndex, setQueueIndex] = useState(0);
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
  const handleSongEnd = async () => {
    //aumentar el indice de la cola
    setQueueIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      console.log("Nuevo índice:", newIndex);
      fetchNextSong(newIndex); // Llamar a la función con el índice actualizado
      return newIndex;
    });
    //console.log("Índice de cola actualizado:", queueIndex);
    
    //reproducir esa posicion de cola
  }
  const fetchNextSong = async (index: number) => {
    try {
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      const url = `https://spongefy-back-end.onrender.com/queue/get-cm?nombre_usuario=${username}&posicion=${index}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        console.log("Respuesta de la API:", data);
        // Aquí puedes reproducir la canción obtenida
        audioPlayer.current?.unloadAsync(); // Descargar la canción actual
        audioPlayer.current = null; // Limpiar el audio actual
        fetchAndPlaySong(data.id_cm); // Llama a la función para reproducir la canción
      }
    } catch (error) {
      console.error("⚠️ Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  }
  // Función para actualizar la barra de progreso
  const updateProgress = async (status: any) => {
    if (status.isLoaded && status.durationMillis) {
      setProgress(status.positionMillis / status.durationMillis);
    }
    // Verificar si la canción ha terminado
    if (status.positionMillis === status.durationMillis) {
      console.log("La canción ha terminado");
      // Aquí puedes realizar la acción que desees cuando termine la canción
      
      handleSongEnd(); // Función que manejaría la acción al terminar la canción
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
            Alert.alert("Canción añadida a la playlist.");
            if (data.success) {
              
            }
          } catch (error) {
            console.error("❌ Error al añadir canción a playlist:", error);
          }  
        };
        addSongToPlaylist();
        setModalVisible(false);  // Cerrar el modal después de seleccionar
      
      
    };
    type Content = {
      titulo: string;
      duracion: string;
      link_imagen: string;
      fecha_pub: string;
      posicion: number;
      artista: string;
      featurings: string[];
      podcast: string;
    };
    //Modal de la cola

    const [queueModalVisible, setQueueModalVisible] = useState(false);
    const [queue, setQueue] = useState<Content[]>([]);
    const toggleQueue = () => {
      
      const fetchQueue = async () => {
        try {
          const username = await getData("username");
          console.log("👤 Usuario obtenido:", username);
          const url = `https://spongefy-back-end.onrender.com/queue/show?nombre_usuario=${username}&posicion=0`;
          const response = await fetch(url);
          const data = await response.json();
          console.log("Respuesta de la API:", data);
          if (response.ok) {
            setQueue(data.cola);
            console.log("Cola obtenida:", queue); // Puedes hacer algo con las playlists si es necesario
          }
        } catch (error) {
          console.error("⚠️ Error en la solicitud:", error);
        }
      };
      fetchQueue();
      setQueueModalVisible(true);
    }
    const toggleBorrarQueue = async (borrar: boolean) => {
      const clearQueue = async () => {
        try {
          const username = await getData("username");
          const url = `https://spongefy-back-end.onrender.com/queue/clear`;
          const bodyData = {
            "nombre_usuario": username // Cambia esto por el nombre de usuario real
          }
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          });
          const data = await response.json();
          console.log("Respuesta de la API:", data);
        } catch (error) {
          console.error("❌ Error al borrar cola:", error);
        }

      }
      clearQueue();
      setQueue([]);
    };
    const toggleRandomQueue = async (aleatorio: boolean) => {
      const randomQueue = async () => {
        try {
          const username = await getData("username");
          const url = `https://spongefy-back-end.onrender.com/queue/shuffle`;
          const bodyData = {
            "nombre_usuario": username, // Cambia esto por el nombre de usuario real
            "posicion": 0
          }
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          });
          const data = await response.json();
          console.log("Respuesta de la API:", data);
        } catch (error) {
          console.error("❌ Error al aleatorizar cola:", error);
        }

      }
      randomQueue();
      const fetchQueue = async () => {
        try {
          const username = await getData("username");
          console.log("👤 Usuario obtenido:", username);
          const url = `https://spongefy-back-end.onrender.com/queue/show?nombre_usuario=${username}&posicion=0`;
          const response = await fetch(url);
          const data = await response.json();
          console.log("Respuesta de la API:", data);
          if (response.ok) {
            setQueue(data.cola);
            console.log("Cola obtenida:", queue); // Puedes hacer algo con las playlists si es necesario
          }
        } catch (error) {
          console.error("⚠️ Error en la solicitud:", error);
        }
      };
      fetchQueue();
    };

    const rotateInterpolate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "45deg"],
    });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.controlsContainer}>
          <View style={styles.songInfo}>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Pressable style={styles.controls}>
              <Image
                  source={require("../../assets/queue.png")}
                  style={styles.icon}
                />
            </Pressable>      
            <Pressable style={styles.controls}>
              <Image
                source={require("../../assets/anyadirplaylist.png")}
                style={styles.icon}
              />
            </Pressable>
            <Image
                source={require("../../assets/heart.png")}
                style={styles.icon}
              />
            <Pressable style={styles.controls}>
              
              <Animated.Image
                source={isPlaying ? require("../../assets/pause.png") : require("../../assets/play.png")}
                style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
                fadeDuration={2}
                />
            </Pressable>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    );
  }

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <View style={styles.controlsContainer}>
          <View style={styles.songInfo}>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Pressable style={styles.controls}>
              <Image
                  source={require("../../assets/queue.png")}
                  style={styles.icon}
                />
            </Pressable>      
            <Pressable style={styles.controls}>
              <Image
                source={require("../../assets/anyadirplaylist.png")}
                style={styles.icon}
              />
            </Pressable>
            <Image
                source={require("../../assets/heart.png")}
                style={styles.icon}
              />
            <Pressable style={styles.controls}>
              
              <Animated.Image
                source={isPlaying ? require("../../assets/pause.png") : require("../../assets/play.png")}
                style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
                fadeDuration={2}
                />
            </Pressable>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    );
  }

  const featuringArtists = currentSong.artistas_featuring
    ? currentSong.artistas_featuring.split(',').join(', ')
    : '';


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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Pressable onPress={() => toggleQueue()} style={styles.controls}>
            <Image
                source={require("../../assets/queue.png")}
                style={styles.icon}
              />
            </Pressable>
          {/* Modal de Queue */}
          <Modal visible={queueModalVisible} transparent animationType="slide">
            <View style={styles.modalContainerQueue}>
              <View style={styles.modalContentQueue}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={styles.modalTitleQueue}>Cola de Reproducción</Text>
                {/*Botón para aleatorizar la cola*/}
                <Pressable onPress={() => toggleRandomQueue(true)} style={styles.controls}>
                    <Image
                      source={require("../../assets/aleatorio.png")}
                      style={styles.icon}
                    />
                  </Pressable>
                {/* Botón para borrar la cola */}
                <Pressable onPress={() => toggleBorrarQueue(false)} style={styles.controls}>
                  <Image
                    source={require("../../assets/trash.png")}
                    style={styles.icon}
                  />
                </Pressable>
              </View>
                
                <FlatList
                  data={queue} // Excluye la canción actual
                  //keyExtractor={(index) => index.toString()} // Usamos el índice como clave
                  renderItem={({ item, index}) => {
                    const isCurrentSong = index === queueIndex; // Verifica si es la canción actual usando el índice
                    return(
                      <View style={[styles.queueItem, isCurrentSong && styles.currentSong]}>
                        <Text style={[styles.songTitle]}>
                          {item.titulo}
                        </Text>
                        <Text style={[styles.songArtists]}>
                          {item.artista}{item.featurings && `, ${item.featurings}`}
                        </Text>
                      </View>
                    );
                  }}
                />
                <TouchableOpacity
                  style={styles.closeButtonQueue}
                  onPress={() => setQueueModalVisible(false)}
                >
                  <Text style={styles.closeButtonTextQueue}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Pressable onPress={() => toggleAddtoPlaylist()} style={styles.controls}>
            <Image
              source={require("../../assets/anyadirplaylist.png")}
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
          <Image
              source={require("../../assets/heart.png")}
              style={styles.icon}
            />
          <Pressable onPress={togglePlayPause} style={styles.controls}>
            
            <Animated.Image
              source={isPlaying ? require("../../assets/pause.png") : require("../../assets/play.png")}
              style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
              fadeDuration={2}
              />
          </Pressable>
        </View>
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
    padding: 8,
    borderRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 1,
    minHeight: 39,
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
    gap: 0,
  },
  icon: {
    width: 15,
    height: 15,
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
    backgroundColor: "#CDCDCD",
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
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 3,
  },
  playlistText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#000000",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainerQueue: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentQueue: {
    width: '100%',
    height: '60%',
    backgroundColor: "#232323",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitleQueue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  queueItem: {
    padding: 10,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 3,
  },
  currentSong: {
    backgroundColor: "#A200F4",
    borderColor: "000",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 3,
  },
  closeButtonQueue: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    alignItems: "center",

  },
  closeButtonTextQueue: {
    color: "000",
    fontWeight: "bold",
  },
});

export default PlayerComponent;