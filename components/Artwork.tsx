import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	Platform,
	ScrollView,
} from "react-native";
import { Image } from "expo-image";
import MapView, { Marker } from "react-native-maps";
import { Link } from "expo-router";
import { ArtworkData } from "@/utils/artworkData";

import "ol/ol.css"; // Import OpenLayers styles
import WebMapWithOl from "./WebMap/WebMapWithOl";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import fetchAddressWithGoogleAPI from "@/utils/getAddressWithGoogle";
import * as Location from "expo-location";

type ArtworkProps = {
	artworkData: ArtworkData | null;
};

export default function Artwork({ artworkData }: ArtworkProps) {
	const { width, height } = Dimensions.get("window");
	const imageDimensionsStyle = { width: width - 48, height: height * 0.4 };
	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);
	const [regionForMobileView, setRegionForMobileView] = useState({
		latitude: 10.75,
		longitude: 59.9,
		latitudeDelta: 0.0922, // default zoom level
		longitudeDelta: 0.0421, // default zoom level
	});

	const [location, setLocation] =
		useState<Location.LocationObjectCoords | null>(null);

	const fetchAddressInfoFromCoords = async () => {
		if (location) {
			const address = await getAddressFromCoords(location);
			setAddressCoords(address);
		}
	};

	const fetchAddressInfoFromGoogle = async () => {
		if (location) {
			const address = await fetchAddressWithGoogleAPI(location);
			setAddressCoords(address);
		}
	};

	useEffect(() => {
		if (artworkData?.artworkCoords) {
			const { latitude, longitude } = artworkData.artworkCoords;
			setLocation({
				latitude,
				longitude,
				altitude: null,
				accuracy: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			});
			setRegionForMobileView({
				latitude: latitude,
				longitude: longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
		}
	}, [artworkData]);

	useEffect(() => {
		if (location) {
			if (Platform.OS === "web" || "android") {
				fetchAddressInfoFromGoogle();
			} else {
				fetchAddressInfoFromCoords();
			}
		}
	}, [location]);

	return (
		<ScrollView style={styles.scrollContainer}>
			<View style={styles.container}>
				{/* Artwork Title and Artist */}
				<View style={styles.headerContainer}>
					<Text style={styles.title}>{artworkData!.title}</Text>
					<Link
						href={{
							pathname: "/userProfile/[id]",
							params: { id: artworkData!.userId },
						}}
					>
						<Text style={styles.artistName}>{artworkData!.artist}</Text>
					</Link>
				</View>

				{/* Artwork Image */}
				<Image
					contentFit="contain"
					style={[styles.image, imageDimensionsStyle]}
					source={{ uri: artworkData!.imageURL }}
				/>

				{/* Date */}
				<Text style={styles.dateText}>{artworkData!.date}</Text>

				{/* Artwork Description */}
				<Text style={styles.description}>{artworkData!.description}</Text>

				{/* Hashtags */}
				<Text style={styles.hashtags}>{artworkData!.hashtags}</Text>

				{/* Location */}
				<Text style={styles.locationTextStyle}>
					Location:{" "}
					{artworkData!.artworkCoords
						? `${addressCoords?.[0]?.city}, ${addressCoords?.[0]?.country}`
						: "Unknown"}
				</Text>

				{/* Map Container */}
				<View style={styles.mapContainer}>
					{/* Conditionally render WebMapWithOl for Web or MapView for Mobile */}
					{Platform.OS === "web" ? (
						<WebMapWithOl region={location} />
					) : (
						<MapView
							style={styles.tinyMap}
							region={regionForMobileView} // Make sure `region` is correctly defined before using
							zoomEnabled={true}
							scrollEnabled={true}
							rotateEnabled={false}
							pitchEnabled={false}
						>
							{artworkData?.artworkCoords && (
								<Marker coordinate={artworkData.artworkCoords} />
							)}
						</MapView>
					)}
					{/* Overlay to grey out the map if no location */}
					{!location && <View style={styles.greyOverlay} />}
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		backgroundColor: "#f9f9f9", // Add background to make it feel more like a post
	},
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingHorizontal: 24,
		width: "100%", // Default width for mobile
		...(Platform.OS === "web" && {
			width: "70%", // Adjust width for web
			marginHorizontal: "auto",
		}),
	},
	headerContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	artistName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#555", // Dark gray for subtle contrast
	},
	dateText: {
		fontSize: 14,
		color: "#888", // Lighter gray
		marginBottom: 12,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#222", // Dark color for contrast
		marginBottom: 8,
		textAlign: "center",
	},
	image: {
		borderRadius: 8,
		overflow: "hidden",
		marginBottom: 24,
	},
	description: {
		textAlign: "center",
		fontSize: 16,
		marginBottom: 8,
		color: "#333",
	},
	hashtags: {
		textAlign: "center",
		color: "#0077ff", // Bright blue for hashtags
		marginBottom: 20,
	},
	locationTextStyle: {
		textAlign: "center",
		fontSize: 14,
		color: "#666",
		marginBottom: 16,
	},
	mapContainer: {
		width: "100%",
		height: 180, // A bit larger map container to keep a balance
		borderRadius: 10,
		overflow: "hidden",
		marginBottom: 30,
		position: "relative",
	},
	tinyMap: {
		width: "100%",
		height: "100%",
		borderRadius: 10,
	},
	greyOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent grey overlay
		borderRadius: 8,
	},
});
