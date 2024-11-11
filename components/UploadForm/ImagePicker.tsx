import { View, Text, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type ImagePickerProps = {
	image: string | null;
	setImage: React.Dispatch<React.SetStateAction<string | null>>;
	setIsGalleryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsCameraModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	width: number;
	height: number;
};

export default function ImagePicker({
	image,
	setImage,
	setIsGalleryModalOpen,
	setIsCameraModalOpen,
	width,
	height,
}: ImagePickerProps) {
	const imageDimensionsStyle = { width: width, height: height };
	return (
		<View
			style={{
				width: "100%",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View
				style={{
					width: "100%",
					height: 300,
					borderWidth: image ? 0 : 2,
					justifyContent: "center",
				}}
			>
				{image ? (
					<Image
						source={{ uri: image }}
						contentFit="contain"
						style={imageDimensionsStyle}
					/>
				) : (
					<Text
						style={{
							textAlign: "center",
							fontSize: 32,
							fontWeight: "bold",
						}}
					>
						Add an image of the Artwork
					</Text>
				)}
			</View>

			<View
				style={{
					flexDirection: "row",
					gap: 64,
				}}
			>
				{/* check platform and dont render camera modal button for web */}
				{Platform.OS !== "web" && (
					<Pressable
						style={{
							borderRadius: 50,
							backgroundColor: "orange",
							padding: 16,
						}}
						onPress={() => {
							setIsCameraModalOpen(true);
						}}
					>
						<Feather name="camera" size={32} color="black" />
					</Pressable>
				)}
				<Pressable
					style={{
						borderRadius: 50,
						backgroundColor: "orange",
						padding: 16,
					}}
					onPress={() => {
						setIsGalleryModalOpen(true);
					}}
				>
					<FontAwesome name="image" size={32} color="black" />
				</Pressable>
			</View>
		</View>
	);
}
