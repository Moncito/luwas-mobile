import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@lib/firebase";
import { Tabs } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, Platform } from "react-native";

// ✅ Custom profile icon component
function ProfileTabIcon({
  focused,
  size,
  color,
}: {
  focused: boolean;
  size: number;
  color: string;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setPhotoUrl(snap.data().avatarUrl || null);
      }
    });

    return () => unsub();
  }, []);

  return photoUrl ? (
    <Image
      source={{ uri: photoUrl }}
      style={{
        width: focused ? size + 6 : size + 2,
        height: focused ? size + 6 : size + 2,
        borderRadius: 999,
        borderWidth: focused ? 2 : 1,
        borderColor: focused ? "#2563EB" : "#9CA3AF",
      }}
    />
  ) : (
    <Ionicons
      name={focused ? "person" : "person-outline"}
      size={focused ? size + 4 : size + 1}
      color={color}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 80 : 70,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? size + 4 : size + 1}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="destinations"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={focused ? size + 4 : size + 1}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={focused ? size + 4 : size + 1}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chat-support"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                focused
                  ? "chatbubble-ellipses"
                  : "chatbubble-ellipses-outline"
              }
              size={focused ? size + 4 : size + 1}
              color={color}
            />
          ),
        }}
      />

      {/* ✅ Profile with avatar & fallback */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <ProfileTabIcon focused={focused} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
