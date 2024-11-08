import {
	Image,
	StyleSheet,
	Platform,
	View,
	Text,
	Modal,
	Pressable,
} from "react-native";
import Authentication from "../../authentication";
import { useState } from "react";
import * as authenticationAPI from "@/api/authenticationApi";

export default function HomeScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Welcome to ArtVista, you fuckface</Text>

				<Pressable
					style={{ backgroundColor: "red", margin: 32 }}
					onPress={() => {
						authenticationAPI.logOut();
					}}
				>
					<Text>LOG OUT NOW!!</Text>
				</Pressable>
			</View>
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
