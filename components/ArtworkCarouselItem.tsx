import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ArtworkData } from "@/utils/artworkData";
import { Link } from "expo-router";
import { Image } from "expo-image";

type ArtworkCarouselItemProps = {
	artwork: ArtworkData;
};

export default function ArtworkCarouselItem({
	artwork,
}: ArtworkCarouselItemProps) {
	const { width, height } = Dimensions.get("window");
	const imageDimensionsStyle = { width: width - 64, height: height * 0.4 };
	return (
		<View style={styles.imageContainer}>
			<Link
				href={{ pathname: "/artworkDetails/[id]", params: { id: artwork.id } }}
			>
				<View>
					<Image
						style={[styles.image, imageDimensionsStyle]}
						source={{ uri: artwork.imageURL }}
						contentFit="contain"
					/>
				</View>
			</Link>
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
		marginBottom: 48,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.7,
		shadowRadius: 30,
	},
});
