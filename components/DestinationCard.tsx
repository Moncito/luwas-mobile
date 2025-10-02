import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function DestinationCard({ title, price, image, description, vertical }: any) {
  return (
    <View style={[styles.card, vertical && styles.vertical]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {price && <Text style={styles.price}>₱{price}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  vertical: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 100,
  },
  placeholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#E5E7EB",
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563EB",
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
