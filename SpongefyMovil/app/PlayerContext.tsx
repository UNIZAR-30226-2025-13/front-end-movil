import React, { createContext, useContext, useState, ReactNode } from "react";
import { Song } from "./songService";
import { fetchSongById } from "./songService";

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
