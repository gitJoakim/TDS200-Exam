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
import Authentication from "../../authentication";
import { useEffect, useState } from "react";
import * as authenticationAPI from "@/api/authenticationApi";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import Artwork from "@/components/Artwork";
import * as artworksAPI from "@/api/artworkApi";

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
					fontFamily: "Dancing-Script",
					fontSize: 48,
					color: Colors.ArtVistaRed,
				}}
			>
				ArtVista
			</Text>

			<FlatList
				data={artworks}
				renderItem={(artwork) => (
					<Artwork key={artwork.index} artworkData={artwork.item} />
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
});
