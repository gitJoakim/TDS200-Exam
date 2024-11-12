import { View, StyleSheet, Image } from "react-native";
import { ArtworkData } from "@/utils/artworkData";

type ArtworkImageOnlyProps = {
	artwork: ArtworkData;
};

export default function ArtworkImageOnly({ artwork }: ArtworkImageOnlyProps) {
	return (
		<View style={styles.imageContainer}>
			<Image
				style={[styles.image]}
				source={{ uri: artwork.imageURL }}
				resizeMode="contain"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	image: {
		width: 700,
		height: 700,
	},
});
