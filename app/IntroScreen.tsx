import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";
<<<<<<< HEAD

const { width, height } = Dimensions.get("window");

=======
 
const { width, height } = Dimensions.get("window");
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
export default function IntroScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const exitAnim = useRef(new Animated.Value(1)).current;
<<<<<<< HEAD

=======
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
  useEffect(() => {
    // Fade in and scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
<<<<<<< HEAD

=======
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
    // Fade out and navigate
    const timer = setTimeout(() => {
      Animated.timing(exitAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/(auth)/login");
      });
    }, 3800);
<<<<<<< HEAD

    return () => clearTimeout(timer);
  }, []);

=======
 
    return () => clearTimeout(timer);
  }, []);
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
  return (
    <Animated.View style={[styles.container, { opacity: exitAnim }]}>
      {/* ✈️ Plane animation (bigger and centered) */}
      <LottieView
        source={require("../assets/lottie/plane-intro.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
<<<<<<< HEAD

=======
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
      {/* 💫 Branding text */}
      <Animated.View
        style={[
          styles.textContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.title}>Travel with Luwas</Text>
        <Text style={styles.subtitle}>Discover. Plan. Travel — with ease.</Text>
      </Animated.View>
    </Animated.View>
  );
}
<<<<<<< HEAD

=======
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // simple clean dark background
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: width * 15, // 👈 bigger plane size
    height: height * 0.45,
  },
  textContainer: {
    marginTop: 28,
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "rgba(255,255,255,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: "#cbd5e1",
    marginTop: 6,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.3,
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
