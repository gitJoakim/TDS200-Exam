import {
	Image,
	StyleSheet,
	Platform,
	View,
	Text,
	Modal,
	Pressable,
	FlatList,
	Dimensions,
	SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import Artwork from "@/components/Artwork";
import * as artworksAPI from "@/api/artworkApi";
import React from "react";
import ArtworkCarousel from "@/components/ArtworkCarousel";

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
					fontFamily: "Dancing-Script",
					fontSize: 48,
					color: Colors.ArtVistaRed,
				}}
			>
				ArtVista
			</Text>

			<ArtworkCarousel artworks={artworks} />
		</View>
	);
}

const styles = StyleSheet.create({});
