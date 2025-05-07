import React, { useEffect, useState } from "react";
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
import { getData } from "../utils/storage";
import { useRouter } from "expo-router";

export default function AdminEditarCreador() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [biografia, setBiografia] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const nombreGuardado = await getData("creatorEdit");
      setNombre(nombreGuardado);
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

  const handleGuardar = async () => {
    const formData = new FormData();

    formData.append("nombre_creador", nombre);
    if (biografia.trim() !== "") {
      formData.append("biografia", biografia);
    }
    if (imagen) {
      formData.append("imagen", {
        uri: imagen,
        name: "imagen.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/admin/update-creator", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", data.message || "Creador actualizado con éxito");
        router.back();
      } else {
        Alert.alert("Error", data.message || "No se pudo actualizar");
      }
    } catch (error) {
      console.error("Error al actualizar creador:", error);
      Alert.alert("Error", "Algo salió mal");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Creador</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        editable={false} // No editable según la API
      />

      <Text style={styles.label}>Biografía</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={biografia}
        onChangeText={setBiografia}
        placeholder="Escribe una nueva biografía..."
      />

      <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
        <Text style={styles.imagePickerText}>
          {imagen ? "Cambiar Imagen" : "Seleccionar Imagen"}
        </Text>
      </TouchableOpacity>

      {imagen && (
        <Image source={{ uri: imagen }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
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
  imagePicker: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
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
