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
import MasonryList from "@react-native-seoul/masonry-list";
import ArtworkImageOnly from "@/components/ArtworkImageOnly";

export default function HomeScreen() {
	const [artworks, setArtworks] = useState<ArtworkData[]>([]);
	const [gridDisplay, setGridDisplay] = useState(true);
	

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

			{gridDisplay ? (
				<MasonryList
					numColumns={2}
					data={artworks}
					keyExtractor={(item): string => item.id}
					renderItem={({ item }) => (
						<ArtworkImageOnly artwork={item as ArtworkData} />
					)}
				/>
			) : (
				<ArtworkCarousel artworks={artworks} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({});
