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
			{ /* Clear all fields button */ }
			<Pressable
				style={[styles.button, styles.clearButton]}
				onPress={() => clearForm()}
				accessibilityLabel="Clear Form"
				accessibilityHint="Clears all input fields in the form"
				accessibilityRole="button"
			>
				<Text style={styles.clearButtonText}>Clear Form</Text>
			</Pressable>

			{ /* Upload artworks button */ }
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
		justifyContent: "space-between", 
		alignItems: "center",
		marginTop: 28, 
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	button: {
		backgroundColor: Colors.ArtVistaRed,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff", 
		fontSize: 16,
		fontWeight: "bold",
	},
	clearButton: {
		backgroundColor: "transparent",
		borderColor: "gray",
		borderWidth: 2, 
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	clearButtonText: {
		color: "gray", 
		fontSize: 16,
		fontWeight: "bold",
	},
});
