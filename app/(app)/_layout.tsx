import { useAuthSession } from "@/providers/AuthContextProvider";
import { Redirect, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function AppLayout() {
	const { userNameSession, isLoading } = useAuthSession();

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Fetching user... Please wait..</Text>
			</View>
		);
	}

	if (!userNameSession) {
		return <Redirect href="/authentication" />;
	}

	return (
		<Stack>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					title: "Home",
					animation: "fade_from_bottom",
				}}
			></Stack.Screen>
		</Stack>
	);
}
