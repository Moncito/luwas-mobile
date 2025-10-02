import { Ionicons } from "@expo/vector-icons";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../src/lib/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    GOOGLE_EXPO_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID,
    GOOGLE_WEB_CLIENT_ID,
    FACEBOOK_APP_ID,
  } = Constants.expoConfig?.extra || {};

  // 👉 Google Auth
  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest({
    clientId: GOOGLE_EXPO_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  // 👉 Facebook Auth
  const [fbRequest, fbResponse, promptFacebook] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
  });

  // ✅ Handle Social Login
  const handleSocialLogin = useCallback(
    async (credential: any) => {
      try {
        setLoading(true);
        const cred = await signInWithCredential(auth, credential);
        await setDoc(
          doc(db, "users", cred.user.uid),
          {
            uid: cred.user.uid,
            email: cred.user.email,
            role: "traveler",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
        router.replace("/(tabs)/home");
      } catch (err: any) {
        Alert.alert("Social Login Failed", err.message);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // ✅ Effect for Socials
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      handleSocialLogin(credential);
    }
    if (fbResponse?.type === "success") {
      const { access_token } = fbResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
      handleSocialLogin(credential);
    }
  }, [googleResponse, fbResponse, handleSocialLogin]);

  // ✅ Email/Password Register
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email,
        role: "traveler",
        createdAt: serverTimestamp(),
      });
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" }} />
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <BlurView intensity={80} tint="light" style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up with email or continue with a provider</Text>

          {/* Socials */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              disabled={!googleRequest}
              onPress={() => promptGoogle()}
            >
              <Ionicons name="logo-google" size={20} color="white" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              disabled={!fbRequest}
              onPress={() => promptFacebook()}
            >
              <Ionicons name="logo-facebook" size={20} color="white" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={{ color: "#ddd" }}>Or</Text>
            <View style={styles.line} />
          </View>

          {/* Inputs */}
          <TextInput
            placeholder="Your Email Address"
            placeholderTextColor="#ddd"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Create a Password"
            placeholderTextColor="#ddd"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#ddd"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.registerBtn}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Register</Text>}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.footerLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </BlurView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 20, width: "100%", maxWidth: 400, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", overflow: "hidden" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 5, color: "white" },
  subtitle: { textAlign: "center", color: "#ddd", marginBottom: 15 },
  socialRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  socialBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingVertical: 12, marginHorizontal: 5 },
  socialText: { marginLeft: 8, fontWeight: "500", color: "white" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.3)" },
  input: { borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", borderRadius: 8, padding: 12, marginBottom: 10, color: "white" },
  registerBtn: { backgroundColor: "rgba(22, 163, 74, 0.8)", borderRadius: 8, paddingVertical: 14, marginBottom: 12 },
  registerText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },
  footerText: { textAlign: "center", color: "white" },
  footerLink: { color: "#93c5fd", fontWeight: "600" },
});
