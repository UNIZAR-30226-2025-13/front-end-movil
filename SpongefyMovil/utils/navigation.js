import { router } from 'expo-router';
import { saveData } from './storage';

export const goToPerfil = async (nombre) => {

    await saveData("user", nombre);
    router.push('/baseLayoutPages/PerfilUsuarioPlaylists');
};

export const goToPodcasterPerfil = async (nombre_podcaster) => {
    await saveData("podcaster", nombre_podcaster);
    router.push('/baseLayoutPages/PerfilPodcaster');
}

export const goToChat = async (nombre_usuario) =>  {
    await saveData("user_chat", nombre_usuario);
    router.push('/Chat')
}
