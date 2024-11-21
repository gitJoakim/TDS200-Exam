import React from "react";
import {
	FlatList,
	View,
	Image,
	StyleSheet,
	Dimensions,
	Platform,
	Text,
} from "react-native";
import { ArtworkData } from "@/utils/artworkData";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";

type ProfileArtGridProps = {
	artworks: ArtworkData[];
};

export default function ProfileArtGrid({ artworks }: ProfileArtGridProps) {
	const renderItem = ({ item }: { item: ArtworkData }) => (
		<View
			style={styles.itemContainer}
			accessible={true}
			accessibilityRole="image"
		>
			{item.imageURL && (
				<Link
					href={{
						pathname: "/artworkDetails/[id]",
						params: { id: item.id },
					}}
					accessible={true}
					accessibilityLabel={`View details for artwork titled "${item.title}"`}
				>
					<View>
						<Image
							source={{ uri: item.imageURL }}
							style={styles.image}
							accessible={true}
							accessibilityLabel={`Artwork titled ${item.title}`}
						/>
					</View>
				</Link>
			)}
		</View>
	);

	if (artworks.length === 0) {
		return (
			<View style={styles.mainContainer}>
				<Text
					accessible={true}
					accessibilityLabel="No artworks available to display"
				>
					No artworks available.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.mainContainer}>
			<FlatList
				data={artworks}
				renderItem={renderItem}
				keyExtractor={(item) => item.id.toString()}
				numColumns={3}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.gridContainer}
			/>
		</View>
	);
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		backgroundColor: "white",
		borderTopColor: Colors.ArtVistaRed,
		borderTopWidth: 1,
	},
	gridContainer: {
		paddingTop: 10,
		paddingBottom: 10,
		width: Platform.OS === "web" ? "50%" : "100%",
	},
	itemContainer: {
		width: (Platform.OS === "web" ? windowWidth * 0.5 : windowWidth) / 3 - 10,
		padding: 5,
		alignItems: "center",
		marginBottom: 10,
	},
	image: {
		width: (Platform.OS === "web" ? windowWidth * 0.5 : windowWidth) / 3 - 20,
		height: (Platform.OS === "web" ? windowWidth * 0.5 : windowWidth) / 3 - 20,
		resizeMode: "cover",
		borderWidth: 4,
		borderColor: Colors.ArtVistaRed,
		borderRadius: 8,
	},
});
