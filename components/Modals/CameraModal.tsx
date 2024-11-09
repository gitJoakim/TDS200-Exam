import { CameraView, useCameraPermissions } from "expo-camera";

import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";

type CameraModalProps = {
	closeModal: () => void;
	setImage: (image: string) => void;
};

export default function CameraModal({
	closeModal,
	setImage,
}: CameraModalProps) {
	const [permission, requestPermission] = useCameraPermissions();

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	let camera: CameraView | null = null;

	const captureImage = async () => {
		if (camera) {
			const image = await camera.takePictureAsync();
			if (image) {
				setImage(image.uri);
				closeModal();
			}
		}
	};

	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
				facing={"back"}
				ref={(r) => (camera = r)}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => captureImage()}
					>
						<Text style={styles.text}>Capture</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={() => closeModal()}>
						<Text style={styles.text}>Back</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		justifyContent: "space-between",
		marginBottom: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
