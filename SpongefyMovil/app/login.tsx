import React from 'react';
import { Alert, Button, Text, ImageBackground, View, StyleSheet } from 'react-native';
import { useEffect } from "react";
import { useRouter } from "expo-router";


export default function LoginScreen() {
    const router = useRouter();
    const handlePress = () => {
      console.log("Botón presionado");
      
      router.replace("/register");
    };
  
    return (

        <ImageBackground source={require("../assets/halfalogo.png")} style={{width: '100%', height: '100%'}}> 
          <View style={styles.container}>
            <Button
              title="Go to register screen"
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
