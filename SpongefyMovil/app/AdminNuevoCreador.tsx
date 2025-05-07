import React, { useState } from "react";
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
import { useRouter } from "expo-router";

export default function AdminNuevoCreador() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [biografia, setBiografia] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [esPodcaster, setEsPodcaster] = useState(false);

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
    if (!nombre.trim() || !biografia.trim() || !imagen) {
      Alert.alert("Error", "Completa todos los campos e incluye una imagen.");
      return;
    }

    const formData = new FormData();

    formData.append("nombre_creador", nombre);
    formData.append("biografia", biografia);
    formData.append("es_podcaster", esPodcaster.toString());

    formData.append("imagen", {
      uri: imagen,
      name: "imagen.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/admin/upload-creator", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", data.message || "Creador creado con éxito");
        router.back(); // O redirige a otra pantalla
      } else {
        Alert.alert("Error", data.message || "No se pudo crear el creador");
      }
    } catch (error) {
      console.error("Error al crear creador:", error);
      Alert.alert("Error", "Algo salió mal");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Creador</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Introduce un nombre"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Biografía</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={biografia}
        onChangeText={setBiografia}
        placeholder="Escribe una biografía..."
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setEsPodcaster(false)}
          style={[
            styles.toggleButton,
            !esPodcaster && styles.toggleButtonActive,
          ]}
        >
          <Text style={styles.toggleText}>Artista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEsPodcaster(true)}
          style={[
            styles.toggleButton,
            esPodcaster && styles.toggleButtonActive,
          ]}
        >
          <Text style={styles.toggleText}>Podcaster</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
        <Text style={styles.imagePickerText}>
          {imagen ? "Cambiar Imagen" : "Seleccionar Imagen"}
        </Text>
      </TouchableOpacity>

      {imagen && (
        <Image source={{ uri: imagen }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Crear Creador</Text>
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
