import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors"; // Adjust this to your project setup
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";

interface LocationSetterProps {
	location: Location.LocationObjectCoords | null;
	setIsMapModalOpen: (isOpen: boolean) => void; // Function to open/close the modal
}

export default function LocationSetter({
	location,
	setIsMapModalOpen,
}: LocationSetterProps) {
	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);

	const fetchAddressInfoFromCoords = async () => {
		if (location) {
			const address = await getAddressFromCoords(location);
			setAddressCoords(address);
		}
	};

	useEffect(() => {
		fetchAddressInfoFromCoords();
	}, [location]);

	return (
		<View style={styles.locationContainer}>
			{/* Location Icon and Text */}
			<Pressable
				onPress={() => setIsMapModalOpen(true)} // Open the map modal when the map is clicked
				style={styles.locationIconContainer}
			>
				<Ionicons
					name="location-outline"
					size={30}
					color={Colors.ArtVistaRed}
				/>
				<Text style={styles.locationText}>
					{location
						? `${addressCoords?.[0]?.city}, ${addressCoords?.[0]?.country}`
						: "Click map to set location"}
				</Text>
			</Pressable>
			{/* Map */}
			<Pressable
				onPress={() => {
					setIsMapModalOpen(true);
					console.log("Map pressed");
				}}
				style={styles.mapWrapper}
			>
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
					{location && <Marker coordinate={location}></Marker>}
				</MapView>

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
		position: "relative",
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
		backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent grey overlay
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
