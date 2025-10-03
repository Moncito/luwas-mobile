// components/PromoBanner.tsx
import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PromoBannerProps {
  promo: {
    id: string;
    title: string;
    imageUrl: string;
    finalPrice: number;
  };
  onPress?: () => void; // ✅ allow custom navigation
}

export default function PromoBanner({ promo, onPress }: PromoBannerProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: promo.imageUrl }}
        style={styles.banner}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.overlay} />
        <Text style={styles.title}>{promo.title}</Text>
        <Text style={styles.price}>₱{promo.finalPrice.toLocaleString()}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 180,
    marginHorizontal: 20,
    marginBottom: 16,
    justifyContent: "flex-end",
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#fff" },
  price: { fontSize: 14, fontWeight: "500", color: "#fcd34d", marginTop: 4 },
});
