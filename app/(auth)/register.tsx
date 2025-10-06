import { Ionicons } from "@expo/vector-icons";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
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
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AuthScaffold from "../../components/AuthScaffold";
import { auth, db } from "../../src/lib/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    GOOGLE_EXPO_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID,
    GOOGLE_WEB_CLIENT_ID,
    FACEBOOK_APP_ID,
  } = Constants.expoConfig?.extra || {};

  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest({
    clientId: GOOGLE_EXPO_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  const [fbRequest, fbResponse, promptFacebook] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
  });

  const finishProfileDoc = async (uid: string, emailVal: string) => {
    await setDoc(
      doc(db, "users", uid),
      {
        uid,
        email: emailVal,
        role: "traveler",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleSocialLogin = useCallback(
    async (credential: any) => {
      try {
        setLoading(true);
        const cred = await signInWithCredential(auth, credential);
        await finishProfileDoc(cred.user.uid, cred.user.email ?? "");
        router.replace("/homesection");
      } catch (err: any) {
        Alert.alert("Social Login Failed", err.message);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

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

  const handleRegister = async () => {
    if (!email || !password || !confirm)
      return Alert.alert("Please fill in all fields.");
    if (password.length < 6)
      return Alert.alert("Password must be at least 6 characters.");
    if (password !== confirm)
      return Alert.alert("Passwords do not match.");

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await finishProfileDoc(cred.user.uid, email);
      router.replace("/homesection");
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold title="Sign up with">
      <Text style={styles.subtitle}>
        Use your email or continue with a provider below
      </Text>

      {/* 🔹 Social Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialBtn, { backgroundColor: "#fff" }]}
          disabled={!googleRequest}
          onPress={() => promptGoogle()}
        >
          <Ionicons name="logo-google" size={18} color="#000" />
          <Text style={[styles.socialText, { color: "#000" }]}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialBtn, { backgroundColor: "#fff" }]}
          disabled={!fbRequest}
          onPress={() => promptFacebook()}
        >
          <Ionicons name="logo-facebook" size={18} color="#000" />
          <Text style={[styles.socialText, { color: "#000" }]}>Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={{ color: "#ccc" }}>Or</Text>
        <View style={styles.line} />
      </View>

      {/* Email / Password Fields */}
      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#d1d5db"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#d1d5db"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#d1d5db"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={styles.input}
      />

      {/* Register Button */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text style={styles.footerLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  socialText: { marginLeft: 8, fontWeight: "600", fontSize: 15 },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 10,
  },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.25)" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  primaryBtn: {
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: "#16A34A",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    marginTop: 4,
  },
  footerLink: { color: "#93c5fd", fontWeight: "700" },
});
