import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";

import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authenticationAPI from "@/api/authenticationApi";

/***********************************************
 * This code is inspired by and taken from lecture materials.
 * With some slight modifications made to adapt the code to this specific project.
 *
 ***********************************************/

type AuthContextType = {
  logIn: (email: string, password: string) => void;
  logOut: VoidFunction;
  userEmailSession?: string | null; // Renamed to userEmailSession
  user: User | null;
  isLoading: boolean;
};

const AuthenticationContext = createContext<AuthContextType>({
  logIn: () => null,
  logOut: () => null,
  userEmailSession: null, // Renamed to userEmailSession
  isLoading: false,
  user: null,
});

export function useAuthSession() {
  const value = useContext(AuthenticationContext);
  if (!value) {
    throw new Error(
      "useAuthSession must be used within an AuthenticationContext Provider"
    );
  }

  return value;
}

export function AuthenticationSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userEmailSession, setUserEmailSession] = useState<string | null>(null); // Store email session
  const [userAuthSession, setUserAuthSession] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmailSession(user.email); // Set userEmailSession to the email
        setUserAuthSession(user);
      } else {
        setUserEmailSession(null); // Clear email session if no user
        setUserAuthSession(null); // Clear user session if no user
      }
      router.replace("/"); // Redirect after state change
      setIsLoading(false); // End loading
    });
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        logIn: async (email: string, password: string) => {
          await authenticationAPI.logIn(email, password);
          setUserEmailSession(email); // Set email after successful login
        },
        logOut: async () => {
          await authenticationAPI.logOut();
          setUserEmailSession(null); // Clear email session on log out
        },
        userEmailSession, // Updated to store email session
        user: userAuthSession,
        isLoading: isLoading,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
