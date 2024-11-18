import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

type AlertModalProps = {
	prompt: string;
	optionYes: string;
	optionNo: string;
	onConfirm: () => void;
	onCancel: () => void;
};

export default function AlertModal({
	prompt,
	optionYes,
	optionNo,
	onConfirm,
	onCancel,
}: AlertModalProps) {
	return (
		<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>
				{/* Prompt message */}
				<Text style={styles.promptText}>{prompt}</Text>

				{/* Yes and No buttons */}
				<View style={styles.buttonsContainer}>
					<Pressable
						style={[styles.button, styles.noButton]}
						onPress={onCancel}
					>
						<Text style={styles.noText}>{optionNo}</Text>
					</Pressable>
					<Pressable
						style={[styles.button, styles.yesButton]}
						onPress={onConfirm}
					>
						<Text style={styles.yesText}>{optionYes}</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		width: "80%",
		borderRadius: 10,
		alignItems: "center",
	},
	promptText: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	yesText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "white",
	},
	noText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "grey",
	},
	yesButton: {
		backgroundColor: Colors.ArtVistaRed, // Yes button color (red)
	},
	noButton: {
		borderColor: "grey",
		borderWidth: 3,
	},
});
