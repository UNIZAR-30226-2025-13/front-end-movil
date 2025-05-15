import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getData, saveData } from "../utils/storage";
import { fetchAndSaveSearchHomeAll } from "../utils/fetch";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface Episodio {
    id_ep: number;
    nombre_ep: string;
    valoracion_del_usuario: number;
    valoracion_media: number;
    duracion: string;
    descripcion: string;
}



export default function AdminCanciones() {
  const router = useRouter();
  const [cancionSeleccionada, setCancionSeleccionada] = useState<number | null>(null);
  const [artistaTipo, setArtistaTipo] = useState<string | null>(null);
  const [nombreAlbum, setNombreAlbum] = useState<string | null>(null);
  const [Imagen, setImagen] = useState<string | null>(null);

  const [Episodios, setEpisodios] = useState<Episodio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [podcastData, setPodcastData] = useState<{
          nombre: string;
          imagen: string;
          tematicas: string;
          creadores: string;
          episodios: Array<{
              id_ep: number;
              nombre: string;
              valoracion_del_usuario: number;
              valoracion_media: number;
              duracion: string;
              descripcion: string;
          }>;
      }>({
          nombre: '',
          imagen: '#2F4F4F',
          tematicas: '',
          creadores: '',
          episodios: []
      });



useEffect(() => {
  const loadPlaylist = async () => {
    const id_podcast = await getData("podcastAdmin");
    if (!id_podcast) return;
    try {
      const username = await getData("username");
      const albumId = Array.isArray(id_podcast) ? id_podcast[0] : id_podcast;
      const url = `https://spongefy-back-end.onrender.com/get-podcast?id_podcast=${albumId}&nombre_usuario=${username}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        // console.log("Album data:", data);
        setPodcastData({
          nombre: data.podcast.nombre_podcast,
          imagen: data.podcast.link_imagen,
          tematicas: data.podcast.tematicas,
          creadores: data.creadores,
          episodios: data.episodios,
        });
        setImagen(data.podcast.link_imagen);
        setEpisodios(data.episodios);
        setNombreAlbum(data.podcast.nombre);
        console.log("Episodios:", data.episodios);
      } else {
        console.error("API error", data);
      }
    } catch (err) {
      console.error("Failed to load playlist:", err);
    }
  };

  loadPlaylist();
}, []);

  const handleSelect = (nombre: number) => {
    setCancionSeleccionada(nombre);
  };

  const handleNuevo = () => {
    router.push('/AdminNuevoEpisodio');
  };

  const handleEditar = async ()  => {
    const nombre = cancionSeleccionada;
    await saveData("idCancionEdit", cancionSeleccionada);
    router.push('./AdminEditarEpisodio');
  };

  const handleEliminar = async () => {
    if (!cancionSeleccionada) return;
  
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar a "${cancionSeleccionada}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch("https://spongefy-back-end.onrender.com/admin/delete-multimedia", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_cm: cancionSeleccionada }),
              });
  
              let data;
              try {
                data = await response.json();
              } catch (jsonError) {
                console.warn("No se pudo parsear JSON:", jsonError);
                console.log("Status:", response.status);
                console.log("Texto plano:", await response.text());
              }
  
              if (response.ok) {
                Alert.alert("Éxito", "Cancion eliminada con éxito.");
                setEpisodios((prev) =>
                prev.filter((c) => c.id_ep !== cancionSeleccionada));
                setCancionSeleccionada(null);
                setArtistaTipo(null);

              } else {
              }
            } catch (error) {
              console.error("Error en eliminación:", error);
              Alert.alert("Error", "Ocurrió un error inesperado.");
            }
          },
        },
      ]
    );
  };  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="play-circle" size={24} color="#fff" />
        <Text style={styles.headerText}>ADMINISTRADOR</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>GESTIONAR{"\n"}EPISODIOS </Text>

      {/* Lista de artistas */}
      <ScrollView style={styles.listContainer}>
  {/* Botón "Nuevo" */}
  <TouchableOpacity style={styles.artistItem} onPress={handleNuevo}>
    <View style={styles.newImage} />
    <Text style={styles.artistName}>Nuevo</Text>
  </TouchableOpacity>

  {Episodios.map((episodio) => {
    const isSelected = episodio.id_ep === cancionSeleccionada;

    return (
      <View key={episodio.id_ep}>
        <TouchableOpacity
          style={styles.artistItem}
          onPress={() =>
            handleSelect(episodio.id_ep)
          }
        >
          <Image source={{ uri: Imagen }} style={styles.artistImage} />
          <Text style={styles.artistName}>{episodio.nombre_ep}</Text>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleEditar}>
              <Ionicons name="pencil" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleEliminar}>
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  })}
</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 12,
    paddingHorizontal: 24,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  artistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 16,
  },
  artistItemSelected: {
    backgroundColor: "#9b59b6",
  },
  artistImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  newImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9b59b6",
    marginRight: 12,
  },
  artistName: {
    color: "#fff",
    fontSize: 16,
  },
  bottomBar: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  bottomBarItem: {
    alignItems: "center",
  },
  bottomBarText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  dropdownMenu: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 12,
    marginLeft: 52,
    marginBottom: 12,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#222",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },
});
