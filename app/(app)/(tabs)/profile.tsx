import { useAuthSession } from "@/providers/AuthContextProvider";
import { View, Text, Pressable } from "react-native";

export default function Profile() {
	const { userNameSession, logOut } = useAuthSession();

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Hello, {userNameSession}!</Text>

			<Pressable
				style={{
					backgroundColor: "red",
					padding: 16,
					borderRadius: 8,
					marginTop: 64,
				}}
				onPress={() => {
					logOut();
				}}
			>
				<Text>Log out</Text>
			</Pressable>
		</View>
	);
}

