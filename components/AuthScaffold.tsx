import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// 👇 Use your local background images
const SLIDES = [
  { id: "1", source: require("../assets/images/slide1.jpg") },
  { id: "2", source: require("../assets/images/slide2.jpg") },
  { id: "3", source: require("../assets/images/slide3.jpg") },
];

export default function AuthScaffold({
  children,
  title = "Welcome to LUWAS",
  subtitle = "Discover. Plan. Travel — with ease.",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start();
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // every 6s

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Animated background slideshow */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <Image
          source={SLIDES[index].source}
          style={styles.bg}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Gradient overlay for soft focus */}
      <View style={styles.overlay} />

      {/* Centered branding */}
      <View style={styles.brandContainer}>
        <Text style={styles.brand}>LUWAS</Text>
        <Text style={styles.tagline}>{subtitle}</Text>
      </View>

      {/* Glass card container */}
      <View style={styles.cardContainer}>
        <BlurView intensity={60} tint="light" style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(0, 0, 0, 0.45)", // lighter overlay for glass visibility
  },
  brandContainer: {
    alignItems: "center",
    marginTop: height * 0.12, // centered nicely
  },
  brand: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    color: "#e5e7eb",
    fontSize: 15,
    opacity: 0.9,
    marginTop: 6,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: height * 0.08,
  },
  card: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",

    // ✨ Modern Glassmorphism
    backgroundColor: "rgba(255,255,255,0.0003)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#fff",
    marginBottom: 16,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
