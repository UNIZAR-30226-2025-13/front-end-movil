import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, ImageBackground, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { saveData, getData, removeData } from "../../utils/storage";

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

     await saveData("username", username);

      // Redirigir a la pantalla principal
      router.push("/baseLayoutPages/home");

    } catch (error) {
      console.log("Error en el inicio de sesion");
      Alert.alert("Error", "Error en el inicio de sesión");
    }
  };

  const handleDebug = async () => {
    const usernamedebug = "maka";
    console.log("debug desde login con", usernamedebug);
    await saveData("username", usernamedebug);
    router.push("/baseLayoutPages/home");
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
    <ImageBackground source={require("../../assets/halfalogo.png")} style={styles.background}>
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
        <TouchableOpacity style={styles.button} onPress={handleDebug}>
          <Text style={styles.buttonText}>DEBUG</Text>
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
    backgroundColor: "#000"
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
