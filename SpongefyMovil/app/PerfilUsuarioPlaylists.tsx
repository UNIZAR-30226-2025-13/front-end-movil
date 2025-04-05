import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getData } from '../utils/storage';
import { fetchAndSavePublicPlaylists } from '@/utils/fetch';

const ArtistScreen = () => {
    
    const router = useRouter();
    const [playlists, setPlaylists] = useState(null);
    const [artistData, setArtistData] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const nombre_usuario = await getData("user");
            await fetchAndSavePublicPlaylists(nombre_usuario); 
            const datosPlaylistsPublicas = await getData("public_playlists");
        
            if (datosPlaylistsPublicas) {
                const playlistsObj = JSON.parse(datosPlaylistsPublicas);
                setPlaylists(playlistsObj);
            }
        };
    
        loadProfile();
    }, []);

//   const checkIfFollowing = async () => {
//     try {
//       const nombre_usuario = await getData("username");
//       const nombre_creador = await getData("artist");
  
//       if (!nombre_usuario || !nombre_creador) return;
  
//       const response = await fetch(
//         `https://spongefy-back-end.onrender.com/is-a-follower-of-creator?nombre_usuario=${nombre_usuario}&nombre_creador=${nombre_creador}`
//       );
  
//       if (!response.ok) {
//         const errorResponse = await response.text();
//         console.error("Error al comprobar si sigue:", errorResponse);
//         return;
//       }
  
//       const result = await response.json();

//       console.log("¿Sigue al artista?:", result.es_seguidor);

//       setIsFollowing(result.es_seguidor);
  
//     } catch (error) {
//       console.error("Error en checkIfFollowing:", error);
//     }
//   };

//   fetchArtistInfo();
//   checkIfFollowing();
// }, [nombre_artista]);



    // const handleFollow = async () => {
    //   const nombre_usuario = await getData("username");
    //   const nombre_creador = await getData("artist");
    
    //   if (isFollowing) {
    //     try {
    //       const response = await fetch("https://spongefy-back-end.onrender.com/unfollow-creator", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           nombre_usuario,
    //           nombre_creador,
    //         }),
    //       });
    
    //       const data = await response.json();
    
    //       if (response.ok) {
    //         console.log("Ya no sigues al creador:", data);
    //         setIsFollowing(false);
    //       } else {
    //         console.error("Error al dejar de seguir al creador:", data);
    //       }
    //     } catch (error) {
    //       console.error("Error en handleFollow:", error);
    //     }
    //   } else {
    //     try {
    //       const response = await fetch("https://spongefy-back-end.onrender.com/follow-creator", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           nombre_usuario,
    //           nombre_creador,
    //         }),
    //       });
    
    //       const data = await response.json();
    
    //       if (response.ok) {
    //         console.log("Ahora sigues al creador:", data);
    //         setIsFollowing(true);
    //       } else {
    //         console.error("Error al seguir al creador:", data);
    //       }
    //     } catch (error) {
    //       console.error("Error en handleFollow:", error);
    //     }
    //   }
    // };

    return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
      
            {/* Botón atrás */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
      
            {/* Cabecera */}
            <View style={styles.header}>
              <Text style={styles.label}>Usuario</Text>
              <Text style={styles.username}>{artistData?.nombre_usuario || "nombre_usuario"}</Text>
      
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(artistData?.nombre_usuario || "mario")[0].toUpperCase()}
                </Text>
              </View>
      
              <TouchableOpacity style={styles.friendButton}>
                <Text style={styles.friendButtonText}>+ Solicitud de amistad</Text>
              </TouchableOpacity>
            </View>
      
            {/* Grid de playlists */}
            <View style={styles.playlistGrid}>
              {playlists?.map((playlist, index) => (
                <TouchableOpacity key={index} style={[styles.playlistCard, { backgroundColor: playlist.color || '#ccc' }]}>
                  <Text style={styles.playlistTitle}>{playlist.nombre}</Text>
                  <Text style={styles.playlistSubtitle}>Mi playlist</Text>
                </TouchableOpacity>
              ))}
            </View>
      
          </ScrollView>
        </View>
      );


};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#666',
    padding: 20,
    borderRadius: 40,
    alignItems: 'flex-start',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#4B2E83', // morado oscuro
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
  },
  username: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  friendButton: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  friendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  playlistCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  playlistTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  playlistSubtitle: {
    fontSize: 14,
    color: '#000',
    opacity: 0.7,
  },
  bottomBar: {
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
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 5,
  },
  artistInfo: {
    alignItems: 'flex-start',
  },
  artistLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistLabelText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5,
  },
  artistName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  followContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#A020F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  followers: {
    fontSize: 14,
    color: '#fff',
  },
  favoriteSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  favoriteImageContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  favoriteArtistImage: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },
  heartIcon: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  sectionTitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'right',
    width: 150,
    marginRight: 20,
    fontWeight: 'bold',
  },
  section2Title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  albumCard: {
    width: 100,
    marginRight: 10,
  },
  albumImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  albumTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  songCard: {
    width: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  songImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  songTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  artistTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  icon: {
    width: 15,
    height: 15,
  },
  albumsWrapper: {
    width: '100%',
  },
  albumsContainer: {
    flexDirection: 'row',
  },
  songsWrapper: {
    width: '100%',
  },
  songsContainer: {
    flexDirection: 'row',
  },
  // Estilos para el Modal
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#A200F4",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ArtistScreen;
