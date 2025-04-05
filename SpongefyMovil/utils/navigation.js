import { router } from 'expo-router';
import { saveData } from './storage';

export const goToPerfil = async (nombre) => {

    await saveData("user", nombre);
    router.push('/PerfilUsuarioPlaylists');
};
