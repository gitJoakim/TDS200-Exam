import { AuthenticationSessionProvider } from "@/providers/AuthContextProvider";
import { Slot } from "expo-router";

export default function RootLayout() {
	return (
		<AuthenticationSessionProvider>
			<Slot />
		</AuthenticationSessionProvider>
	);
}
