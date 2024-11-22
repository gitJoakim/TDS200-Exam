import { View, Text, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ImagePickerProps = {
	image: string | null;
	setIsGalleryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsCameraModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	width: number;
	height: number;
};

export default function ImagePicker({
	image,
	setIsGalleryModalOpen,
	setIsCameraModalOpen,
	width,
	height,
}: ImagePickerProps) {
	// dimensions of image
	const imageDimensionsStyle = { width: width, height: height };

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				marginVertical: 28,
			}}
		>
			{/* Image if the user has set one, else image icon to hint */}
			<View
				style={{
					width: "100%",
					height: height,
					justifyContent: "center",
					alignItems: "center",
					marginBottom: 12,
				}}
			>
				{image ? (
					<Image
						source={{ uri: image }}
						contentFit="contain"
						style={imageDimensionsStyle}
						accessibilityLabel="Selected artwork image"
					/>
				) : (
					<MaterialCommunityIcons
						name="image-off-outline"
						size={200}
						color="black"
						accessibilityLabel="No image selected"
					/>
				)}
			</View>

			{/* Camera and gallery buttons */}
			<View
				style={{
					flexDirection: "row",
					gap: 64,
					marginBottom: 24,
				}}
			>
				{/* check platform and dont render camera button for web */}
				{Platform.OS !== "web" && (
					<Pressable
						style={{
							borderRadius: 50,
							borderWidth: 2,
							borderColor: Colors.ArtVistaRed,
							padding: 16,
						}}
						onPress={() => {
							setIsCameraModalOpen(true);
						}}
						accessibilityLabel="Open camera to capture an image"
						accessibilityRole="button"
					>
						<Feather name="camera" size={32} color={Colors.ArtVistaRed} />
					</Pressable>
				)}
				<Pressable
					style={{
						borderRadius: 50,
						borderWidth: 2,
						borderColor: Colors.ArtVistaRed,
						padding: 16,
					}}
					onPress={() => {
						setIsGalleryModalOpen(true);
					}}
					accessibilityLabel="Open gallery to select an image"
					accessibilityRole="button"
				>
					<MaterialCommunityIcons
						name="file-image-plus"
						size={32}
						color={Colors.ArtVistaRed}
					/>
				</Pressable>
			</View>
		</View>
	);
}
