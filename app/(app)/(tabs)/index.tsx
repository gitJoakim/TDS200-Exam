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
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text
				style={{
					fontFamily: "Dancing-Script",
					fontSize: 48,
					color: Colors.ArtVistaRed,
				}}
			>
				ArtVista
			</Text>
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
