import {
	StyleSheet,
	View,
	Text,
	RefreshControl,
	Pressable,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import Artwork from "@/components/Artwork";
import * as artworksAPI from "@/api/artworkApi";
import React from "react";
import ArtworkCarousel from "@/components/ArtworkCarousel";
import MasonryList from "@react-native-seoul/masonry-list";
import ArtworkImage from "@/components/ArtworkGridImage";
import { Stack } from "expo-router";

export default function HomeScreen() {
	const [artworks, setArtworks] = useState<ArtworkData[]>([]);
	const [gridDisplay, setGridDisplay] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	async function getArtworks() {
		setRefreshing(true);
		const artworks = await artworksAPI.getAllArtworks();
		setArtworks(artworks);
		setRefreshing(false);
	}

	const handleRefresh = useCallback(() => {
		console.log("refreshing");
		getArtworks();
	}, []);

	useEffect(() => {
		getArtworks();
	}, []);

	return (
		<View style={styles.mainContainer}>
			<Stack.Screen
				options={{
					headerLeft: () => (
						<Pressable
							style={{ paddingLeft: 6 }}
							onPress={async () => {
								console.log("left click");
							}}
						>
							<Text>Left</Text>
						</Pressable>
					),
					headerTitle: () => (
						<Pressable onPress={handleRefresh}>
							<Text style={styles.headerTitle}>ArtVista</Text>
						</Pressable>
					),

					headerRight: () => (
						<Pressable
							style={{ paddingRight: 6 }}
							onPress={() => console.log("right click")}
						>
							<Text>Right</Text>
						</Pressable>
					),
					headerTitleAlign: "center", // needed to center on android and web
				}}
			/>

			{gridDisplay ? (
				<MasonryList
					style={{ marginVertical: 6 }}
					numColumns={2}
					data={artworks}
					keyExtractor={(item): string => item.id}
					contentContainerStyle={{
						paddingHorizontal: 6,
					}}
					renderItem={({ item }) => (
						<ArtworkImage artwork={item as ArtworkData} />
					)}
					refreshing={refreshing} // Controls the loading spinner when refreshing
					onRefresh={handleRefresh}
				/>
			) : (
				<ArtworkCarousel artworks={artworks} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		textAlign: "center",
		fontFamily: "Dancing-Script",
		fontSize: 36,
		color: Colors.ArtVistaRed,
	},
});
