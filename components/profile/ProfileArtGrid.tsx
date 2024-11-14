import React from "react";
import { FlatList, View, Image, StyleSheet, Text } from "react-native";
import { ArtworkData } from "@/utils/artworkData";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Link } from "expo-router";

type ProfileArtGridProps = {
	artworks: ArtworkData[];
};

export default function ProfileArtGrid({ artworks }: ProfileArtGridProps) {
	const renderItem = ({ item }: { item: ArtworkData }) => (
		<View style={styles.itemContainer}>
			{item.imageURL ? (
				<Link
					href={{
						pathname: "/artworkDetails/[id]",
						params: { id: item.id },
					}}
				>
					<Image source={{ uri: item.imageURL }} style={styles.image} />
				</Link>
			) : (
				<SimpleLineIcons name="picture" size={50} color="black" />
			)}
		</View>
	);

	return (
		<FlatList
			data={artworks}
			renderItem={renderItem}
			keyExtractor={(item) => item.id.toString()}
			numColumns={3}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.gridContainer}
		/>
	);
}

const styles = StyleSheet.create({
	gridContainer: {
		paddingTop: 10,
	},
	itemContainer: {
		width: "33.33%",
		padding: 5,
		alignItems: "center",
		marginBottom: 10,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 12,
		resizeMode: "cover",
	},
});
