import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { getData } from '../../utils/storage';
import { useRouter } from 'expo-router';

export default function EditProfile() {
    
    const router = useRouter();

    const [email, setEmail] = useState('Si no quieres cambiarlo, escribe el mismo');
    const [password, setPassword] = useState('Nueva o actual contraseña');
    const [isLoading, setIsLoading] = useState(false);
    
    
    useEffect(() => {
        const loadUser = async () => {
            const token = await getData("token");
            console.log("Token:", token);
            setIsLoading(true);
            try{
                const nombre_usuario = await getData("username");
                const url = `https://spongefy-back-end.onrender.com/perfil?nombre_usuario=${nombre_usuario}`;
                console.log("URL de la API:", url);
                const response = await fetch(url,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Respuesta de la API:", data);
                    setEmail(data.correo);
                    setPassword(data.password);
                }
            } catch (error) {
                console.log("⚠️ Error en la solicitud:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadUser();   

    }, []);
    
    
    const handleSave = async () => {
        console.log('Guardar con Valores:', email, password);
        try {
            const nombre_usuario = await getData("username");
            const token = await getData("token");
            console.log("Token:", token);
            // Construir la URL con parámetros por separado
            const baseUrl = "https://spongefy-back-end.onrender.com/update-profile";
            const bodyData = {
                "nombre_usuario": nombre_usuario,
                "nuevo_email": email,
                "nueva_contrasena": password
            };
        
            const url = `https://spongefy-back-end.onrender.com/update-profile`;
            console.log("URL de la API:", url);
        
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyData),
                
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Respuesta de la API:', data);
                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        
        } catch (error) {
            console.log("⚠️ Error en la solicitud:", error);
        }
        router.push('./PerfilUsuarioPlaylists');
        };

    const handleCancel = () => {
        router.push('./PerfilUsuarioPlaylists');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>

            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmail('')}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassword('')}
            />

            <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B2E83',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    buttonText: {
        color: '#9400D3',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#fff',
    },
    cancelButtonText: {
        color: '#fff',
    },

});
