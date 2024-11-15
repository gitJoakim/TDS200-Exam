import { Colors } from "@/constants/Colors";
import { useAuthSession } from "@/providers/AuthContextProvider";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function AppLayout() {
	const { user, isLoading } = useAuthSession();

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
				<Text style={{ color: Colors.ArtVistaRed }}>Loading ArtVista</Text>
			</View>
		);
	}

	if (!user) {
		return <Redirect href="/authentication" />;
	}

	return (
		<Stack>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					title: "Home",
					animation: "fade",
				}}
			></Stack.Screen>
		</Stack>
	);
}
