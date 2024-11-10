import {
	Image,
	StyleSheet,
	Platform,
	View,
	Text,
	Modal,
	Pressable,
	FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import Artwork from "@/components/Artwork";
import * as artworksAPI from "@/api/artworkApi";
import React from "react";

export default function HomeScreen() {
	const [artworks, setArtworks] = useState<ArtworkData[]>([]);

	async function getArtworks() {
		const artworks = await artworksAPI.getAllArtworks();
		setArtworks(artworks);
	}

	useEffect(() => {
		getArtworks();
	}, []);

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text
				style={{
					marginTop: 64,
					marginBottom: 32,
					fontFamily: "Dancing-Script",
					fontSize: 48,
					color: Colors.ArtVistaRed,
				}}
			>
				ArtVista
			</Text>

			<FlatList
				pagingEnabled
				data={artworks}
				renderItem={(artwork) => (
					<Artwork key={artwork.index} artworkData={artwork.item} />
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	imageStyle: {
		width: 300,
		height: 300,
		resizeMode: "cover",
	},
	artistText: {
		textAlign: "center",
	},
});
