import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ItineraryCardProps {
  id: string;
  title: string;
  duration: string;
  image: string;
  onPress?: () => void;
}

export default function ItineraryCard({ title, duration, image, onPress }: ItineraryCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        imageStyle={{ borderRadius: 18 }}
      >
        <View style={styles.overlay} />
        <View style={styles.textBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240, // ✅ wide enough for swipe
    height: 160,
    marginRight: 16,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  textBox: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#fff" },
  duration: { fontSize: 13, color: "#fcd34d", marginTop: 2 },
});
