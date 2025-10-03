import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { memo, useEffect, useRef, useState, type ReactNode } from "react";
import {
    ActivityIndicator,
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../src/lib/firebase";

interface Promo {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  finalPrice: number;
}

interface FadeInItemProps {
  index: number;
  children: ReactNode;
}

const HERO_HEIGHT = 220;

export default function ItineraryList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "promos"));
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Promo)
        );
        setPromos(data);
      } catch (err) {
        console.error("Error fetching promos:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Animations
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT],
    outputRange: [0, -HERO_HEIGHT],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT / 2, HERO_HEIGHT],
    outputRange: [1, 0.4, 0],
    extrapolate: "clamp",
  });

  const stickyHeaderBg = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT / 2, HERO_HEIGHT],
    outputRange: ["transparent", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.95)"],
    extrapolate: "clamp",
  });

  const stickyTitleColor = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT / 2, HERO_HEIGHT],
    outputRange: ["#fff", "#333", "#111"],
    extrapolate: "clamp",
  });

  const renderItem = ({ item, index }: { item: Promo; index: number }) => (
    <FadeInItem index={index}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/(promos)/${item.id}`)}
        style={styles.card}
      >
        <View style={styles.cardMedia}>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <LinearGradient
            colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.05)", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.priceWrap}>
            <BlurView intensity={25} tint="dark" style={styles.priceGlass}>
              <Text style={styles.priceText}>
                ₱{Number(item.finalPrice || 0).toLocaleString()}
              </Text>
            </BlurView>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.cardSubtitle}>
            {item.location}
          </Text>
        </View>
      </TouchableOpacity>
    </FadeInItem>
  );

  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyEmoji}>🎟️</Text>
      <Text style={styles.emptyTitle}>No promos available</Text>
      <Text style={styles.emptySubtitle}>
        Please check back later for new deals and discounts.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Hero image + overlay */}
      <Animated.View
        style={[
          styles.heroWrap,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Image
          source={require("../../assets/images/homepromo.jpg")}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.65)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.65)"]}
          style={StyleSheet.absoluteFill}
        />

        {/* back button */}
        <View style={[styles.backWrap, { top: insets.top + 10 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.heroTextWrap, { opacity: headerOpacity }]}>
          <Text style={styles.heroTitle}>Promos</Text>
          <Text style={styles.heroSubtitle}>
            Exclusive deals and pre-planned trips
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Sticky header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          { paddingTop: insets.top + 10, backgroundColor: stickyHeaderBg },
        ]}
      >
        <Animated.Text style={[styles.stickyTitle, { color: stickyTitleColor }]}>
          Promos
        </Animated.Text>
      </Animated.View>

      {/* List */}
      {loading ? (
        <View style={{ marginTop: HERO_HEIGHT + 40 }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <Animated.FlatList
          data={promos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyState />}
          ListHeaderComponent={<View style={{ height: HERO_HEIGHT + 40 }} />}
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      )}
    </View>
  );
}

const FadeInItem = memo(({ index, children }: FadeInItemProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const delay = Math.min(index * 80, 600);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
});

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // hero
  heroWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    overflow: "hidden",
    zIndex: 1,
  },
  heroImage: { width: "100%", height: "100%" },
  heroTextWrap: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  heroTitle: { fontSize: 28, fontWeight: "700", color: "white" },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  backWrap: { position: "absolute", left: 16 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  // sticky header
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
  },
  stickyTitle: { fontSize: 18, fontWeight: "600" },

  // cards
  card: {
    backgroundColor: "#fff",
    borderRadius: CARD_RADIUS,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.012,
    shadowRadius: 4,
    elevation: 5,
  },
  cardMedia: { width: "100%", height: 180 },
  cardImage: { width: "100%", height: "100%" },
  priceWrap: { position: "absolute", top: 12, right: 12 },
  priceGlass: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  priceText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  cardContent: { paddingHorizontal: 14, paddingVertical: 12 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#111" },
  cardSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 2 },

  // empty state
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  emptySubtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
  },
});
