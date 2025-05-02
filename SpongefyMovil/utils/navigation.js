import { router } from 'expo-router';
import { saveData } from './storage';

export const goToPerfil = async (nombre) => {

    await saveData("user", nombre);
    router.push('/baseLayoutPages/PerfilUsuarioPlaylists');
};

export const goToPodcasterPerfil =(name) => {
    saveData("podcaster", name);
    console.log(name);
    router.push(`/baseLayoutPages/podcaster/${name}`);
}

export const goToPodcast =(name) => {
    saveData("podcaster", name);
    console.log(name);
    router.push(`/baseLayoutPages/podcast/${name}`);
}

export const goToEpisode =(id) => {
    saveData("podcaster", id);
    console.log(id);
    router.push(`/baseLayoutPages/episode/${id}`);
}

export const goToChat = async (nombre_usuario) =>  {
    await saveData("user_chat", nombre_usuario);
    router.push('/Chat')
}
