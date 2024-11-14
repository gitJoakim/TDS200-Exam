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
	logIn: (username: string, password: string) => void;
	logOut: VoidFunction;
	userNameSession?: string | null;
	user: User | null;
	isLoading: boolean;
};

const AuthenticationContext = createContext<AuthContextType>({
	logIn: () => null,
	logOut: () => null,
	userNameSession: null,
	isLoading: false,
	user: null,
});

export function useAuthSession() {
	const value = useContext(AuthenticationContext);
	if (!value) {
		throw new Error(
			"UseAuthSession must be used within a AuthContext Provider"
		);
	}

	return value;
}

export function AuthenticationSessionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [userSession, setUserSession] = useState<string | null>(null);
	const [userAuthSession, setUserAuthSession] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUserSession(user.displayName);
				setUserAuthSession(user);
			} else {
				setUserSession(null);
				setUserAuthSession(null);
			}
			router.replace("/");
			setIsLoading(false);
		});
	}, []);

	return (
		<AuthenticationContext.Provider
			value={{
				logIn: async (username: string, password: string) => {
					await authenticationAPI.logIn(username, password);
					setUserSession(username);
				},
				logOut: async () => {
					await authenticationAPI.logOut();
				},
				userNameSession: userSession,
				user: userAuthSession,
				isLoading: isLoading,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
}
