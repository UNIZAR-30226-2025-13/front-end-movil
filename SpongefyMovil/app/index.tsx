import { Text, View } from "react-native";
import React from "react";
import HomeScreen from "@/screens/HomeScreen";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <HomeScreen />
    </View>
  );
}
