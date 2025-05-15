import React, { useState, useEffect, } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getData, saveData } from "../utils/storage";
import { fetchAndSaveAllCreators } from "../utils/fetch";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchArtistByName } from "./baseLayoutPages/songService";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

interface Album {
  id_album: string;
  link_imagen: string;
  nombre_album: string;
}

export default function GestionarAlbumesScreen() {
  const router = useRouter();
  const { artista } = useLocalSearchParams();
  const nombreArtista = artista as string;
  console.log("Nombre del artista:", nombreArtista);
  const [isLoading, setIsLoading] = useState(false);

  const [albumSeleccionado, setAlbumSeleccionado] = useState<string | null>(null);
  const [Albumes, setAlbumes] = useState<Album[]>([]);
  const [artistData, setArtistData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchArtistInfo = async () => {
          if (nombreArtista) {
            const artistName = Array.isArray(nombreArtista) ? nombreArtista[0] : nombreArtista;
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
    fetchArtistInfo();
  }, [nombreArtista]);
  useEffect(() => {
    if (artistData) {
      setAlbumes(artistData.albumes || []);
    }
  }, [artistData]);  // Esto se ejecuta solo cuando `artistData` cambia
  
  const handleSelect = (nombre: string) => {
    setAlbumSeleccionado(nombre);
  };

  const handleNuevo = () => {
    router.push(`/AdminNuevoAlbum?artista=${encodeURIComponent(nombreArtista)}`);
  };

  const handleEditar = async ()  => {
    const nombre = albumSeleccionado;
    if(!nombre) return;
    console.log("Nombre del album:", nombre);
    await saveData("albumEdit", albumSeleccionado);
    router.push(`/AdminEditarAlbum?artista=${encodeURIComponent(nombreArtista)}&album=${encodeURIComponent(albumSeleccionado)}`);
  };

  const handleEliminar = async () => {
    if (!albumSeleccionado) return;
  
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar el Album "${albumSeleccionado}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              // Aquí puedes realizar la lógica para eliminar el álbum
              const response = await fetch("https://spongefy-back-end.onrender.com/admin/delete-album", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ albumSeleccionado: albumSeleccionado }),
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
                Alert.alert("Éxito", "Album eliminado con éxito.");
                setAlbumSeleccionado(null);
                await fetchAndSaveAllCreators();
                const updatedData = await getData("allCreators");
                setAlbumes(updatedData.creadores || []);
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
  

  const handleAlbum = async () => {
    // setArtistaSeleccionado(nombre);

    await saveData("albumAdmin", albumSeleccionado);
    console.log(albumSeleccionado);
    router.push("/AdminCanciones");

  };



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="play-circle" size={24} color="#fff" />
        <Text style={styles.headerText}>ADMINISTRADOR</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>GESTIONAR{"\n"}ÁLBUMES DE {nombreArtista.toUpperCase()}</Text>

      {/* Lista de artistas */}
      <ScrollView style={styles.listContainer}>
  {/* Botón "Nuevo" */}
  <TouchableOpacity style={styles.artistItem} onPress={handleNuevo}>
    <View style={styles.newImage} />
    <Text style={styles.artistName}>Nuevo</Text>
  </TouchableOpacity>

  {Albumes.map((id_album) => {
    const isSelected = id_album.id_album === albumSeleccionado;

    return (
      <View key={id_album.nombre_album}>
        <TouchableOpacity
          style={styles.artistItem}
          onPress={() =>
            handleSelect(id_album.id_album)
          }
        >
          <Image source={{ uri: id_album.link_imagen }} style={styles.artistImage} />
          <Text style={styles.artistName}>{id_album.nombre_album}</Text>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleEditar}>
              <Ionicons name="pencil" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleAlbum}>
              <Ionicons name="albums" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Gestionar Canciones</Text>
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
