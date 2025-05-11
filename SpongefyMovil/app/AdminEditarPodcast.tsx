import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchandSaveAlbum } from "../utils/fetch";
import { getData } from "../utils/storage";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Album {
  id_album: string;
  creadores: string;
  fecha_pub: string;
  link_imagen: string;
  nombre_album: string;
}

export default function AdminNuevoAlbum() {
  const router = useRouter();
  const { artista } = useLocalSearchParams();
  const nombreArtista = artista as string;
  const {album} = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [creadores, setCreadores] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [fecha, setFecha] = useState("");
  const [albumData, setAlbumData] = useState<Album[]>([]);

  useEffect(() => {
      const loadData = async () => {
        await fetchandSaveAlbum(album);
        const data = await getData("album");
        setAlbumData(data);
        
      };
      loadData();
      
    }, []);

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || !creadores.trim() || !imagen) {
      Alert.alert("Error", "Completa todos los campos e incluye una imagen.");
      return;
    }

    const formData = new FormData();

    formData.append("nombre_album", nombre);
    formData.append("creadores", creadores);
    formData.append("fecha_pub", fecha);

    formData.append("imagen", {
      uri: imagen,
      name: "imagen.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/admin/upload-album", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", data.message || "Album creado con éxito");
        router.back(); // O redirige a otra pantalla
      } else {
        Alert.alert("Error", data.message || "No se pudo crear el creador");
      }
    } catch (error) {
      console.error("Error al crear creador:", error);
      Alert.alert("Error", "Algo salió mal");
    }
  };

  const handleCancelar = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Álbum de {nombreArtista}</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Introduce un titulo"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Creadores</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={creadores}
        onChangeText={setCreadores}
        placeholder="Introduce los colaboradores"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Fecha de Publicación</Text>
      <TextInput
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
        placeholder="Introduce un fecha de publicación (AAAA-MM-DD)"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
        <Text style={styles.imagePickerText}>
          {imagen ? "Cambiar Imagen" : "Seleccionar Portada"}
        </Text>
      </TouchableOpacity>

      {imagen && (
        <Image source={{ uri: imagen }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.button}  onPress={handleGuardar}>
        <Text style={styles.buttonText}>Crear Álbum</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonCancel} onPress={handleCancelar}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#aaa",
    marginTop: 15,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#333",
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#9400D3",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePicker: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  imagePickerText: {
    color: "#fff",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 15,
    alignSelf: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#9400D3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonCancel: {
    marginTop: 10,
    backgroundColor: "#444",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
