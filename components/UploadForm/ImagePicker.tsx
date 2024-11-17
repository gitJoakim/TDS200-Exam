import { View, Text, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				marginVertical: 28,
			}}
		>
			<View
				style={{
					width: "100%",
					height: height,
					borderColor: "black",
					borderWidth: 2,
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
					/>
				) : (
					<MaterialCommunityIcons
						name="image-off-outline"
						size={200}
						color={Colors.ArtVistaRed}
					/>
					// <Text
					// 	style={{
					// 		textAlign: "center",
					// 		fontSize: 32,
					// 		fontWeight: "bold",
					// 	}}
					// >
					// 	Add an image of the Artwork
					// </Text>
				)}
			</View>

			<View
				style={{
					flexDirection: "row",
					gap: 64,
					marginBottom: 24,
				}}
			>
				{/* check platform and dont render camera modal button for web */}
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
