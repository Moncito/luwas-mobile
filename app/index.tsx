import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import IntroScreen from "../app/IntroScreen"; // 👈 adjust path if needed
import { auth, db } from "../src/lib/firebase";
 
export default function Index() {
  const [loading, setLoading] = useState(true);
  const [validUser, setValidUser] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // 👈 control intro visibility
<<<<<<< HEAD

=======
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000); // intro runs 4s
    return () => clearTimeout(timer);
  }, []);
<<<<<<< HEAD

=======
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setValidUser(userDoc.exists());
      } else {
        setValidUser(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);
<<<<<<< HEAD

  // 🎬 1️⃣ Show Intro first
  if (showIntro) return <IntroScreen />;

=======
 
  // 🎬 1️⃣ Show Intro first
  if (showIntro) return <IntroScreen />;
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
  // 🔄 2️⃣ Show loading spinner while checking Firebase
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Checking user...
        </Text>
      </View>
    );
  }
<<<<<<< HEAD

=======
 
>>>>>>> 315c6d995f883847c6928cdeef741ded8b6a4800
  // 🧭 3️⃣ Redirect after intro & loading
  if (!validUser) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)/home" />;
}