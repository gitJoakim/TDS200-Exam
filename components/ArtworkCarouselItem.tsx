import { View, Image, Text, StyleSheet, Platform } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ArtworkData } from "@/utils/artworkData";

type ArtworkCarouselItemProps = {
	artwork: ArtworkData;
};

export default function ArtworkCarouselItem({
	artwork,
}: ArtworkCarouselItemProps) {
	return (
		<View style={styles.imageContainer}>
			<Image
				style={styles.image}
				source={{ uri: artwork.imageURL }}
				resizeMode="cover"
			/>
			<Text style={{ textAlign: "center", marginBottom: 12, fontSize: 24 }}>
				"{artwork.title}"
			</Text>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: 6,
				}}
			>
				<FontAwesome name="user-circle" size={16} color="black" />

				<Text style={{ textAlign: "center" }}>{artwork.artist}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	artistText: {
		textAlign: "center",
	},
	image: {
		width: 300,
		height: 400,
		marginBottom: 48,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		// Web-specific style
		...(Platform.OS === "web" && {
			boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.7)", // boxShadow for web
		}),
		// Mobile-specific styles
		...(Platform.OS !== "web" && {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 10 },
			shadowOpacity: 0.7,
			shadowRadius: 30,
		}),
		// Android-specific styles (elevation for Android)
		...(Platform.OS === "android" && {
			elevation: 10, // Use elevation for Android shadow
			shadowColor: "red",
		}),
	},
});
