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
import Carousel from "react-native-reanimated-carousel";

export default function HomeScreen() {
	const [artworks, setArtworks] = useState<ArtworkData[]>([]);
	const width = Dimensions.get("screen").width;
	const height = Dimensions.get("screen").height;

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

			<Carousel
				loop
				width={width}
				height={height}
				style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
				}}
				data={artworks}
				vertical={true}
				scrollAnimationDuration={1000}
				onSnapToItem={(index) => console.log("current index:", index)}
				renderItem={({ item }) => (
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={{ uri: item.imageURL }} />
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	artistText: {
		textAlign: "center",
	},
	image: {
		width: 300,
		height: 400,
		resizeMode: "cover",
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.7,
		shadowRadius: 30,
	},
});
