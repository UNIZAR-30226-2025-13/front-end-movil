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

export const fetchAndSaveMessages = async (nombre_usuario_envia, nombre_usuario_recibe) => {
    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/get-messages?nombre_usuario_envia=${nombre_usuario_envia}&nombre_usuario_recibe=${nombre_usuario_recibe}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener los mensajes: ${response.status} - ${response.statusText}`);
        }

        const messages = await response.json();
        await saveData("messages", messages);
        console.log("Mensajes guardados correctamente:", messages);
    } catch (error) {
        console.error("Error en fetchAndSaveMessages:", error);
    }
};

export const fetchAndSaveAllCreators = async () => {

    const cadena = "a";

    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/search-creator?cadena=${cadena}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener los creadores: ${response.status} - ${response.statusText}`);
        }

        const busqueda_creadores = await response.json();
        await saveData("allCreators", busqueda_creadores);

        console.log("Resultados de búsqueda guardados correctamente:", busqueda_creadores);
    } catch (error) {
        console.error("Error en fetchAndSaveAllCreators:", error);
    }
};
export const fetchandSaveAlbum = async (id_album ) => {

    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/album?id_album=${id_album}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener el album: ${response.status} - ${response.statusText}`);
        }

        const album = await response.json();
        await saveData("album", album);

        console.log("Resultados de búsqueda guardados correctamente:", album);
    } catch (error) {
        console.error("Error en fetchAndSaveAllCreators:", error);
    }
};

export const fetchAndSaveAllAlbums = async (artista) => {

    const cadena = "a";

    try {
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/search-creator?cadena=${cadena}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener los creadores: ${response.status} - ${response.statusText}`);
        }

        const busqueda_creadores = await response.json();
        await saveData("allCreators", busqueda_creadores);

        console.log("Resultados de búsqueda guardados correctamente:", busqueda_creadores);
    } catch (error) {
        console.error("Error en fetchAndSaveAllCreators:", error);
    }
};

//Funciones para la cola de canciones
export const initializeQueue = async (nombre_usuario) => {
    try {
        const queue = await getData("queue");
        if (!queue) {
            console.log("Cola inicializada como vacía.");
        } else {
            //vaciar cola
            clearQueue(nombre_usuario);
        }
        await saveData("queue", []);
        await saveData("queuePosition", 0);
        console.log("Cola inicializada correctamente.");
    } catch (error) {
        console.error("Error al inicializar la cola:", error);
    }
};
export const addToQueue = async (nombre_usuario, id_cancion) => {
    try {
        const queue = await getData("queue");
        if (!queue) {
            console.log("Cola no encontrada, inicializando cola vacía.");
            await initializeQueue(nombre_usuario);
        }

        const bodyData = {
            "id_cm": id_cancion,
            "nombre_usuario": nombre_usuario, // Cambia esto por el nombre de usuario real
        }
        const url = `https://spongefy-back-end.onrender.com/queue/add`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al añadir a la cola: ${response.status} - ${response.statusText}`);
        }

        const updatedQueue = await response.json();
        await saveData("queue", updatedQueue);

        console.log("Cola actualizada correctamente:", updatedQueue);
    } catch (error) {
        console.error("Error en addToQueue:", error);
    }
};
export const fetchAndSaveQueue = async (nombre_usuario, posicion) => {
    try {
        console.log("fetchAndSaveQueue se ejecuta con nombre_usuario:", nombre_usuario, "y posicion:", posicion);
        const response = await fetch(
            `https://spongefy-back-end.onrender.com/queue/show?nombre_usuario=${nombre_usuario}&posicion=${posicion}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener la cola: ${response.status} - ${response.statusText}`);
        }

        const queue = await response.json();

        await saveData("queue", queue);

        console.log("Cola guardada correctamente:", queue);
    } catch (error) {
        console.error("Error en fetchAndSaveQueue:", error);
    }
};

export const  clearQueue = async (nombre_usuario) => {
    try {
        const response = await fetch(`https://spongefy-back-end.onrender.com/queue/clear`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre_usuario }) // 👈 enviar el usuario en el body
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al limpiar la cola: ${response.status} - ${response.statusText}`);
        }
        // Si la respuesta es exitosa, puedes limpiar la cola en el almacenamiento local
        await saveData("queue", []);
        await saveData("queuePosition", 0);
        console.log("Respuesta de la API:", await response.json());
    } catch (error) {
        console.error("Error en clearQueue:", error);
    }
};

export const shuffleQueue = async (nombre_usuario, posicion) => {
    try {
        const bodyData = {
            "nombre_usuario": nombre_usuario,
            "posicion": posicion
        };
        console.log("shuffleQueue se ejecuta con nombre_usuario:", nombre_usuario, "y posicion:", posicion);
        const response = await fetch("https://spongefy-back-end.onrender.com/queue/shuffle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ bodyData }) // 👈 enviar el usuario en el body
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al randomizar la cola: ${response.status} - ${response.statusText}`);
        }
        // Si la respuesta es exitosa, guardar nuevos datos en el almacenamiento local
        const queue = await response.json();
        await saveData("queue", queue);
        console.log("Cola randomizada correctamente:", queue);
        console.log("Respuesta de la API:", await response.json());
    } catch (error) {
        console.error("Error en randomizeQueue:", error);
    }
}
export const fetchAndSaveQueuePosition = async (nombre_usuario, posicion) => {
    try {

        const response = await fetch(
            `https://spongefy-back-end.onrender.com/queue/get-cm?nombre_usuario=${nombre_usuario}&posicion=${posicion + 1}`
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Error en la respuesta del servidor:", errorResponse);
            throw new Error(`Error al obtener la posición de la cola: ${response.status} - ${response.statusText}`);
        }

        const queuePosition = await response.json();

        await saveData("queuePosition", posicion + 1);
        console.log("Posición actualizada correctamente:", posicion + 1);
        await saveData("queueSong", queuePosition);
        console.log("Canción de la cola obtenida correctamente:", queuePosition);
    } catch (error) {
        console.error("Error en fetchAndSaveQueuePosition:", error);
    }
};