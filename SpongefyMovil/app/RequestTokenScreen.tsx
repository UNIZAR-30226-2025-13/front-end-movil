import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, ImageBackground, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendMail = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://spongefy-back-end.onrender.com/change-password-request?correo=${encodeURIComponent(email)}`, 
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al solicitar el token.");
      }
  
      Alert.alert("Éxito", "Revisa tu correo para obtener el código.");
      router.push("/ChangePasswordScreen");
    } catch (error) {
      console.error("Error en la solicitud de token:", error);
      Alert.alert("Error", "Error al solicitar el token.");
    }
  };

  const handleBack = () => {
    router.push('/LoginScreen');
  };

  return (
    <ImageBackground source={require("../assets/halfalogo.png")} style={styles.background}>
      
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={40} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.container}>
        <Text style={styles.title}>¿Has olvidado tu contraseña?</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electronico"
          placeholderTextColor="#888"
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendMail}>
          <Text style={styles.buttonText}>Recibir token</Text>
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
