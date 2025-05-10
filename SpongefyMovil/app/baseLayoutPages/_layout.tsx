// baseLayoutPages/_layout.tsx
import React from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Slot, router, useSegments } from "expo-router";
import PlayerComponent from "./PlayerComponent";
import { getData } from "@/utils/storage";
import { goToPerfil } from "@/utils/navigation";
import { usePlayer } from "./PlayerContext";



const Layout = () => {
  const { currentSong, isPlaying } = usePlayer();
  const segments: string[] = useSegments();
  const isOnPlaySong = segments.includes("PlaySong");

  const handlePerfilPropio = async () => {
    const username = await getData("username");
    //llama a goToPerfil con su propio nombre, para acceder a su perfil
    goToPerfil(username);
  };

    const goToFriends = () => {
    router.push('/baseLayoutPages/Friends');
  };


  return (
    <View style={styles.container}>
      {/* Contenido dinámico */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <Slot />
        </ScrollView>
      </View>

      {/* 🎵 Player abajo */}
      <View style={[styles.footer, { backgroundColor: "#111" }]}>
        {(!isOnPlaySong && currentSong) && (
          <PlayerComponent />
        )}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={() => router.push('/baseLayoutPages/home')}
          >
            <Ionicons name="home" size={24} color="#fff" />
            <Text style={styles.bottomBarText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={() => router.push('/baseLayoutPages/Biblioteca')}
          >
            <Ionicons name="library" size={24} color="#fff" />
            <Text style={styles.bottomBarText}>Tu biblioteca</Text>
          </TouchableOpacity>

        <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={goToFriends}
          >
            <FontAwesome name="users" size={24} color="#fff" />
            <Text style={styles.bottomBarText}>Amigos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={handlePerfilPropio}
          >
            <Ionicons name="person" size={24} color="#fff" />
            <Text style={styles.bottomBarText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
    width: 'auto',
    zIndex: 1,
  },
  bottomBar: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    paddingVertical: 8,
  },
  bottomBarItem: {
    alignItems: 'center',
  },
  bottomBarText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  }
});

export default Layout;
