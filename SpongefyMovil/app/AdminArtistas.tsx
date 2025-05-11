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
import { useRouter } from "expo-router";
import { getData, saveData } from "../utils/storage";
import { fetchAndSaveAllCreators } from "../utils/fetch";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface Artista {
  nombre_creador: string;
  link_imagen: string;
  similitud: number;
  tipo: string;
}

export default function GestionArtistasScreen() {
  const router = useRouter();
  const [artistaSeleccionado, setArtistaSeleccionado] = useState<string | null>(null);
  const [artistaTipo, setArtistaTipo] = useState<string | null>(null);
  const [Artistas, setArtistas] = useState<Artista[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchAndSaveAllCreators();
      const data = await getData("allCreators");
      setArtistas(data.creadores || []);
    };
    loadData();
  }, []);

  const handleSelect = (nombre: string, tipo: string) => {
    setArtistaSeleccionado(nombre);
    setArtistaTipo(tipo);
  };

  const handleNuevo = () => {
    router.push('/AdminNuevoCreador');
  };

  const handleEditar = async ()  => {
    const nombre = artistaSeleccionado;
    await saveData("creatorEdit", artistaSeleccionado);
    router.push('/AdminEditarCreador');
  };

  const handleEliminar = async () => {
    if (!artistaSeleccionado) return;
  
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar a "${artistaSeleccionado}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch("https://spongefy-back-end.onrender.com/admin/delete-creator", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre_creador: artistaSeleccionado }),
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
                Alert.alert("Éxito", "Creador eliminado con éxito.");
                setArtistaSeleccionado(null);
                setArtistaTipo(null);
                await fetchAndSaveAllCreators();
                const updatedData = await getData("allCreators");
                setArtistas(updatedData.creadores || []);
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
  

  const handleAlbum = (artista: string) => {
    // setArtistaSeleccionado(nombre);
    router.push(`/AdminAlbumes?artista=${encodeURIComponent(artista)}`);
  };



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="play-circle" size={24} color="#fff" />
        <Text style={styles.headerText}>ADMINISTRADOR</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>GESTIONAR{"\n"}CREADORES</Text>

      {/* Lista de artistas */}
      <ScrollView style={styles.listContainer}>
  {/* Botón "Nuevo" */}
  <TouchableOpacity style={styles.artistItem} onPress={handleNuevo}>
    <View style={styles.newImage} />
    <Text style={styles.artistName}>Nuevo</Text>
  </TouchableOpacity>

  {Artistas.map((artista) => {
    const isSelected = artista.nombre_creador === artistaSeleccionado;

    return (
      <View key={artista.nombre_creador}>
        <TouchableOpacity
          style={styles.artistItem}
          onPress={() =>
            handleSelect(artista.nombre_creador, artista.tipo)
          }
        >
          <Image source={{ uri: artista.link_imagen }} style={styles.artistImage} />
          <Text style={styles.artistName}>{artista.nombre_creador}</Text>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleEditar}>
              <Ionicons name="pencil" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={ () => handleAlbum(artista.nombre_creador) }>
              <Ionicons name="albums" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Gestionar Álbumes</Text>
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
