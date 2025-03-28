// importar esta biblioteca con: 
// import { fetchAndSavePlaylists, fetchAndSaveHomeData, fetchAndSaveHomeMusicData } from "../utils/fetch";

import { saveData, getData, removeData } from "../utils/storage";

//todas las playlists del usuario, incluyendo las de las carpetas
export const fetchAndSaveAllPlaylists = async (nombre_usuario) => {
  try {
      const response = await fetch(
          `https://spongefy-back-end.onrender.com/get-playlists?nombre_usuario=${nombre_usuario}`
      );

      if (!response.ok) {
          const errorResponse = await response.text(); 
          console.error("Error en la respuesta del servidor:", errorResponse);
          throw new Error(`Error al obtener las playlists: ${response.status} - ${response.statusText}`);
      }

      const playlists = await response.json();

      await saveData("playlists", playlists);

      //console.log("Playlists guardadas correctamente:", playlists);
  } catch (error) {
      console.error("Error en fetchAndSaveAllPlaylists:", error);
  }
};


//todo el contenido de la biblioteca
export const fetchAndSaveLibrary = async (nombre_usuario) => {
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/get-user-library?nombre_usuario=${nombre_usuario}`
        );
  
        if (!response.ok) {
            const errorResponse = await response.text(); 
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener la biblioteca: ${response.status} - ${response.statusText}`);
        }
  
        const library = await response.json();
  
        await saveData("library", library);
  
        //console.log("Datos biblioteca guardados correctamente:", library);
    } catch (error) {
        console.error("Error en fetchAndSaveLibrary:", error);
    }
  };



export const fetchAndSaveHomeData = async () => {
    try {
        const response = await fetch(`https://spongefy-back-end.onrender.com/home`);

        if (!response.ok) {
            const errorResponse = await response.text(); 
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener los datos de home: ${response.status} - ${response.statusText}`);
        }

        const homeData = await response.json();

        await saveData("home", homeData);

        //console.log("Datos de Home guardados correctamente:", homeData);

    } catch (error) {
        console.error("Error en fetchAndSaveHomeData:", error);
    }
};



export const fetchAndSaveHomeMusicData = async () => {
    try {
        const response = await fetch(`https://spongefy-back-end.onrender.com/home-music`);

        if (!response.ok) {
            const errorResponse = await response.text(); 
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener los datos de home: ${response.status} - ${response.statusText}`);
        }

        const homeMusicData = await response.json();

        await saveData("homeMusic", homeMusicData);

        //console.log("Datos de Home Music guardados correctamente:", homeMusicData);
    } catch (error) {
        console.error("Error en fetchAndSaveHomeMusicData:", error);
    }
};


export const fetchAndSaveHomePodcastData = async () => {
    try {
        const response = await fetch(`https://spongefy-back-end.onrender.com/home-podcast`);

        if (!response.ok) {
            const errorResponse = await response.text(); 
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener los datos de home: ${response.status} - ${response.statusText}`);
        }

        const homePodcastData = await response.json();

        await saveData("homePodcast", homePodcastData);

        //console.log("Datos de Home Podcast guardados correctamente:", homePodcastData);
    } catch (error) {
        console.error("Error en fetchAndSaveHomePodcastData:", error);
    }
};

//busqueda general en home
export const fetchAndSaveSearchHomeAll = async (cadena) => {
    console.log("fetchAndSaveSearchHomeAll se ejecuta con cadena:", cadena);
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/search?cadena=${cadena}`
        );
  
        if (!response.ok) {
            const errorResponse = await response.text(); 
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener las playlists: ${response.status} - ${response.statusText}`);
        }
  
        const busqueda_general = await response.json();
        console.log("Respuesta de la API:", busqueda_general);
        await saveData("searchGlobal", busqueda_general);
  
        console.log("Resultados de búsqueda guardados correctamente:", busqueda_general);
    } catch (error) {
        console.error("Error en fetchAndSaveSearchHomeAll:", error);
    }
};
