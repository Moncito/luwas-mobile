import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../src/lib/firebase";

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  tags: string[];
  latitude: number;
  longitude: number;
}

// Yelp
interface YelpData {
  summary: string;
  rating: number;
  url: string;
  image: string;
}

// Recommended Places
interface Place {
  title: string;
  description: string;
  image: string;
  link: string;
}

// Weather
interface WeatherData {
  bestTime: { label: string; reason: string; emoji: string }[];
  weatherInfo: { label: string; months: string; temperature: string }[];
}

const API_BASE = "https://luwas-travel.vercel.app"; // 🔹 Change if your domain differs

export default function DestinationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  const [yelp, setYelp] = useState<YelpData | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // --- Firestore fetch ---
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        if (!id) return;
        const snap = await getDoc(doc(db, "destinations", id));
        if (snap.exists()) {
          setDestination({ id: snap.id, ...snap.data() } as Destination);
        }
      } catch (err) {
        console.error("❌ Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  // --- API fetches ---
  useEffect(() => {
    if (!destination) return;

    // Yelp
    fetch(
      `${API_BASE}/api/yelp/summary?name=${encodeURIComponent(
        destination.name
      )}&location=${encodeURIComponent(destination.location)}`
    )
      .then((res) => res.json())
      .then((data) => setYelp(data))
      .catch((err) => console.error("❌ Yelp API:", err));

    // Recommended Places
    fetch(
      `${API_BASE}/api/recommendations?lat=${destination.latitude}&lon=${destination.longitude}`
    )
      .then((res) => res.json())
      .then((data) => setPlaces(data.places || []))
      .catch((err) => console.error("❌ Places API:", err));

    // Weather Insights
    fetch(`${API_BASE}/api/ai/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: destination.name,
        location: destination.location,
      }),
    })
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("❌ Weather API:", err));
  }, [destination]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!destination) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Destination not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <Image source={{ uri: destination.imageUrl }} style={styles.heroImage} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Destination Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{destination.name}</Text>
        <Text style={styles.location}>{destination.location}</Text>
        <Text style={styles.description}>{destination.description}</Text>

        {/* Tags */}
        <View style={styles.tags}>
          {destination.tags?.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Price + Book button */}
        <Text style={styles.price}>
          ₱{Number(destination.price).toLocaleString()} per person
        </Text>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push(`/destination/${id}/book`)}
        >
          <Text style={styles.bookText}>Book This Destination</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Yelp Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Traveler Reviews</Text>
        {!yelp ? (
          <Text style={styles.placeholder}>Loading reviews...</Text>
        ) : (
          <View>
            <Text style={styles.description}>{yelp.summary}</Text>
            <Text style={styles.smallText}>⭐ {yelp.rating} on Yelp</Text>
          </View>
        )}
      </View>

      {/* 🔹 Recommended Places */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Spots</Text>
        {places.length === 0 ? (
          <Text style={styles.placeholder}>Loading places...</Text>
        ) : (
          places.map((p, i) => (
            <View key={i} style={{ marginBottom: 12 }}>
              <Text style={styles.subTitle}>{p.title}</Text>
              <Text style={styles.smallText}>{p.description}</Text>
            </View>
          ))
        )}
      </View>

      {/* 🔹 Weather */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weather Insights</Text>
        {!weather ? (
          <Text style={styles.placeholder}>Loading weather...</Text>
        ) : (
          <>
            <Text style={styles.subTitle}>Best Time to Visit</Text>
            {weather.bestTime?.map((t, i) => (
              <Text key={i} style={styles.smallText}>
                {t.emoji} {t.label} — {t.reason}
              </Text>
            ))}
            <Text style={[styles.subTitle, { marginTop: 10 }]}>
              Weather Info
            </Text>
            {weather.weatherInfo?.map((w, i) => (
              <Text key={i} style={styles.smallText}>
                {w.label}: {w.months} ({w.temperature})
              </Text>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  heroImage: { width: "100%", height: 250 },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#111" },
  location: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  description: { fontSize: 16, color: "#374151", marginVertical: 12 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  tag: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: { fontSize: 12, fontWeight: "500", color: "#0369A1" },
  price: { fontSize: 18, fontWeight: "600", color: "#1E3A8A", marginTop: 8 },
  bookBtn: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  bookText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  subTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  smallText: { fontSize: 14, color: "#444" },
  placeholder: { fontSize: 14, color: "#9CA3AF", fontStyle: "italic" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { fontSize: 16, color: "red" },
});
