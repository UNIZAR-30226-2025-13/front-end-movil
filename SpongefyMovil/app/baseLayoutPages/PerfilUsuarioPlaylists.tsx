import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getData } from '../../utils/storage';
import { fetchAndSavePublicPlaylists } from '@/utils/fetch';

interface Playlist {
  id_lista: number;
  nombre: string;
  color: string;
}

export default function PerfilUsuarioPlaylists() {

  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userName, setUser] = useState<any>(null);
  const [profileUsername, setProfileUsername] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [password, setPassword] = useState<string>('');
  const[showOptions, setShowOptions] = useState(false);
  const handleGoToPlaylist = (id_playlist: number) => {
    console.log("Boton Playlist pulsado para:", id_playlist);
    router.push(`./playlist/${id_playlist}`);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const token = await getData("token");
      console.log("Token:", token);
      const nombre_perfil = await getData("user");
      setProfileUsername(nombre_perfil);

      const nombre_usuario = await getData("username");
      setUser(nombre_usuario);
      
      await fetchAndSavePublicPlaylists(nombre_perfil);
      const datosPlaylistsPublicas = await getData("public_playlists");

      if (datosPlaylistsPublicas) {
        setPlaylists(datosPlaylistsPublicas || []);
      }


      if (nombre_usuario != nombre_perfil) {
          console.log("Llamada a checkIfFollowing");
          checkIfFollowing();
      }
    };


    const checkIfFollowing = async () => {
          
          try {
            const nombre_usuario = await getData("username");
            const nombre_usuario_a_seguir = await getData("user");
    
            const response = await fetch(
              `https://spongefy-back-end.onrender.com/is-a-follower-of-user?nombre_usuario=${nombre_usuario}&nombre_usuario_a_seguir=${nombre_usuario_a_seguir}`
            );
    
            if (!response.ok) {
              const errorResponse = await response.text();
              console.error("Error al comprobar si sigue:", errorResponse);
              return;
            }
    
            const result = await response.json();
    
            console.log("¿Sigue al usuario?:", result.es_seguidor);
    
            setIsFollowing(result.es_seguidor);
    
          } catch (error) {
            console.error("Error en checkIfFollowing:", error);
          }
    };

    loadProfile();
    
    // if (userName != profileUsername) {
    //       console.log("Llamada a checkIfFollowing");
    //       checkIfFollowing();
    // }

  }, []);
  const handleLogOut = async () => {
    
    router.push('../LoginScreen');
  };
  const handleEditProfile = () => {
    router.push('/baseLayoutPages/EditPerfil');
  };
  const handleElimProfile = async () => {
    const nombre_usuario = await getData("username");
    const bodyData = {
      "nombre_usuario": nombre_usuario,
      "contrasena": password,
    };
    const token = await getData("token");
    console.log("Token:", token);

    try {
      const response = await fetch("https://spongefy-back-end.onrender.com/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        console.log("Usuario eliminado correctamente");
        router.push('../LoginScreen');
      } else {
        console.error("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error en handleElimProfile:", error);
    }
  };

  const handleFollowUser = async () => {
    const nombre_usuario = await getData("username"); 
    const nombre_usuario_a_seguir = await getData("user");

    if (isFollowing) {
      try {
        const response = await fetch("https://spongefy-back-end.onrender.com/unfollow-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre_usuario,
            nombre_usuario_a_dejar_seguir: nombre_usuario_a_seguir,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Dejaste de seguir al usuario:", data);
          setIsFollowing(false);
        } else {
          console.error("Error al dejar de seguir al usuario:", data);
        }
      } catch (error) {
        console.error("Error en handleFollowUser (unfollow):", error);
      }
    } else {
      try {
        const response = await fetch("https://spongefy-back-end.onrender.com/follow-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre_usuario,
            nombre_usuario_a_seguir,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Ahora sigues al usuario:", data);
          setIsFollowing(true);
        } else {
          console.error("Error al seguir al usuario:", data);
        }
      } catch (error) {
        console.error("Error en handleFollowUser (follow):", error);
      }
    }
};


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
          <Text style={styles.username}>{profileUsername}</Text>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileUsername?.charAt(0).toUpperCase() ?? ''}
            </Text>
          </View>

          {userName === profileUsername ? (
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.friendButton} onPress={handleEditProfile}>
                <Text style={styles.friendButtonText}>Editar perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.friendButton} onPress={handleLogOut}>
                <Text style={styles.friendButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.eliminarButton} onPress={() => setShowOptions(true)}>
                <Text style={styles.eliminarButtonText}>Eliminar perfil</Text>
              </TouchableOpacity>
              {showOptions && (
                <View style={styles.optionsOverlay}>
                    <View style={styles.optionsMenu}>
                      <Text style={styles.infoText}>¿Estás seguro de que quieres eliminar tu perfil?</Text>
                      <Text style={styles.infoText}>Introduce tu contraseña para confirmar:</Text>
                      <TextInput
                          placeholder="Contraseña"
                          secureTextEntry
                          onChange={(e) => setPassword(e.nativeEvent.text)}
                          value={password}
                          style={{ width: "90%", alignSelf:'center', backgroundColor: "#777", borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 10 }}
                      />
                      <TouchableOpacity onPress={() => handleElimProfile()} style={styles.optionItem}>
                          <Text style={styles.optionText}>Eliminar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity onPress={() => setShowOptions(false)} style={styles.optionItem}>
                          <Text style={styles.optionText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity style={styles.friendButton} onPress={handleFollowUser}>
              <Text style={styles.friendButtonText}> {isFollowing === true ? "Siguiendo" : "+ Seguir"} </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.playlistGrid}>
          {Array.isArray(playlists) ? playlists.map((playlist, index) => (
            <View key={index} style={styles.playlistWrapper}>
              <TouchableOpacity onPress={() => handleGoToPlaylist(playlist.id_lista)} style={[styles.genreItem, { backgroundColor: playlist.color || '#ccc' }]}>
                <Text style={styles.playlistCardText}>{String(playlist.nombre)}</Text> {/* Texto negro encima */}
              </TouchableOpacity>
              <Text style={styles.playlistText}>{String(playlist.nombre)}</Text> {/* Texto blanco debajo */}
            </View>
          )) : (
            <Text style={styles.playlistTitle}>Este usuario no tiene listas</Text>
          )}
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
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
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
  followContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#ccc',
    fontSize: 14,
  },
  username: {
    fontSize: 40,
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
  friendsIcon: { width: 24, height: 24 },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  friendButton: {
    backgroundColor: '#A020F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  friendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  eliminarButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  eliminarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  playlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11,
    paddingVertical: 20,
  },
  optionsOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  optionsMenu: {
      width: 400,
      backgroundColor: '#6A0DAD',  // violet
      borderRadius: 12,
      paddingVertical: 8,
  },
  optionItem: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#ccc',
    width: '90%',
    borderWidth: 1,
    marginVertical: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoText: {
    alignItems: 'center',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
  },
  optionText: {
    fontWeight: 'bold',
    alignItems: 'center',
    color: '#fff',
    fontSize: 16,
  },

  playlistCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },

  playlistCardText: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playlistTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  playlistText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  genreItem: {
    width: 120,
    height: 120,
    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  playlistWrapper: {
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
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

});



