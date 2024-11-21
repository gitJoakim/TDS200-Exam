import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import { router } from "expo-router"; // Use this for navigation
import { useEffect, useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	Pressable,
	TouchableWithoutFeedback,
	Platform,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as artworkAPI from "@/api/artworkApi";
import { Image } from "expo-image";
import BigWebMap from "@/components/MapsForWeb/AllArtworksWebMap";

export default function ArtworkMap() {
	const [artworks, setArtworks] = useState<ArtworkData[]>([]);
	const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(
		null
	);

	async function getArtworks() {
		const artworks = await artworkAPI.getAllArtworks();
		setArtworks(artworks);
	}

	useEffect(() => {
		getArtworks();
	}, []);

	// Handle the press of the callout by getting the artwork id
	const handleCalloutPress = () => {
		if (selectedArtworkId) {
			router.navigate({
				pathname: "/artworkDetails/[id]",
				params: { id: selectedArtworkId },
			});
		}
	};

	return (
		<View style={styles.mainContainer}>
			{Platform.OS === "web" ? (
				<BigWebMap artworks={artworks} />
			) : (
				<MapView
					initialRegion={{
						latitude: 59.9,
						longitude: 10.5,
						latitudeDelta: 10,
						longitudeDelta: 10,
					}}
					style={styles.mapStyle}
					// for some reason doing a pressable inside callout DOES NOT work on android???????
					// so this is my homemade workaround
					onCalloutPress={() => {
						handleCalloutPress();
					}}
				>
					{artworks.length > 0 &&
						artworks.map((artwork) => (
							<Marker
								coordinate={{
									latitude: artwork.artworkCoords?.latitude ?? 0,
									longitude: artwork.artworkCoords?.longitude ?? 0,
								}}
								key={artwork.id}
								onPress={() => {
									// When a marker is pressed, set the selected artwork id
									setSelectedArtworkId(artwork.id);
								}}
							>
								<Callout tooltip>
									<View style={styles.calloutContainer}>
										<Text style={styles.artworkTitle}>{artwork.title}</Text>
										<Image
											style={styles.artworkImage}
											source={{ uri: artwork.imageURL }}
											contentFit="cover"
										/>
									</View>
								</Callout>
							</Marker>
						))}
				</MapView>
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
	mapStyle: {
		width: "100%",
		height: "100%",
	},
	calloutContainer: {
		borderWidth: 2,
		borderColor: Colors.ArtVistaRed,
		backgroundColor: "white",
		padding: 10,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		width: 250, // Ensures consistent sizing
	},
	artworkTitle: {
		fontWeight: "bold",
		fontSize: 16,
		color: Colors.ArtVistaRed, // Red color for contrast
		textAlign: "center",
		marginBottom: 8, // Space between title and image
	},
	artworkImage: {
		width: 200,
		height: 200,
		marginBottom: 12,
	},
});
