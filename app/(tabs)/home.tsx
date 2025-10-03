import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// hooks
import { useDestinations } from "../../hooks/useDestinations";
import { useItineraries } from "../../hooks/useItineraries";
import { usePromos } from "../../hooks/usePromos";
import { useUserProfile } from "../../hooks/useUserProfile";

// components
import DestinationCard from "../../components/DestinationCard";
import ItineraryCard from "../../components/ItineraryCard";
import PromoBanner from "../../components/PromoBanner";

export default function HomeScreen() {
  const router = useRouter();
  const { name } = useUserProfile();
  const { destinations = [] } = useDestinations(3);
  const { promos = [] } = usePromos(2);
  const { itineraries = [] } = useItineraries(3);

  const displayName =
    name && name !== "Unnamed" && name.trim() !== "" ? name : "Traveler";

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* 🔹 Hero Section */}
      <View style={styles.heroWrapper}>
        <ImageBackground
          source={require("../../assets/images/hometop.jpg")}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Welcome, {displayName}</Text>
            <Text style={styles.heroSubtitle}>
              Plan your next adventure today
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/destination")}
              style={styles.heroButton}
            >
              <Text style={styles.heroButtonText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* 🔹 Sections Below */}
      <View style={styles.sectionContainer}>
        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity onPress={() => router.push("/(destination)")}>
              <Text style={styles.link}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                title={dest.title}
                location={dest.location}
                price={dest.price}
                image={dest.imageUrl}
                onPress={() => router.push(`/(tabs)/destination?id=${dest.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Promotions */}
        {promos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Exclusive Promotions</Text>
              <TouchableOpacity onPress={() => router.push("/(promos)")}>
                <Text style={styles.link}>See All</Text>
              </TouchableOpacity>
            </View>
            {promos.map((promo) => (
              <PromoBanner key={promo.id} promo={promo} />
            ))}
          </View>
        )}

        {/* Recommended Itineraries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/itineraries")}>
              <Text style={styles.link}>See All</Text>
            </TouchableOpacity>
          </View>
          {itineraries.map((item) => (
            <ItineraryCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.imageUrl}
              duration={item.duration}
              onPress={() => router.push(`/(tabs)/itineraries?id=${item.id}`)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6, // ✅ Android shadow
    marginBottom: 16,
  },
  hero: {
    height: 280,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroContent: {
    padding: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginVertical: 6,
  },
  heroButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 30,
    marginTop: 12,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  heroButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  sectionContainer: {
    backgroundColor: "#F9FAFB",
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  link: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },
});
