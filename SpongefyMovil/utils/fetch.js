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

        console.log("Playlists guardadas correctamente:", playlists);
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

        // console.log("Datos de Home guardados correctamente:", homeData);

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

        // console.log("Datos de Home Podcast guardados correctamente:", homePodcastData);
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


//todas las playlist de una carpeta
export const fetchAndSaveFolder = async (id_carpeta) => {
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/get-folder?id_carpeta=${id_carpeta}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener la carpeta: ${response.status} - ${response.statusText}`);
        }

        const folder = await response.json();

        await saveData("folder", folder);

        //console.log("Datos carpeta guardados correctamente:", folder);
    } catch (error) {
        console.error("Error en fetchAndSaveFolder:", error);
    }
};

//   //los datos de perfil del propio usuario
//export const fetchAndSaveProfile = async (nombre_usuario) => {
//         try {
//         const response = await fetch(
//             `https://spongefy-back-end.onrender.com/perfil?nombre_usuario=${nombre_usuario}`
//         );

//         if (!response.ok) {
//             const errorResponse = await response.text(); 
//             console.error("Error en la respuesta del servidor:", errorResponse);
//             throw new Error(`Error al obtener el perfil: ${response.status} - ${response.statusText}`);
//         }

//         const userProfile = await response.json();

//         await saveData("profile", userProfile);

//         console.log("Datos perfil usuario guardados correctamente:", userProfile);
//     } catch (error) {
//         console.error("Error en fetchAndSaveProfile:", error);
//     }
//};


//las playlist publicas que aparecen en el perfil de un usuario
export const fetchAndSavePublicPlaylists = async (nombre_usuario) => {
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/get-public-lists?nombre_usuario=${nombre_usuario}`
        );
        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener las listas del perfil: ${response.status} - ${response.statusText}`);
        }
        const publicPlaylists = await response.json();
        await saveData("public_playlists", publicPlaylists);
        //console.log("Playlist publicas del usuario guardadas correctamente:", publicPlaylists);
    } catch (error) {
        console.error("Error en fetchAndSavePublicPlaylists:", error);
    }
};


export const fetchAndSaveSearchLista = async (nombre_usuario) => {
};


//los datos de perfil de un podcaster
export const fetchAndSavePodcaster = async (nombre_podcaster) => {
    console.log("podcaster :", nombre_podcaster);

    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/podcaster?nombre_podcaster =${nombre_podcaster}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener el perfil de podcaster: ${response.status} - ${response.statusText}`);
        }

        const podcasterProfile = await response.json();

        await saveData("podcaster_profile", podcasterProfile);

        console.log("Datos perfil podcaster guardados correctamente:", podcasterProfile);
    } catch (error) {
        console.error("Error en fetchAndSavePodcaster:", error);
    }
};

//la lista de amigos del usuario
export const fetchAndSaveFriendsList = async (nombre_usuario) => {
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/get-friends-list?nombre_usuario=${nombre_usuario}`
        );
        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener la listas de amigos: ${response.status} - ${response.statusText}`);
        }
        const friendList = await response.json();
        await saveData("friendlist", friendList);
        console.log("Lista de amigos del usuario guardada correctamente:", friendList);
    } catch (error) {
        console.error("Error en fetchAndSaveFriendsList:", error);
    }
};

export const fetchAndSaveLyrics = async (id_cancion) => {
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/song/show-lyrics?id_cancion=${id_cancion}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta del servidor (letra):", errorText);
            throw new Error(
                `Error al obtener las letras: ${response.status} - ${response.statusText}`
            );
        }

        // Recibimos { letra: "..." }
        const json = await response.json();
        const texto = json.letra ?? "";

        // Ahora guardamos la cadena pura bajo la clave "lyrics"
        await saveData("lyrics", texto);

        console.log("Letras guardadas correctamente:", texto);
    } catch (error) {
        console.error("Error en fetchAndSaveLyrics:", error);
    }
};

export const fetchAndSaveRating = async (
    id_cm,
    nombreUsuario
) => {
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/get-rate?id_cm=${id_cm}&nombre_usuario=${nombreUsuario}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta de get-rate:", errorText);
            throw new Error(
                `Error al obtener la nota: ${response.status} - ${response.statusText}`
            );
        }

        const json = await response.json();
        const valoracion = json.valoracion;

        await saveData("rating", valoracion);

        console.log("Nota guardada correctamente:", valoracion);
    } catch (error) {
        console.error("Error en fetchAndSaveRating:", error);
    }
};

