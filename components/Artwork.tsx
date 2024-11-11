import { ArtworkData } from "@/utils/artworkData";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Image } from "expo-image";

type ArtworkProps = {
	artworkData: ArtworkData | null;
};

export default function Artwork({ artworkData }: ArtworkProps) {
	const { width, height } = Dimensions.get("window");
	const imageDimensionsStyle = {
		width: width - 48,
		height: height * 0.4,
	};

	if (artworkData === null) {
		return (
			<View style={styles.errorContainer}>
				<Text>Uh oh, something went wrong. Please exit and try again.</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text>{artworkData.artist}</Text>
				<Text>{artworkData.date}</Text>
			</View>
			<Text style={styles.title}>{artworkData.title}</Text>
			<Image
				contentFit="contain"
				style={[styles.image, imageDimensionsStyle]}
				source={{ uri: artworkData.imageURL }}
			/>
			<Text style={styles.description}>{artworkData.description}</Text>
			<Text style={styles.hashtags}>{artworkData.hashtags}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
		width: "100%",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginVertical: 16,
	},
	image: {
		marginBottom: 24,
	},
	description: {
		textAlign: "center",
		fontSize: 16,
		marginBottom: 8,
	},
	hashtags: {
		textAlign: "center",
		color: "gray",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
