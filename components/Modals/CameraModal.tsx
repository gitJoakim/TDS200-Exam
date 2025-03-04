import { CameraType, CameraView, useCameraPermissions } from "expo-camera";

import {
	Text,
	View,
	StyleSheet,
	Button,
	TouchableOpacity,
	Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";

type CameraModalProps = {
	closeModal: () => void;
	setImage: (image: string) => void;
};

export default function CameraModal({
	closeModal,
	setImage,
}: CameraModalProps) {
	const [permission, requestPermission] = useCameraPermissions();
	const [facing, setFacing] = useState<CameraType>("back");

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text
					style={styles.message}
					accessibilityRole="text"
					accessibilityLabel="Permission needed to use camera"
				>
					We need your permission to use the camera
				</Text>
				<Button
					onPress={requestPermission}
					title="Grant Permission"
					accessibilityLabel="Grant camera permission"
				/>
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

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View style={styles.container}>
			
			{/* Camera View */}
			<CameraView
				style={styles.camera}
				facing={facing}
				ref={(r) => (camera = r)}
				accessibilityLabel="Camera view"
			>

				{/* Camera buttons container */}
				<View style={styles.buttonContainer}>

					{/* flip camera button */}
					<TouchableOpacity
						style={styles.button}
						onPress={() => toggleCameraFacing()}
						accessibilityRole="button"
						accessibilityLabel="Flip camera"
						accessibilityHint="Tap to flip between front and back camera"
					>
						{Platform.OS === "android" ? (
							<MaterialIcons
								name="flip-camera-android"
								size={30}
								color="white"
							/>
						) : (
							<MaterialIcons name="flip-camera-ios" size={24} color="white" />
						)}
					</TouchableOpacity>

					{/* Take picture button */}
					<TouchableOpacity
						style={styles.button}
						onPress={() => captureImage()}
						accessibilityRole="button"
						accessibilityLabel="Capture photo"
						accessibilityHint="Tap to take a photo"
					>
						<Entypo name="camera" size={32} color="white" />
					</TouchableOpacity>

					{/* Go back button */}
					<TouchableOpacity
						style={styles.button}
						onPress={() => closeModal()}
						accessibilityRole="button"
						accessibilityLabel="Close camera"
						accessibilityHint="Tap to close the camera modal"
					>
						<AntDesign name="back" size={30} color="white" />
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
