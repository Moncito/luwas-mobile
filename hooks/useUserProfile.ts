import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../src/lib/firebase";

export function useUserProfile() {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setName(null);
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || "Traveler");
        } else {
          setName("Traveler");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setName("Traveler");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { name, loading };
}
