import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ relative imports
import { useDestinations } from "../../hooks/useDestinations";
import { useItineraries } from "../../hooks/useItineraries";
import { usePromos } from "../../hooks/usePromos";
import { useUserProfile } from "../../hooks/useUserProfile";

import DestinationCard from "../../components/DestinationCard";
import ItineraryCard from "../../components/ItineraryCard"; // ✅ NEW
import PromoBanner from "../../components/PromoBanner";

export default function HomeScreen() {
  const router = useRouter();

  const { name } = useUserProfile();
  const { destinations = [] } = useDestinations(3);
  const { promos = [] } = usePromos(1);
  const { itineraries = [] } = useItineraries(2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome, {name || "Traveler"}</Text>
          <Text style={styles.subtext}>Where’s your next adventure?</Text>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/destination")}>
              <Text style={styles.link}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                title={dest.title}
                price={dest.price}
                image={dest.imageUrl}
              />
            ))}
          </ScrollView>
        </View>

        {/* Promotions */}
        {promos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Promotions</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/promos")}>
                <Text style={styles.link}>See All</Text>
              </TouchableOpacity>
            </View>
            <PromoBanner promo={promos[0]} />
          </View>
        )}

        {/* Recommended Itineraries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/itineraries")}
            >
              <Text style={styles.link}>See All</Text>
            </TouchableOpacity>
          </View>
          {itineraries.map((item) => (
            <ItineraryCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.imageUrl} // ✅ now supports itinerary images
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtext: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
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
