import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, ImageBackground, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Validar que todos los campos estén completos
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return;
    }
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Por ahora, solo loguear los valores y mostrar un mensaje de éxito
    console.log('Registrarse presionado', { username, email, password });
    Alert.alert('¡Éxito!', 'Cuenta creada exitosamente.');

    // Después del registro, opcionalmente puedes navegar a la pantalla de login
    // router.push('/login');
  };

  const handleBack = () => {
    // Regresa a la pantalla de login
    router.push('/');
  };

  return (
    <ImageBackground
      source={require('../assets/halfalogo.png')}
      style={styles.background}
    >
      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={40} color="#000" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <View style={styles.buttonContainer}>
          <Button title="Registrarse" onPress={handleRegister} color="#9400D3" />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust as needed
    left: 20,
    zIndex: 10,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
});
