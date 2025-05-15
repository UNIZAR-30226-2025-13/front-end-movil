import React, { useState, useEffect } from "react";
import {
  View, ScrollView, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getData } from "../utils/storage";

export default function AdminEditarCancion() {
  const router = useRouter();

  const [id, setId] = useState(""); // ID del contenido multimedia
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
    const cargarDatos = async () => {
      const id_cancion = await getData("idCancionEdit");
      const artista = await getData("creatorEdit");
      setId(id_cancion.toString());
      setCreador(artista);
    };
    cargarDatos();
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
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.assets && result.assets.length > 0) {
      setAudio(result.assets[0]);
    }
  };

  const handleActualizar = async () => {
    if (!id || !titulo || !fecha || !letra || !creador) {
      Alert.alert("Error", "Faltan campos obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("id_cm", id);
    formData.append("titulo", titulo);
    formData.append("creador", creador);
    formData.append("es_cancion", "true");
    formData.append("fecha_pub", fecha);
    formData.append("letra", letra);

    if (featurings) {
      featurings.split(",").map(f => formData.append("featurings", f.trim()));
    }

    if (generos) {
      generos.split(",").map(g => formData.append("generos", g.trim()));
    }

    if (idiomas) {
      idiomas.split(",").map(i => formData.append("idiomas", i.trim()));
    }

    const id_album = await getData("albumAdmin");
    if (id_album) formData.append("id_album", id_album);

    if (imagen && imagen.startsWith("file")) {
      formData.append("imagen", {
        uri: imagen,
        name: "imagen.jpg",
        type: "image/jpeg",
      } as any);
    }

    if (audio) {
      formData.append("audio", {
        uri: audio.uri,
        name: audio.name,
        type: "audio/mpeg",
      } as any);
    }

    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/admin/update-multimedia", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", data.message || "Canción actualizada con éxito");
        router.back();
      } else {
        Alert.alert("Error", data.message || "No se pudo actualizar");
        console.error("Error al actualizar:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Fallo en la actualización");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Editar Canción</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Letra</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={letra} onChangeText={setLetra} multiline />

        <Text style={styles.label}>Fecha de publicación</Text>
        <TextInput style={styles.input} value={fecha} onChangeText={setFecha} />

        <Text style={styles.label}>Featurings</Text>
        <TextInput style={styles.input} value={featurings} onChangeText={setFeaturings} />

        <Text style={styles.label}>Géneros</Text>
        <TextInput style={styles.input} value={generos} onChangeText={setGeneros} />

        <Text style={styles.label}>Idiomas</Text>
        <TextInput style={styles.input} value={idiomas} onChangeText={setIdiomas} />

        <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
          <Text style={styles.imagePickerText}>{imagen ? "Cambiar Imagen" : "Seleccionar Imagen"}</Text>
        </TouchableOpacity>

        {imagen && <Image source={{ uri: imagen }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.imagePicker} onPress={seleccionarAudio}>
          <Text style={styles.imagePickerText}>{audio ? "Cambiar Audio" : "Seleccionar Audio"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleActualizar}>
          <Text style={styles.imagePickerText}>Actualizar Canción</Text>
        </TouchableOpacity>
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

