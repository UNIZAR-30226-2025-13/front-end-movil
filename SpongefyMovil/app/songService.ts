// songService.ts

import axios from 'axios';

export interface Song {
  link_cm?: string;
  link_imagen?: string;
  titulo?: string;
  autor?: string;
  artistas_featuring? : string;
}

export const fetchSongById = async (id: string): Promise<Song | null> => {  
  try {
    const response = await fetch(`https://spongefy-back-end.onrender.com/play-song?id_cancion=${id}`);
    const data = await response.json();

    console.log("📥 Respuesta de la API:", data);
    
    if (!data || !data.link_cm) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
};

export const fetchArtistByName = async (nombre_artista: string): Promise<Song | null> => {  
  try {
    const nombre_artista_encoded = encodeURIComponent(nombre_artista);
    const response = await fetch(`http://localhost:8080/artist?nombre_artista=${nombre_artista_encoded}`);
    const data = await response.json();

    console.log("📥 Respuesta de la API:", data);


    return data;
  } catch (error) {
    console.error("❌ Error en fetchSongById:", error);
    return null;
  }
};



