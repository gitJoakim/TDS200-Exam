import { Text, View, StyleSheet, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useMediaLibraryPermissions } from "expo-image-picker";

type GalleryModalProps = {
	closeModal: () => void;
	setImage: (image: string) => void;
};

export default function GalleryModal({
	closeModal,
	setImage,
}: GalleryModalProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [permission, requestPermission] = useMediaLibraryPermissions();

	// Open the image picker if permission is granted
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			quality: 1,
		});

		// If the user selects an image
		if (!result.canceled) {
			setImage(result.assets[0].uri);
			closeModal();
		}
	};

	// If permission is not granted, request permission once
	const handlePermissionRequest = async () => {
		if (permission === null) {
			await requestPermission();
		}
	};

	// Handle permission and display UI
	if (permission === null) {
		// Request permission when component is mounted
		handlePermissionRequest();
		return <View />;
	}

	if (!permission.granted) {
		// If permission is denied, show the request permission UI
		return (
			<View style={styles.container}>
				<Text
					style={styles.message}
					accessibilityLabel="Permission required to access gallery"
				>
					We need your permission to access your gallery
				</Text>

				{/* button container */}
				<View style={styles.buttonContainer}>
					<View style={styles.buttonSpacing}>
						<Button
							title="Grant Permission"
							onPress={requestPermission}
							accessibilityLabel="Grant permission to access gallery"
						/>
					</View>
					<View style={styles.buttonSpacing}>
						<Button
							color="red"
							title="Exit"
							onPress={closeModal}
							accessibilityLabel="Deny permission to access gallery and Close modal"
						/>
					</View>
				</View>
			</View>
		);
	}

	return (
		<View
			style={styles.container}
			accessibilityViewIsModal={true}
			accessible={true}
		>
			<Text style={styles.message} accessibilityLabel="Image picker modal">
				Select an image from your gallery
			</Text>

			{/* Button container */}
			<View style={styles.buttonContainer}>
				<View style={styles.buttonSpacing}>
					<Button
						title="Pick Image"
						onPress={pickImage}
						accessibilityLabel="Pick an image from the gallery"
					/>
				</View>

				<View style={styles.buttonSpacing}>
					<Button
						title="Go Back"
						onPress={closeModal}
						color="red"
						accessibilityLabel="Exit and Close modal"
					/>
				</View>
			</View>
			
			{/* Selected image */}
			{selectedImage && (
				<Image
					source={{ uri: selectedImage }}
					style={styles.selectedImage}
					accessibilityLabel="Selected image preview"
					accessibilityHint="This is the image you selected from the gallery"
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedImage: {
		width: 200,
		height: 200,
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	buttonBorder: {
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 8,
		padding: 8,
		marginVertical: 24,
	},
	buttonSpacing: {
		marginVertical: 12,
	},
	buttonContainer: {
		flexDirection: "row",
		columnGap: 20,
	},
});
