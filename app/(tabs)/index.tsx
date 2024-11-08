import { Image, StyleSheet, Platform, View, Text } from "react-native";
import Authentication from "../authentication";

export default function HomeScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Authentication />
			{/*
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>ArtVista</Text>
			</View>
*/}
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
});
