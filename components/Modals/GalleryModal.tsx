import { Text, View, StyleSheet, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

type ImageModalProps = {
	closeModal: () => void;
	setImage: (image: string) => void;
};

export default function ImageModal({ closeModal, setImage }: ImageModalProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);
			closeModal();
		}
	};

	return (
		<View style={styles.container}>
			<Button
				title="Click here to pick an image from camera roll"
				onPress={pickImage}
			/>
			{selectedImage && (
				<Image source={{ uri: selectedImage }} style={styles.selectedImage} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedImage: {
		width: 200,
		height: 200,
	},
});
