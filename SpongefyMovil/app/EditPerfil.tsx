import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';

export default function EditProfile() {
    const router = useRouter();

    const [email, setEmail] = useState('paulablasco@gmail.com');
    const [password, setPassword] = useState('********');

    const handleSave = () => {
        console.log('Nouvelles valeurs:', email, password);
        router.push('/perfil');
    };

    const handleCancel = () => {
        router.push('/perfil');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>

            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
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
        backgroundColor: '#9400D3',
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
