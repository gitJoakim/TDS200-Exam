import {
	StyleSheet,
	View,
	Text,
	RefreshControl,
	Pressable,
	Platform,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import * as artworkAPI from "@/api/artworkApi";
import React from "react";
import ArtworkCarousel from "@/components/ArtworkCarousel";
import MasonryList from "@react-native-seoul/masonry-list";
import ArtworkImage from "@/components/ArtworkGridImage";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ArtworkWebCarousel from "@/components/ArtworkWebCarousel";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
	const [artworks, setArtworks] = useState<ArtworkData[]>([]);
	const [gridDisplay, setGridDisplay] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [orderByNewest, setOrderByNewest] = useState(true);

	// fetch artworks by newest or oldest depending on whats set
	async function getArtworks() {
		setArtworks([]);
		setIsLoading(true);
		const artworks = await artworkAPI.getAllArtworksByOrder(orderByNewest);
		setArtworks(artworks);
		setIsLoading(false);
	}

	// fetch artworks whenever either one of the buttons are selected
	useEffect(() => {
		getArtworks();
	}, [orderByNewest]);

	// fetches artworks on launch
	useEffect(() => {
		getArtworks();
	}, []);

	return (
		<View style={styles.mainContainer}>
			<Stack.Screen
				options={{
					headerLeft: () => (
						<Pressable
							style={{ paddingLeft: 12 }}
							onPress={async () => {
								getArtworks();
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
								getArtworks();
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

			{/* Search Type Selector */}
			<View style={styles.orderContainer}>
				<TouchableOpacity
					style={[styles.orderButton, orderByNewest && styles.activeButton]}
					onPress={() => setOrderByNewest(true)}
				>
					<Text
						style={[
							styles.orderText,
							orderByNewest === true && styles.activeText,
						]}
					>
						Newest first
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.orderButton, !orderByNewest && styles.activeButton]}
					onPress={() => setOrderByNewest(false)}
				>
					<Text
						style={[
							styles.orderText,
							orderByNewest === false && styles.activeText,
						]}
					>
						Oldest first
					</Text>
				</TouchableOpacity>
			</View>

			{/* artwork feed either individual or grid */}
			{isLoading && <ActivityIndicator />}
			{gridDisplay ? (
				// MasonryList if grid is chosen
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
					onRefresh={getArtworks}
				/>
			// carousel if individual image is chosen
			// Special one for web.
			) : Platform.OS === "web" ? (
				<ArtworkWebCarousel artworks={artworks} />
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
		borderTopColor: Colors.ArtVistaRed,
		borderTopWidth: 1,
		backgroundColor: "white",
	},
	headerTitle: {
		textAlign: "center",
		fontFamily: "Dancing-Script",
		fontSize: 36,
		color: Colors.ArtVistaRed,
	},
	orderContainer: {
		marginVertical: 8,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	orderButton: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	activeButton: {
		backgroundColor: Colors.ArtVistaRed,
	},
	orderText: {
		fontSize: 14,
		color: Colors.ArtVistaRed,
	},
	activeText: {
		color: "white",
	},
});
