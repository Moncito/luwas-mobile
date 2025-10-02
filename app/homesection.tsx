import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useUserProfile } from "../hooks/useUserProfile";

const { height, width } = Dimensions.get("window");

export default function HomeSection() {
  const router = useRouter();
const { name } = useUserProfile();
const displayName =
  name && name !== "Unnamed" && name.trim() !== "" ? name : "Traveler";

  return (
    <View style={styles.container}>
      {/* Fullscreen background image */}
      <ImageBackground
        source={require("../assets/images/homesection.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay for readability */}
        <View style={styles.overlay} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
  {displayName}, Plan Your Next Journey
</Text>
          <Text style={styles.subtitle}>
            Discover destinations, exclusive deals, and curated itineraries.
          </Text>

          {/* Glassmorphic Button */}
          <BlurView intensity={60} tint="light" style={styles.glassButton}>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)/home")}
              style={styles.buttonContent}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height: height,
    width: width,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)", // dark overlay for text contrast
  },
  content: {
    padding: 24,
    alignItems: "center",
    marginBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 40,
  },
  glassButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    backgroundColor: "rgba(255,255,255,0.15)", // fallback if blur not visible
  },
  buttonContent: {
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
});
