import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@lib/firebase";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    address: "",
    occupation: "",
    incomeLevel: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch existing data
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          fullName: data.fullName || user.displayName || "",
          email: data.email || user.email || "",
          phoneNumber: data.phoneNumber || "",
          age: data.age ? String(data.age) : "",
          gender: data.gender || "",
          address: data.address || "",
          occupation: data.occupation || "",
          incomeLevel: data.incomeLevel || "",
          avatarUrl: data.avatarUrl || "",
        });
      } else {
        setForm((prev) => ({ ...prev, email: user.email || "" }));
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // ✅ Image picker + upload
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user?.uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setForm((prev) => ({ ...prev, avatarUrl: downloadURL }));
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Save profile
  const handleSave = async () => {
    if (!user) return;
    try {
      setUploading(true);
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...form,
          email: user.email,
          age: form.age ? Number(form.age) : null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      router.back();
    } catch (err) {
      console.error("❌ Error saving profile:", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Profile completion progress
  const completion = useMemo(() => {
    const fields = Object.entries(form).filter(([key]) => key !== "email" && key !== "avatarUrl");
    const filled = fields.filter(([, v]) => v && v.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }, [form]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Avatar */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={{
              uri:
                form.avatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.label}>Profile Completion</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
          <Text style={styles.progressText}>{completion}% Complete</Text>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={form.fullName}
            onChangeText={(v) => setForm((p) => ({ ...p, fullName: v }))}
          />
          <TextInput
            style={[styles.input, { backgroundColor: "#f3f4f6" }]}
            value={form.email}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChangeText={(v) => setForm((p) => ({ ...p, phoneNumber: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={form.age}
            onChangeText={(v) => setForm((p) => ({ ...p, age: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={form.gender}
            onChangeText={(v) => setForm((p) => ({ ...p, gender: v }))}
          />
        </View>

        {/* Lifestyle Information */}
        <Text style={styles.sectionTitle}>Lifestyle Information</Text>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={form.address}
            onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Occupation"
            value={form.occupation}
            onChangeText={(v) => setForm((p) => ({ ...p, occupation: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Income Level (Low, Medium, High)"
            value={form.incomeLevel}
            onChangeText={(v) => setForm((p) => ({ ...p, incomeLevel: v }))}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, uploading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={uploading}
        >
          <Text style={styles.saveText}>
            {uploading ? "Saving..." : "Save Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    padding: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#2563EB",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563EB",
    borderRadius: 20,
    padding: 6,
  },
  progressContainer: { marginVertical: 10 },
  label: { fontSize: 14, color: "#555" },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#2563EB",
  },
  progressText: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 20,
    marginBottom: 8,
  },
  section: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  saveText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
