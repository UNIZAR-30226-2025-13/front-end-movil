import { saveData, getData, removeData } from "../utils/storage";
// 
// importar con: 
// import { fetchAndSavePlaylists } from "../utils/fetch";


export const fetchAndSavePlaylists = async (nombre_usuario) => {
  try {
      const response = await fetch(
          `https://spongefy-back-end.onrender.com/get-playlists?nombre_usuario=${nombre_usuario}`
      );

      if (!response.ok) {
          const errorResponse = await response.text(); // Obtener el cuerpo de la respuesta como texto
          console.error("Error en la respuesta del servidor:", errorResponse);
          throw new Error(`Error al obtener las playlists: ${response.status} - ${response.statusText}`);
      }

      const playlists = await response.json();

      await saveData("playlists", playlists);

      //console.log("Playlists guardadas correctamente:", playlists);
  } catch (error) {
      console.error("Error en fetchAndSavePlaylists:", error);
  }
};
