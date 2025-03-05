// BaseLayout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import PlayerComponent from "./PlayerComponent"; // Asegúrate de importar PlayerComponent correctamente

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      {/* Contenido dinámico */}
      <View style={styles.content}>{children}</View>

      {/* 🎵 Player abajo */}
      <View style={styles.footer}>
        <PlayerComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 10,
    alignItems: "center",
  },
});

export default BaseLayout;
