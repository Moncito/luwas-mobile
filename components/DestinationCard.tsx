// components/DestinationCard.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  location?: string;
  price?: number;
  image?: string;
  onPress?: () => void;
};

export default function DestinationCard({ title, location, price, image, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        imageStyle={{ borderRadius: 16 }}
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />

        {/* Text Content */}
        <View style={styles.textBox}>
          <Text style={styles.title}>{title}</Text>
          {location && <Text style={styles.location}>{location}</Text>}
          {price !== undefined && (
            <Text style={styles.price}>₱{price.toLocaleString()} / person</Text>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 240,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textBox: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  location: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fcd34d",
    marginTop: 4,
  },
});
