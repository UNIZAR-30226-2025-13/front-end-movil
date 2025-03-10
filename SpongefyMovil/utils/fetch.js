import { saveData, getData, removeData } from "../utils/storage";
// 
// importar con: 
// import { fetchAndSavePlaylists } from "../utils/fetch";


export const fetchAndSavePlaylists = async (nombre_usuario) => {
    try {
      const response = await fetch(
        `https://spongefy-back-end.onrender.com/getPlaylists?nombre_usuario=${nombre_usuario}`
      );
  
      if (!response.ok) {
        throw new Error("Error al obtener las playlists");
      }
  
      const playlists = await response.json();
  
      await saveData("playlists", playlists);
  
      console.log("Playlists guardadas correctamente");
    } catch (error) {
      console.error("Error en fetchAndSavePlaylists:", error);
    }
  };
