import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Pressable, Modal } from 'react-native';
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
  const handleGoToPlaylist = (id_playlist: number) => {
    console.log("Boton Playlist pulsado para:", id_playlist);
    router.push(`./playlist/${id_playlist}`);
  };
  const goToFriends = () => {
    router.push('/baseLayoutPages/Friends');
  };


  useEffect(() => {
    const loadProfile = async () => {

      const nombre_perfil = await getData("user");
      setProfileUsername(nombre_perfil);

      const nombre_usuario = await getData("username");
      setUser(nombre_usuario);
      


      await fetchAndSavePublicPlaylists(nombre_perfil);
      const datosPlaylistsPublicas = await getData("public_playlists");

      if (datosPlaylistsPublicas) {
        setPlaylists(datosPlaylistsPublicas || []);
      }

    };

    loadProfile();

  }, []);
  const handleEditProfile = () => {
    router.push('/baseLayoutPages/EditPerfil');
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

        {userName === profileUsername && (
          <TouchableOpacity onPress={goToFriends}>
            <Image
              source={require('../../assets/friends.png')}
              style={styles.friendsIcon}
            />
          </TouchableOpacity>
        )}

          <Text style={styles.label}>Usuario</Text>
          <Text style={styles.username}>{profileUsername}</Text>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileUsername?.charAt(0).toUpperCase() ?? ''}
            </Text>
          </View>

          {userName === profileUsername ? (
            <TouchableOpacity style={styles.friendButton} onPress={handleEditProfile}>
              <Text style={styles.friendButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.friendButton}>
              <Text style={styles.friendButtonText}>+ Solicitud de amistad</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.playlistGrid}>
          {Array.isArray(playlists) ? playlists.map((playlist, index) => (
            <View key={index} style={styles.playlistWrapper}>
              <TouchableOpacity onPress={() => handleGoToPlaylist(playlist.id_lista)} style={[styles.genreItem, { backgroundColor: playlist.color || '#ccc' }]}>
                <Text style={styles.playlistCardText}>{playlist.nombre}</Text> {/* Texto negro encima */}
              </TouchableOpacity>
              <Text style={styles.playlistText}>{playlist.nombre}</Text> {/* Texto blanco debajo */}
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
    backgroundColor: '#4B2E83',
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
    gap: 11,
    paddingVertical: 20,
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

});



