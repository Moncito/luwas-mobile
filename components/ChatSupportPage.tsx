// app/(support)/chat-support-page.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { db } from "../src/lib/firebase";

export default function ChatSupportPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const guestId = user?.uid || uuidv4(); // fallback if not logged in

  // ✅ Initialize or join conversation
  useEffect(() => {
    const convoRef = doc(db, "conversations", guestId);
    const messagesRef = collection(convoRef, "messages");

    // Create conversation document if not yet created
    setDoc(
      convoRef,
      {
        userId: guestId,
        userName: user?.displayName || "Traveler",
        lastMessage: "Conversation started",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Subscribe to message updates
    const q = query(messagesRef, orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      const newMsgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(newMsgs);
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300);
    });

    return unsub;
  }, []);

  // ✉️ Send message
  const sendMessage = async () => {
    const msg = message.trim();
    if (!msg) return;

    const convoRef = doc(db, "conversations", guestId);
    const messagesRef = collection(convoRef, "messages");

    // Save message
    await addDoc(messagesRef, {
      text: msg,
      sender: "user",
      createdAt: serverTimestamp(),
    });

    // Update conversation metadata
    await setDoc(
      convoRef,
      {
        lastMessage: msg,
        updatedAt: serverTimestamp(),
        lastMessageSender: "user",
      },
      { merge: true }
    );

    setMessage("");
  };

  // 💬 Render message bubbles
  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === "user";
    const isAdmin = item.sender === "admin";

    const bgColor = isUser
      ? "#007AFF"
      : isAdmin
      ? "#22C55E"
      : "#E5E7EB"; // just in case
    const textColor = isUser || isAdmin ? "white" : "black";

    return (
      <View
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          marginVertical: 6,
          marginHorizontal: 12,
          padding: 12,
          borderRadius: 18,
          maxWidth: "75%",
          backgroundColor: bgColor,
        }}
      >
        <Text style={{ color: textColor, fontSize: 15 }}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: Platform.OS === "ios" ? 48 : 16,
          height: Platform.OS === "ios" ? 96 : 72,
          backgroundColor: "#007AFF",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace("/(tabs)/profile")
          }
          style={{ position: "absolute", left: 16, bottom: 10, padding: 6 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
          Chat Support 💬
        </Text>
      </View>

      {/* Messages */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      {/* Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#eee",
          backgroundColor: "#fff",
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={{
            flex: 1,
            backgroundColor: "#f9f9f9",
            borderRadius: 25,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 8,
            backgroundColor: "#007AFF",
            borderRadius: 24,
            padding: 12,
          }}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
