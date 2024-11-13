import {
	View,
	Text,
	StyleSheet,
	Platform,
	Dimensions,
	SafeAreaView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ArtworkData } from "@/utils/artworkData";
import { Link } from "expo-router";
import { Image } from "expo-image";

type ArtworkCarouselItemProps = {
	artwork: ArtworkData;
	onLayout?: (e: any) => void;
};
const { height } = Dimensions.get("window");

export default function ArtworkCarouselItem({
	artwork,
}: ArtworkCarouselItemProps) {
	const { width, height } = Dimensions.get("window");
	// setting it slightly bigger for web
	const imageDimensionsStyle =
		Platform.OS === "web"
			? { width, height: height * 0.6 }
			: { width: width - 64, height: height * 0.4 };
	return (
		<SafeAreaView style={styles.imageContainer}>
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
			<Text style={styles.artworkTitle}>'{artwork.title}'</Text>
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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	artworkTitle: {
		textAlign: "center",
		marginBottom: 12,
		fontSize: 24,
		fontStyle: "italic",
	},
	image: {
		marginBottom: 48,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		...Platform.select({
			web: {
				marginTop: height * 0.05,
				marginBottom: height * 0.025,
			},
		}),
	},
});
