import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getData } from "../utils/storage";

export default function AdminNuevaCancion() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [letra, setLetra] = useState("");
  const [featurings, setFeaturings] = useState("");
  const [generos, setGeneros] = useState("");
  const [fecha, setFecha] = useState("");
  const [idiomas, setIdiomas] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [audio, setAudio] = useState<any>(null);
  const [creador, setCreador] = useState("");

  useEffect(() => {
    const cargarNombreCreador = async () => {
      const nombre = await getData("creatorEdit");
      if (nombre) setCreador(nombre);
    };
    cargarNombreCreador();
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

  const seleccionarAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });

    if (result.assets && result.assets.length > 0) {
      setAudio(result.assets[0]);
    }
  };

  const handleGuardar = async () => {
    if (!titulo || !fecha || !letra || !imagen || !audio || !creador) {
      Alert.alert("Error", "Completa todos los campos obligatorios.");
      return;
    }

    const id_album = await getData("albumAdmin");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("creador", creador);
    formData.append("es_cancion", "true");
    formData.append("fecha_pub", fecha);
    formData.append("letra", letra);
    if (featurings) formData.append("featurings", featurings);
    if (generos) formData.append("generos", generos);
    if (idiomas) formData.append("idiomas", idiomas);
    if (id_album) formData.append("id_album", id_album);

    formData.append("imagen", {
      uri: imagen,
      name: "imagen.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("audio", {
      uri: audio.uri,
      name: audio.name,
      type: "audio/mpeg",
    } as any);

    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/admin/upload-multimedia", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", data.message || "Canción subida con éxito");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Error al subir la canción");
        console.error("Error al subir canción:", data.message);
      }
    } catch (error) {
      console.error("Error al subir canción:", error);
      Alert.alert("Error", "Algo salió mal");
    }
  };

  return (
    <View style={styles.container}>
    <ScrollView style={styles.container}> 
      <Text style={styles.title}>Nueva Canción</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Introduce un título"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Letra</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={letra}
        onChangeText={setLetra}
        multiline
        placeholder="Letra de la canción"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Fecha de publicación (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
        placeholder="2025-05-14"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Featurings</Text>
      <TextInput
        style={styles.input}
        value={featurings}
        onChangeText={setFeaturings}
        placeholder="Artistas invitados"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Géneros</Text>
      <TextInput
        style={styles.input}
        value={generos}
        onChangeText={setGeneros}
        placeholder="Pop, Rock, Jazz..."
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Idiomas</Text>
      <TextInput
        style={styles.input}
        value={idiomas}
        onChangeText={setIdiomas}
        placeholder="Español, Inglés..."
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
        <Text style={styles.imagePickerText}>
          {imagen ? "Cambiar Imagen" : "Seleccionar Imagen"}
        </Text>
      </TouchableOpacity>

      {imagen && <Image source={{ uri: imagen }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.imagePicker} onPress={seleccionarAudio}>
        <Text style={styles.imagePickerText}>
          {audio ? "Cambiar Audio" : "Seleccionar Audio"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.imagePickerText}>
          {"Subir Cancion"}
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Subir Canción</Text>
      </TouchableOpacity> */}
      
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
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
  imagePicker: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  imagePickerText: {
    color: "#fff",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#9400D3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
