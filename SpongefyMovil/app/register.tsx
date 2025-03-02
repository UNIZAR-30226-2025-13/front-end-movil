
import React from 'react';
import { Alert, Button, Text, ImageBackground, View, StyleSheet } from 'react-native';
import { useEffect } from "react";
import { useRouter } from "expo-router";


export default function RegisterScreen() {
    const router = useRouter();
    const handlePress = () => {
      console.log("Botón presionado en register");

    };
   
    return (
        <ImageBackground 
      source={require('../assets/halfalogo.png')} 

      >

          <View style={styles.container}>
            <Button
              title="Press me"
              onPress={handlePress}
            />
          </View>
        </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', // Centra el botón verticalmente
      alignItems: 'center', // Centra el botón horizontalmente
    },
  });
