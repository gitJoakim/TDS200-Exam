import { AuthenticationSessionProvider } from "@/providers/AuthContextProvider";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		"Dancing-Script": require("../assets/fonts/DancingScript-Regular.ttf"),
	});

	// loading indicator while Dancing-Script font is loading
	if (!fontsLoaded) {
		return (
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	return (
		<AuthenticationSessionProvider>
			<Slot />
		</AuthenticationSessionProvider>
	);
}

// puts loading indicator in the middle of the screen
const styles = StyleSheet.create({
	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
