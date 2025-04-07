import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    console.log("🟢 Pantalla de carga mostrada");
    const timer = setTimeout(() => {
      console.log("🔄 Redirigiendo a LoginScreen...");
      router.replace('/LoginScreen'); // Asegúrate de que la ruta existe
    }, 2000);

    return () => {
      console.log("🛑 Temporizador limpiado");
      clearTimeout(timer);
    };
  }, []);

  return (
      <View style={styles.container}>
        <Image source={require('../assets/splash.png')} style={styles.image} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});