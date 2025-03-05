// songService.ts

import axios from 'axios';

export interface Song {
  link_cm?: string;
  link_imagen?: string;
  titulo?: string;
  autor?: string;
}

export const fetchSongById = async (id: string): Promise<Song | null> => {
  console.log("📡 Haciendo fetch a la API con ID:", id);
  
  try {
    const response = await fetch(`http://localhost:8080/play-song?id_cancion=${id}`);
    const data = await response.json();

    console.log("📥 Respuesta de la API:", data);
    
    if (!data || !data.link_cm) {
      console.error("🚨 La API no devolvió un link_cm válido:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Error en fetchSongById:", error);
    return null;
  }
};



