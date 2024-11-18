import {
	StyleSheet,
	View,
	Text,
	RefreshControl,
	Pressable,
	Platform,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import * as artworksAPI from "@/api/artworkApi";
import React from "react";
import ArtworkCarousel from "@/components/ArtworkCarousel";
import MasonryList from "@react-native-seoul/masonry-list";
import ArtworkImage from "@/components/ArtworkGridImage";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ArtworkWebCarousel from "@/components/ArtworkWebCarousel";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
		<LinearGradient
			colors={["#F2F2F2", "#FFFFFF"]}
			style={styles.mainContainer}
			start={{ x: 0, y: 0 }} // Start at the top left
			end={{ x: 0, y: 1 }}
		>
			<Stack.Screen
				options={{
					headerLeft: () => (
						<Pressable
							style={{ paddingLeft: 12 }}
							onPress={async () => {
								handleRefresh();
							}}
						>
							<MaterialCommunityIcons
								name="refresh"
								size={24}
								color={Colors.ArtVistaRed}
							/>
						</Pressable>
					),
					headerTitle: () => (
						<Pressable
							onPress={() => {
								handleRefresh();
							}}
						>
							<Text style={styles.headerTitle}>ArtVista</Text>
						</Pressable>
					),

					headerRight: () => (
						<Pressable
							style={{ paddingRight: 12 }}
							onPress={() => setGridDisplay(!gridDisplay)}
						>
							{gridDisplay ? (
								<Ionicons name="image" size={24} color={Colors.ArtVistaRed} />
							) : (
								<Ionicons name="grid" size={24} color={Colors.ArtVistaRed} />
							)}
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
			) : Platform.OS === "web" ? (
				<ArtworkWebCarousel artworks={artworks} />
			) : (
				<ArtworkCarousel artworks={artworks} />
			)}
		</LinearGradient>
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
