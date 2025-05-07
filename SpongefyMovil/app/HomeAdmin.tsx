import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { getData } from "../utils/storage";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function GestionPerfilesScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const nombre = await getData("username");
      setUsername(nombre);
    };
    loadData();
  }, []);

  const handlePressArtistas = () => {
    // router.push("/gestionar-artistas");
  };

  const handlePressAutores = () => {
    // router.push("/gestionar-autores");
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

      {/* Botones */}
      <TouchableOpacity style={styles.button} onPress={handlePressArtistas}>
        <Ionicons name="mic" size={24} color="#fff" />
        <Text style={styles.buttonText}>Gestionar artistas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePressAutores}>
        <Ionicons name="mic-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Gestionar autores</Text>
      </TouchableOpacity>

      {/* Usuario abajo */}
      <View style={styles.footer}>
        <Text style={styles.usernameText}>{username}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginVertical: 30,
  },
  button: {
    backgroundColor: "#9400D3",
    width: "80%",
    padding: 18,
    marginVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 30,
  },
  usernameText: {
    color: "#fff",
    fontSize: 16,
  },
});
