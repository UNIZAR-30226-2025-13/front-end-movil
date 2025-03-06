// app/_layout.tsx
import React from 'react';
import { PlayerProvider } from './PlayerContext'; // Importa el PlayerProvider para el contexto global
import { Slot } from 'expo-router'; // Esto es necesario para renderizar las rutas de Expo Router

export default function Layout() {
  return (
    <PlayerProvider> {/* Asegúrate de envolver todas las pantallas dentro del PlayerProvider */}
      <Slot /> {/* Aquí se renderizan todas las pantallas que se definan en la estructura de carpetas */}
    </PlayerProvider>
  );
}
