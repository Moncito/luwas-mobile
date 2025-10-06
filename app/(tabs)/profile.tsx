import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@lib/firebase";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilePage() {
  const router = useRouter();
  const user = auth.currentUser;
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data());
      }
    });
    return () => unsub();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!profile)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ color: "#555" }}>Loading profile...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={{
                uri:
                  profile?.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {profile?.fullName || "Unnamed User"}
            </Text>
            <Text style={styles.role}>Traveler</Text>
          </View>

          {/* Personal Info */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoBox}>
            <InfoRow icon="mail-outline" label={profile?.email} />
            <InfoRow
              icon="call-outline"
              label={profile?.phoneNumber || "No phone added"}
            />
            <InfoRow icon="person-outline" label={`Age: ${profile?.age || "—"}`} />
            <InfoRow icon="male-outline" label={`Gender: ${profile?.gender || "—"}`} />
          </View>

          {/* Lifestyle Info */}
          <Text style={styles.sectionTitle}>Lifestyle Information</Text>
          <View style={styles.infoBox}>
            <InfoRow
              icon="location-outline"
              label={profile?.address || "No address yet"}
            />
            <InfoRow
              icon="briefcase-outline"
              label={`Occupation: ${profile?.occupation || "—"}`}
            />
            <InfoRow
              icon="cash-outline"
              label={`Income Level: ${profile?.incomeLevel || "—"}`}
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/editProfile")}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#2563EB" />
      <Text style={styles.infoText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#2563EB",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  role: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    backgroundColor: "#E0EBFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginTop: 20,
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 6,
  },
  infoText: {
    fontSize: 15,
    color: "#374151",
  },
  editBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  editText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  logoutText: {
    color: "red",
    fontWeight: "600",
    fontSize: 16,
  },
});
