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
 * This code is inspired by and taken from lecture material
 * With some modifications made to adapt the code to this specific project.
 ***********************************************/

type AuthContextType = {
	logIn: (email: string, password: string) => void;
	logOut: VoidFunction;
	userEmailSession?: string | null;
	user: User | null;
	isLoading: boolean;
};

// create authentication context
const AuthenticationContext = createContext<AuthContextType>({
	logIn: () => null,
	logOut: () => null,
	isLoading: false,
	user: null,
});

// Custom hook to use the Authentication Context
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
	const [userAuthSession, setUserAuthSession] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

  //set userSession on login and navigate to home or remove on log out
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUserAuthSession(user);
			} else {
				setUserAuthSession(null);
			}
			router.replace("/");
			setIsLoading(false);
		});
	}, []);

	return (
		<AuthenticationContext.Provider
			value={{
				logIn: async (email: string, password: string) => {
					await authenticationAPI.logIn(email, password);
				},
				logOut: async () => {
					await authenticationAPI.logOut();
				},
				user: userAuthSession,
				isLoading: isLoading,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
}
