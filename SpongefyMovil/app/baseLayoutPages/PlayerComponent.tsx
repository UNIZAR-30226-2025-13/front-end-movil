import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Pressable, Modal, FlatList, TouchableOpacity, Alert, AppState } from "react-native";
import { Audio } from "expo-av";
import { useRouter } from 'expo-router';
import { usePlayer } from "./PlayerContext";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../utils/storage";
import { fetchAndSaveQueue, clearQueue, shuffleQueue, fetchAndSaveQueuePosition } from "@/utils/fetch";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
const PlayerComponent = () => {
  const { currentSong, isPlaying, setIsPlaying } = usePlayer();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Estado para la barra de progreso
  const audioPlayer = useRef<Audio.Sound | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const { fetchAndPlaySong } = usePlayer();
  const [time, setTime] = useState(0);
  // Listado de playlists estáticas (puedes agregar más si lo necesitas)
  /*
  const playlists = [
    { id: 1, nombre: "Playlist 1" },
    { id: 2, nombre: "Playlist 2" },
    { id: 3, nombre: "Playlist 3" },
  ];*/
  // Estado de la app
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // App se va a segundo plano o se cierra
      if (
        appState.current.match(/active/) &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        console.log('⏸ App en segundo plano o cerrada');
        saveCurrentSongState();
        audioPlayer.current.pauseAsync(); // Aquí haces lo que quieras al cerrar
      }

      // App vuelve a estar activa
      if (
        (appState.current === 'background' || appState.current === 'inactive') &&
        nextAppState === 'active'
      ) {
        console.log('▶️ App reactivada o abierta');
        restoreSongState(); // Aquí haces lo que quieras al reabrir
        audioPlayer.current.pauseAsync(); // Aquí haces lo que quieras al reabrir
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const saveCurrentSongState = async () => {
    // Llamada a la API para guardar el estado de la canción actual
    const username = await getData("username");
    console.log("👤 Usuario obtenido:", username);
    
    const url = `https://spongefy-back-end.onrender.com/save-last-playing`;
    const bodyData = {
      "nombre_usuario": username,
      "id_cm": currentSong?.id,
      "tiempo": time,
    }
    console.log("Body de la API:", bodyData);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    const data = await response.json();
    console.log("Respuesta de la API:", data);
    if (response.ok) {
      console.log("Estado de la canción guardado correctamente");
    } else {
      console.error("❌ Error al guardar el estado de la canción:", data);
    }
  };
  const restoreSongState = async () => {
    // Llamada a la API para restaurar el estado de la canción
    const username = await getData("username");
    console.log("👤 Usuario obtenido:", username);
    const url = `https://spongefy-back-end.onrender.com/recover-last-playing?nombre_usuario=${username}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Respuesta de la API:", data);
    if (response.ok) {
      console.log("Estado de la canción restaurado correctamente");
      // Aquí puedes usar el estado restaurado para reproducir la canción
      const restoredSong = data;
      if (restoredSong) {
        fetchAndPlaySong(restoredSong.id_cm);
      }
    } else {
      console.error("❌ Error al restaurar el estado de la canción:", data);
    }
  }
  
  
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
    const username = await getData("username");
    console.log("👤 Usuario obtenido:", username)
    const position = await getData("queuePosition");
    console.log("Posición de la cola:", position);
    await fetchAndSaveQueuePosition(username, position);
    await getData("queuePosition").then((data) => {
      console.log("Posición de la cola obtenida:", data);
      
    }).catch((error) => { 
      console.error("⚠️ Error al obtener la cola:", error);
    });
    
    
    //reproducir esa posicion de cola
    getData("queueSong").then((data) => {
      console.log("Cancion obtenida:", data);
      fetchAndPlaySong(data.id_cm);
      }).catch((error) => {
        console.error("⚠️ Error al obtener la siguiente canción:", error);
      });
  }
  
  // Función para actualizar la barra de progreso
  const updateProgress = async (status: any) => {
    if (status.isLoaded && status.durationMillis) {
      setProgress(status.positionMillis / status.durationMillis);
      setTime(status.positionMillis/1000);
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
  const [isFav, setIsFav] = useState(false);
  const toggleFavs = async () => {
    if (audioPlayer.current) {
      console.log("Canción actual:", currentSong);
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      if (isFav) {
        console.log("Cancion ya es favorita")
      } else {
        //logica de añadir a favoritos
        const url = `https://spongefy-back-end.onrender.com/add-to-favourites`;
        console.log("URL de la API:", url);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_cm: currentSong.id,
            nombre_usuario: username,
          }),
        });
        const data = await response.json();
        console.log("Respuesta de la API:", data);
        //await audioPlayer.current.playAsync();
      }
      setIsFav(!isFav);
      
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
      const username = await getData("username");
      const position = await getData("queuePosition");

      console.log("👤 Usuario obtenido:", username);
      console.log("Posición de la cola:", position);
      await fetchAndSaveQueue(username, position + 1);
      await getData("queue").then((data) => {
        console.log("Cola obtenida:", data);
        setQueue(data.cola);
      }
      ).catch((error) => {
        console.error("⚠️ Error al obtener la cola:", error);
      });
    };
    fetchQueue();
    setQueueModalVisible(true);
  }
  const toggleBorrarQueue = async () => {
    const elimQueue = async () => {
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      await clearQueue(username);
      console.log("Cola eliminada");

    }
    elimQueue();
    setQueue([]);
  };
  const toggleRandomQueue = async () => {
    const randomQueue = async () => {
      const username = await getData("username");
      const position = await getData("queuePosition");
      console.log("👤 Usuario obtenido:", username);
      console.log("Posición de la cola:", position);
      await shuffleQueue(username, position);
      console.log("Cola aleatorizada");

    }
    await randomQueue();
    const fetchQueue = async () => {
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      const position = await getData("queuePosition");
      console.log("Posición de la cola:", position);
      await fetchAndSaveQueue(username, position);
      await getData("queue").then((data) => {
        console.log("Cola obtenida:", data);
        setQueue(data.cola);
      }
      ).catch((error) => {
        console.error("⚠️ Error al obtener la cola:", error);
      });
    };
    await fetchQueue();
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  if (isLoading) {
    return (
      <Pressable
        style={styles.container}
        onPress={() => router.push("/baseLayoutPages/PlaySong")}    >
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
      </Pressable>
    );
  }

  if (!currentSong) {
    return (
      <Pressable
        style={styles.container}
        onPress={() => router.push("/baseLayoutPages/PlaySong")}    >
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
      </Pressable>
    );
  }

  const featuringArtists = currentSong.artistas_featuring
    ? currentSong.artistas_featuring.split(',').join(', ')
    : '';


  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push("/baseLayoutPages/PlaySong")}
          >      <View style={styles.controlsContainer}>
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
                  <Pressable onPress={() => toggleRandomQueue()} style={styles.controls}>
                    <Image
                      source={require("../../assets/aleatorio.png")}
                      style={styles.icon}
                    />
                  </Pressable>
                  {/* Botón para borrar la cola */}
                  <Pressable onPress={() => toggleBorrarQueue()} style={styles.controls}>
                    <Image
                      source={require("../../assets/trash.png")}
                      style={styles.icon}
                    />
                  </Pressable>
                </View>

                <FlatList
                  data= {queue} // Excluye la canción actual
                  //keyExtractor={(index) => index.toString()} // Usamos el índice como clave
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.queueItem}>
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
          <Pressable onPress={toggleFavs} style={styles.controls}>
            <Animated.Image
              source={isFav ? require("../../assets/heart.png") : require("../../assets/fav.png")}
              style={styles.icon}
            />
          </Pressable>
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
    </Pressable>
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
    width: 30,
    height: 30,
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