import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, TouchableWithoutFeedback, Pressable } from "react-native";
import { Audio } from "expo-av";
import { usePlayer } from "./PlayerContext";

const PlayerComponent = () => {
  const { currentSong, isPlaying, setIsPlaying } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Estado para la barra de progreso
  const audioPlayer = useRef<Audio.Sound | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!currentSong || !currentSong.link_cm) {
      console.error("❌ No se encontró el link_cm en la canción.");
      setIsLoading(false);
      return;
    }

    const loadAndPlaySong = async () => {
      setIsLoading(true);

      try {
        if (audioPlayer.current) {
          await audioPlayer.current.unloadAsync();
          audioPlayer.current = null;
        }

        const newSound = new Audio.Sound();
        await newSound.loadAsync({ uri: currentSong.link_cm as string });
        await newSound.playAsync();

        audioPlayer.current = newSound;
        setIsPlaying(true);

        Animated.timing(rotation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();

        // Escuchar el progreso de la canción
        newSound.setOnPlaybackStatusUpdate(updateProgress);
      } catch (error) {
        console.error("❌ Error cargando la canción:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndPlaySong();

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.unloadAsync();
      }
    };
  }, [currentSong]);

  // Función para actualizar la barra de progreso
  const updateProgress = async (status: any) => {
    if (status.isLoaded && status.durationMillis) {
      setProgress(status.positionMillis / status.durationMillis);
    }
  };

  const togglePlayPause = async () => {
    if (audioPlayer.current) {
      if (isPlaying) {
        await audioPlayer.current.pauseAsync();
      } else {
        await audioPlayer.current.playAsync();
      }
      setIsPlaying(!isPlaying);
      Animated.timing(rotation, {
        toValue: isPlaying ? 0 : 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  if (isLoading) {
    return <Text>Cargando canción...</Text>;
  }

  if (!currentSong) {
    return <Text>No se pudo cargar la canción.</Text>;
  }

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <View style={styles.songInfo}>
          {currentSong.link_imagen && (
            <Image source={{ uri: currentSong.link_imagen }} style={styles.songImage} />
          )}
          <View>
            <Text style={styles.songTitle}>{currentSong.titulo}</Text>
            <Text style={styles.songArtists}>{currentSong.autor}</Text>
          </View>
        </View>
        <Pressable onPress={togglePlayPause} style={styles.controls}>
          <Image
            source={require("../assets/anyadirplaylist.png")}
            style={styles.icon}
          />
          <Image
            source={require("../assets/heart.png")}
            style={styles.icon}
          />
          <Animated.Image
            source={isPlaying ? require("../assets/pause.png") : require("../assets/play.png")}
            style={[styles.icon, { transform: [{ rotate: rotateInterpolate }] }]}
            fadeDuration={2}
            />
        </Pressable>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#A200F4",
    padding: 15,
    borderRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
    width: "100%",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  songImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  songTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  songArtists: {
    color: "white",
    fontSize: 12,
  },
  progressBarContainer: {
    width: "95%",
    height: 2,
    backgroundColor: "transparent",
    borderRadius: 1,
    marginVertical: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: "white",
  },
});

export default PlayerComponent;