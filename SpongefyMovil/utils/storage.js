import AsyncStorage from "@react-native-async-storage/async-storage";

/*
basicamente una tabla hash para guardar datos entre pantallas
ejemplo de uso abajo
importar con: 
import { saveData, getData, removeData } from "../utils/storage";
*/



/* CLAVES USADAS:

username              nombre de usuario
playlists             lista de las playlist y carpetas del usuario
home                  datos de la pestaña "Todo" de home
homeMusic             datos de la pestaña "Musica" de home
homePodcast           datos de la pestaña "Podcast" de home
library               datos de la blbioteca
searchGlobal          resultados de la ultima busqueda global en home

*/



// EJEMPLOS DE USO

// Guardar un usuario
// await saveData("username", "MiUsuario123");

// Obtener el usuario
// const nombre_usuario = await getData("username");

// Eliminar el usuario
// await removeData("username");











// Guardar
export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error al guardar en AsyncStorage:", error);
  }
};

// Obtener
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error al obtener datos de AsyncStorage:", error);
  }
};

// Eliminar
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error al eliminar datos de AsyncStorage:", error);
  }
};
