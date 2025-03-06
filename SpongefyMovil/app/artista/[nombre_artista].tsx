import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BaseLayout from '../BaseLayout';
import { fetchArtistByName } from '../songService';
import { usePlayer } from '../PlayerContext';

const ArtistScreen = () => {
  const { nombre_artista } = useLocalSearchParams<{ nombre_artista: string | string[] }>();
  const { fetchAndPlaySong } = usePlayer();

  const [artistData, setArtistData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      if (nombre_artista) {
        const artistName = Array.isArray(nombre_artista) ? nombre_artista[0] : nombre_artista;
        setIsLoading(true);
        try {
          const artist = await fetchArtistByName(artistName);
          if (artist) {
            setArtistData(artist);
            setError(null);
          } else {
            setError("No se encontraron datos del artista.");
          }
        } catch (err) {
          setError("Hubo un error al obtener la información del artista.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchArtistInfo();
  }, [nombre_artista]);

  return (
    <BaseLayout>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#8A2BE2" />
        ) : artistData ? (
          <>
            <View style={styles.header}>
              <Image source={{ uri: artistData.link_imagen }} style={styles.artistImage} />
              <View style={styles.artistInfo}>
                <View style={styles.artistLabel}>
                  <Text style={styles.artistLabelText}>Artista</Text>
                  <Image source={require("../../assets/certification.png")} style={styles.icon} />
                </View>
                <Text style={styles.artistName}>{artistData.nombre_artista}</Text>
                <View style={styles.followContainer}>
                  <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.followText}>+ Seguir</Text>
                  </TouchableOpacity>
                  <Text style={styles.followers}>{artistData.seguidores} seguidores</Text>
                </View>
              </View>
            </View>

            <View style={styles.favoriteSection}>
              <Text style={styles.sectionTitle}>Todas las canciones</Text>
              <View style={styles.favoriteImageContainer}>
                <Image source={{ uri: artistData.link_imagen }} style={styles.favoriteArtistImage} />
                <Image source={require("../../assets/heart.png")} style={styles.heartIcon} />
              </View>
            </View>

            <View style={styles.albumsWrapper}>
              <Text style={styles.section2Title}>Álbumes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumsContainer}>
                {artistData.albumes?.map((album: any) => (
                  <View key={album.id} style={styles.albumCard}>
                    <Image source={{ uri: album.link_imagen }} style={styles.albumImage} />
                    <Text style={styles.albumTitle}>{album.nombre_album}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.songsWrapper}>
              <Text style={styles.section2Title}>Canciones</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.songsContainer}>
                {artistData.canciones?.map((cancion: any) => (
                  <Pressable
                    key={cancion.id}
                    style={({ pressed }) => [
                      styles.songCard,
                      pressed && { opacity: 0.7 } // 🔥 Efecto visual al presionar
                    ]}
                    onPress={() => fetchAndPlaySong(cancion.id_cancion)}
                  >
                    <Image source={{ uri: cancion.link_imagen }} style={styles.songImage} />
                    <Text style={styles.songTitle}>{cancion.titulo}</Text>
                    <Text style={styles.artistTitle}>{cancion.nombre_artista}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'flex-start',
    padding: 20,
    overflowY: 'scroll',
  },
  header: {
    backgroundColor: '#666',
    padding: 20,
    borderRadius: 40,
    alignItems: 'flex-start',
    width: '100%',
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
});

export default ArtistScreen;
