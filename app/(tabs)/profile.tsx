import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../src/lib/firebase";

export default function Profile() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login"); // redirect to login
    } catch (err: any) {
      Alert.alert("Sign Out Failed", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signoutBtn} onPress={handleSignOut}>
        <Text style={styles.signoutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  signoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.9)", // red
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  signoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
