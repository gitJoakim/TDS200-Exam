import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import fetchAddressWithGoogleAPI from "@/utils/getAddressWithGoogle";
import SingleArtworkWebMap from "../MapsForWeb/SingleArtworkWebMap";

interface LocationSetterProps {
	location: Location.LocationObjectCoords | null;
	setIsMapModalOpen: (isOpen: boolean) => void;
}

export default function LocationSetter({
	location,
	setIsMapModalOpen,
}: LocationSetterProps) {
	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);

	
	// gets address from coords through expo-location reverseGeocodeAsync()
	const getAddressInfoFromCoords = async () => {
		if (location) {
			const address = await getAddressFromCoords(location);
			setAddressCoords(address);
		}
	};

	// gets address from coords through google locaiton API
	const getAddressInfoFromGoogle = async () => {
		if (location) {
			const address = await fetchAddressWithGoogleAPI(location);
			setAddressCoords(address);
		}
	};

	// use correct api based on platform
	useEffect(() => {
		if (Platform.OS === "web" || "android") {
			getAddressInfoFromGoogle();
		} else {
			getAddressInfoFromCoords();
		}
	}, [location]);

	return (
		<View style={styles.locationContainer}>

			{/* Location Icon and Text */}
			<View style={styles.locationIconContainer}>
				<Ionicons
					name="location-outline"
					size={30}
					color={Colors.ArtVistaRed}
					accessibilityLabel="Location icon"
				/>
				<Text style={styles.locationText} accessibilityLiveRegion="assertive">
					{location
						? `${addressCoords?.[0]?.city}, ${addressCoords?.[0]?.country}`
						: "Click the map to set location"}
				</Text>
			</View>

			{/* Map */}
			<Pressable
				onPress={() => {
					setIsMapModalOpen(true);
					console.log("Map pressed");
				}}
				style={styles.mapWrapper}
				accessibilityLabel="Tap to set location"
				accessibilityHint="Opens a map to allow you to set your location"
				accessibilityRole="button"
			>
				{Platform.OS === "web" ? (
					// OpenLayers for web
					<SingleArtworkWebMap region={location} />
				) : (
					// MapView for mobile
					<MapView
						style={styles.tinyMap}
						region={{
							latitude: location ? location.latitude : 59.9,
							longitude: location ? location.longitude : 10.75,
							latitudeDelta: 0.1,
							longitudeDelta: 0.1,
						}}
						zoomEnabled={true}
						scrollEnabled={true}
						rotateEnabled={false}
						pitchEnabled={false}
					>
						{ /* Location on map */ }
						{location && <Marker coordinate={location}></Marker>}
					</MapView>
				)}

				{/* Overlay to grey out the map if no location */}
				{!location && <View style={styles.greyOverlay} />}
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	locationContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	mapWrapper: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: 150,
		borderRadius: 8,
	},
	tinyMap: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
	},
	greyOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		borderRadius: 8,
	},
	locationIconContainer: {
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 8,
	},
	locationText: {
		marginTop: 8,
		color: Colors.ArtVistaRed,
		fontSize: 16,
	},
});
