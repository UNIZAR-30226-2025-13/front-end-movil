import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, ImageBackground, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!username || !token || !newPassword) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
  
    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_usuario: username,
          token: token,
          nueva_contrasena: newPassword,
        }),
      });
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña.");
      }
  
      Alert.alert("Éxito", "Contraseña cambiada correctamente.");
      router.push("/LoginScreen");
  
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      Alert.alert("Error", "No se pudo cambiar la contraseña.");
    }
  };

  const handleBack = () => {
    // Regresa a la pantalla de login
    router.push('/LoginScreen');
  };

  return (
    <ImageBackground source={require("../assets/halfalogo.png")} style={styles.background}>
      
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={40} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.container}>
        <Text style={styles.title}>Cambiar Contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#888"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Token"
          placeholderTextColor="#888"
          onChangeText={setToken}
        />
          <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          placeholderTextColor="#888"
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Cambiar contrseña</Text>
        </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust as needed
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#9400D3",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  button2: {
    backgroundColor: "#ddd",
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonText2: {
    color: "#000",
    fontWeight: "bold",
  },
});
