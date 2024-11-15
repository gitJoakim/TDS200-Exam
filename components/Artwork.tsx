import { ArtworkData } from "@/utils/artworkData";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Image } from "expo-image";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { Link } from "expo-router";

type ArtworkProps = {
	artworkData: ArtworkData | null;
};

export default function Artwork({ artworkData }: ArtworkProps) {
	const { width, height } = Dimensions.get("window");
	const imageDimensionsStyle = {
		width: width - 48,
		height: height * 0.4,
	};

	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);

	const fetchAddressInfoFromCoords = async () => {
		if (artworkData?.artworkCoords) {
			const address = await getAddressFromCoords(artworkData.artworkCoords);
			setAddressCoords(address);
		}
	};

	useEffect(() => {
		fetchAddressInfoFromCoords();
	}, [artworkData]);

	if (artworkData === null) {
		return (
			<View style={styles.errorContainer}>
				<Text>Uh oh, something went wrong. Please exit and try again.</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Link
					href={{
						pathname: "/userProfile/[id]",
						params: { id: artworkData.userId },
					}}
				>
					<Text>{artworkData.artist}</Text>
				</Link>
				<Text>{artworkData.date}</Text>
			</View>
			<Text style={styles.title}>{artworkData.title}</Text>
			<Image
				contentFit="contain"
				style={[styles.image, imageDimensionsStyle]}
				source={{ uri: artworkData.imageURL }}
			/>
			<Text style={styles.description}>{artworkData.description}</Text>
			<Text style={styles.hashtags}>{artworkData.hashtags}</Text>

			<View style={styles.locationTextStyle}>
				<Text>Location:</Text>
				<Text style={{}}>
					{artworkData.artworkCoords
						? `${addressCoords?.[0]?.city}, ${addressCoords?.[0]?.country}`
						: "Unknown"}
				</Text>
			</View>
			<MapView
				style={styles.tinyMap}
				region={{
					latitude: artworkData.artworkCoords
						? artworkData.artworkCoords.latitude
						: 59.9,
					longitude: artworkData.artworkCoords
						? artworkData.artworkCoords.longitude
						: 10.75,
					latitudeDelta: 0.1,
					longitudeDelta: 0.1,
				}}
				zoomEnabled={true}
				scrollEnabled={true}
				rotateEnabled={false}
				pitchEnabled={false}
			>
				{artworkData.artworkCoords && (
					<Marker coordinate={artworkData.artworkCoords}></Marker>
				)}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
		width: "100%",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginVertical: 16,
	},
	image: {
		marginBottom: 24,
	},
	description: {
		textAlign: "center",
		fontSize: 16,
		marginBottom: 8,
	},
	hashtags: {
		textAlign: "center",
		color: "gray",
	},
	tinyMap: {
		width: "100%",
		height: "30%",
		borderRadius: 8,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	locationTextStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
});
