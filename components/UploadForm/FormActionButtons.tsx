import * as artworkAPI from "@/api/artworkApi";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import { Pressable, View, Text, StyleSheet } from "react-native";

type FormActionButtonsProps = {
	createArtwork: () => ArtworkData | undefined;
	blurDuringUpload: () => void;
	clearForm: () => void;
};

export default function FormActionButtons({
	createArtwork,
	blurDuringUpload,
	clearForm,
}: FormActionButtonsProps) {
	return (
		<View style={styles.buttonsContainer}>
			<Pressable
				style={[styles.button, styles.clearButton]}
				onPress={() => clearForm()}
				accessibilityLabel="Clear Form"
				accessibilityHint="Clears all input fields in the form"
				accessibilityRole="button"
			>
				<Text style={styles.clearButtonText}>Clear Form</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => {
					const artwork = createArtwork();
					if (artwork) {
						artworkAPI.createArtwork(artwork);
						blurDuringUpload();
					}
				}}
				accessibilityLabel="Upload Artwork"
				accessibilityHint="Uploads the artwork and submits the form"
				accessibilityRole="button"
			>
				<Text style={styles.buttonText}>Upload Artwork</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between", // Spaces out buttons
		alignItems: "center", // Centers vertically
		marginTop: 28, // Optional margin for spacing
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	button: {
		backgroundColor: Colors.ArtVistaRed, // Red color for the Upload button
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff", // White text color for the Upload button
		fontSize: 16,
		fontWeight: "bold",
	},
	clearButton: {
		backgroundColor: "transparent", // Transparent background for the Clear button
		borderColor: "gray", // Grey border
		borderWidth: 2, // Border width
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	clearButtonText: {
		color: "gray", // Gray text color for the Clear button
		fontSize: 16,
		fontWeight: "bold",
	},
});
