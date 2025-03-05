// ArtistScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import BaseLayout from './BaseLayout';
import { usePlayer } from './PlayerContext';

const ArtistScreen = () => {
  const { fetchAndPlaySong } = usePlayer();

  const handlePlaySong = async () => {
    console.log('Botón presionado, llamando a fetchAndPlaySong...');
    await fetchAndPlaySong('25');
  };

  return (
    <BaseLayout>
      <View style={styles.artistContent}>
        <Text>Contenido de la pantalla del artista</Text>
        <Button title="Reproducir Canción 1" onPress={handlePlaySong} />
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  artistContent: {
    padding: 20,
  },
});

export default ArtistScreen;
