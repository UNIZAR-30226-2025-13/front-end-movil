import React, { createContext, useContext, useState, ReactNode } from "react";
import { Song } from "./songService";
import { fetchSongById } from "./songService";
import { getData } from "../utils/storage";
interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  fetchAndPlaySong: (id: string) => Promise<void>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const clearQueue = async () => {
    try {
      const username = await getData("username");
      const url = `https://spongefy-back-end.onrender.com/queue/clear`;
      const bodyData = {
        "nombre_usuario": username // Cambia esto por el nombre de usuario real
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      console.log("Respuesta de la API:", data);
    } catch (error) {
      console.error("❌ Error al borrar cola:", error);
    }
  }
  //clearQueue();
  const iniQueue = async () => {
    try {
      const username = await getData("username");
      console.log("👤 Usuario obtenido:", username);
      const bodyData = {
        "id_cm": currentSong?.id,
        "nombre_usuario": username, // Cambia esto por el nombre de usuario real
      }
      const url = `https://spongefy-back-end.onrender.com/queue/add`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      console.log("Respuesta de la API:", data);
      if (response.ok) {
        console.log("Cancion añadida:", currentSong?.id); // Puedes hacer algo con las playlists si es necesario
      }
    } catch (error) {
      console.error("⚠️ Error en la solicitud:", error);
    }
  };
  //iniQueue();
  const fetchAndPlaySong = async (id: string) => {
    console.log("📢 fetchAndPlaySong se está ejecutando con ID:", id);
  
    setCurrentSong(null); // 🔥 Forzar una actualización antes de asignar la nueva canción
  
    const song = await fetchSongById(id);
    console.log("🎵 Canción obtenida de fetchSongById:", song);
  
    if (song && song.link_cm) {
      setTimeout(() => {
        console.log("✅ Asignando currentSong en el estado:", song);
        setCurrentSong({ ...song }); // Clonamos el objeto para forzar cambio de estado
      }, 100);
    } else {
      console.error("❌ No se pudo cargar la canción. El link_cm es inválido.");
    }
  };
  
  
  
  

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, fetchAndPlaySong, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
