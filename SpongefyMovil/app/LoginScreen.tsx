import React, { useState } from "react";
import {  Alert, Text, TextInput, TouchableOpacity, ImageBackground, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña

  const handlePressLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: username,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error();
      }

      Alert.alert("Éxito", "Inicio de sesión correcto");

      // Guardar token (puedes usar AsyncStorage para persistencia)
      console.log("Token:", data.token);

      // Redirigir a la pantalla principal
      router.push("/home");
    
    } catch (error) {
      Alert.alert("Error", "Error en el inicio de sesión");
    }
  };


  const handlePressRegister = () => {
    console.log("Register Pressed");
    router.push("/register");
  };

  const handlePressForgot = () => {
    console.log("Forgot Password Pressed");
    router.push("/RequestTokenScreen");
  };

  return (
    <ImageBackground source={require("../assets/halfalogo.png")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#888"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handlePressLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePressRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={handlePressForgot}>
          <Text style={styles.buttonText2}>He olvidado mi contraseña</Text>
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
