import { addArtwork } from "@/api/artworkApi";
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
				style={styles.button}
				onPress={() => {
					const artwork = createArtwork();
					if (artwork) {
						addArtwork(artwork);
						blurDuringUpload();
					}
				}}
			>
				<Text style={styles.buttonText}>Post Artwork</Text>
			</Pressable>

			<Pressable
				style={[styles.button, styles.clearButton]}
				onPress={() => clearForm()}
			>
				<Text style={styles.clearButtonText}>Clear Form</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between", // Spaces out buttons
		alignItems: "center", // Centers vertically
		marginTop: 20, // Optional margin for spacing
		paddingHorizontal: 20,
	},
	button: {
		backgroundColor: "#4CAF50", // Green color for the Post/Upload button
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff", // White text color
		fontSize: 16,
		fontWeight: "bold",
	},
	clearButton: {
		backgroundColor: "#F44336", // Red color for the Clear button
	},
	clearButtonText: {
		color: "#fff", // White text color for the clear button
		fontSize: 16,
		fontWeight: "bold",
	},
});
