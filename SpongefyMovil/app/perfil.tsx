import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

export default function ProfileScreen() {
    const handleEditProfile = () => {
        console.log("Editar perfil");
        // Naviguer vers l'écran d'édition de profil si besoin
    };

    const handleLogout = () => {
        console.log("Cerrar Sesión");
        // Déconnexion (retour à la page login, par ex.)
    };

    const handleDeleteAccount = () => {
        console.log("Eliminar Cuenta");
        // Demander confirmation avant de supprimer le compte
    };

    return (
        <View style={styles.container}>
            {/* 
        Si tu as une image de fond violette, remplace require(...) 
        par le chemin vers ton asset. Sinon, laisse un simple fond coloré.
      */}
            <ImageBackground
                source={require('../assets/logo.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.content}>
                    <Text style={styles.profileTitle}>Tu perfil</Text>
                    <Text style={styles.subtitle}>Datos personales</Text>

                    <Text style={styles.username}>paulablasco</Text>

                    <Text style={styles.label}>Correo electrónico</Text>
                    <Text style={styles.value}>paulablasco@gmail.com</Text>

                    <Text style={styles.label}>Contraseña</Text>
                    <Text style={styles.value}>********</Text>

                    <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                        <Text style={styles.buttonText}>Editar perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Cerrar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
                        <Text style={[styles.buttonText, styles.deleteButtonText]}>Eliminar Cuenta</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9400D3',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 20,
    },
    username: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 14,
        borderRadius: 25,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#9400D3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#fff',
        marginTop: 20,
    },
    deleteButtonText: {
        color: '#fff',
    },
});
