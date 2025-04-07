// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { View, Text as RNText } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { PlayerProvider } from './baseLayoutPages/PlayerContext';
import { TextProps } from 'react-native/Libraries/Text/Text';

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Opcional: aplicar Montserrat por defecto a todos los <Text>
  if (fontsLoaded) {
    const defaultCreateElement = React.createElement;
    const createTextElement = (props: (React.ClassAttributes<RNText> & TextProps) | null | undefined, ...children: any[]) => {
      return React.createElement(
        RNText,
        { ...props, style: [{ fontFamily: 'Montserrat_400Regular' }, props?.style] },
        ...children
      );
    };
  }

  if (!fontsLoaded) return null;

  return (
    <PlayerProvider>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </PlayerProvider>
  );
}
