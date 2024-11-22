import React, { useCallback, useEffect, useState } from "react";
import {
	Modal,
	View,
	Text,
	StyleSheet,
	Pressable,
	Platform,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import fetchAddressWithGoogleAPI from "@/utils/getAddressWithGoogle";
import SingleArtworkWebMap from "../MapsForWeb/SingleArtworkWebMap";

interface MapModalProps {
	setLocation: (location: Location.LocationObjectCoords | null) => void;
	closeModal: () => void;
}

export default function MapModal({ setLocation, closeModal }: MapModalProps) {
	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);
	const [selectedCoords, setSelectedCoords] =
		useState<Location.LocationObjectCoords | null>(null);

	// setting coords when map is pressed
	const handleMapPress = useCallback((event: MapPressEvent) => {
		const location = event.nativeEvent.coordinate;
		setSelectedCoords(location as Location.LocationObjectCoords);
	}, []);

	// sets location and closes modal
	function handleSaveLocation() {
		setLocation(selectedCoords);
		closeModal();
	}

	// gets address info form coords with reverseGeocodeAsync() from expo-location
	const getAddressInfoFromCoords = async () => {
		if (selectedCoords) {
			const address = await getAddressFromCoords(selectedCoords);
			setAddressCoords(address);
		}
	};

	// uses google location api to hand in coords and get back location
	const getAddressInfoFromGoogle = async () => {
		if (selectedCoords) {
			const address = await fetchAddressWithGoogleAPI(selectedCoords);
			setAddressCoords(address);
		}
	};

	// use google api for web and android, use expo-location for iOS when selectedCoords is set
	useEffect(() => {
		if (Platform.OS === "web" || "android") {
			getAddressInfoFromGoogle();
		} else {
			getAddressInfoFromCoords();
		}
	}, [selectedCoords]);

	// fetch user position and set that as location if permission granted
	useEffect(() => {
		// uses browser for web
		if (Platform.OS === "web") {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					setSelectedCoords({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					} as Location.LocationObjectCoords);
				});
			}
		} else {
			// uses device gps for mobile
			const requestLocationPermission = async () => {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status === "granted") {
					const location = await Location.getCurrentPositionAsync();
					setSelectedCoords({
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
					} as Location.LocationObjectCoords);
				}
			};
			requestLocationPermission();
		}
	}, []);

	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalContent}>

				{ /* Openlayers for web */ }
				{Platform.OS === "web" ? (
					<View
						style={{
							flex: 4,
							width: "100%",
						}}
					>
						<SingleArtworkWebMap
							region={selectedCoords}
							onMapClick={({ latitude, longitude }) => {
								setSelectedCoords({
									latitude,
									longitude,
								} as Location.LocationObjectCoords);
							}}
						/>
					</View>
				) : (

					//MapView for android and ios
					<MapView
						style={styles.map}
						zoomEnabled={true}
						scrollEnabled={true}
						region={{
							latitude: selectedCoords ? selectedCoords.latitude : 59.9,
							longitude: selectedCoords ? selectedCoords.longitude : 10.75,
							latitudeDelta: 0.1,
							longitudeDelta: 0.1,
						}}
						onPress={handleMapPress}
						accessibilityLabel="Map for selecting a location"
						accessibilityHint="Tap on the map to choose a location"
					>
						{/* Display Marker if a location is selected */}
						{selectedCoords && (
							<Marker
								coordinate={selectedCoords}
								accessibilityLabel="Selected location marker"
							/>
						)}
					</MapView>
				)}

				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>

					{/* Displays Address */}
					<Text
						style={styles.addressText}
						accessibilityLabel="Address of selected location"
					>
						{addressCoords
							? `${addressCoords?.[0]?.city}, ${addressCoords?.[0]?.country}`
							: "Select a location"}
					</Text>

					{/* Button container */}
					<View style={styles.buttonContainer}>
						<Pressable
							style={styles.cancelButton}
							onPress={closeModal}
							accessibilityLabel="Cancel location selection"
							accessibilityHint="Tap to close the map without saving"
							accessible={true}
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</Pressable>
						<Pressable
							style={styles.saveButton}
							onPress={handleSaveLocation}
							accessibilityLabel="Save selected location"
							accessibilityHint="Tap to save the location and close the map"
							accessible={true}
						>
							<Text style={styles.buttonText}>Save Location</Text>
						</Pressable>
					</View>
				</View>

				{/* Close Button Top Right */}
				<Pressable
					style={styles.closeButton}
					onPress={closeModal}
					accessibilityLabel="Close map modal"
					accessibilityHint="Tap to close the map modal"
				>
					<Ionicons name="close" size={30} color={Colors.ArtVistaRed} />
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		width: "80%",
		height: "70%",
		borderRadius: 12,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "space-between",
	},
	map: {
		width: "100%",
		height: "70%",
	},
	addressText: {
		marginTop: 12,
		fontSize: 16,
		color: Colors.ArtVistaRed,
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "90%",
		marginVertical: 16,
		...(Platform.OS === "web" && {
			gap: 64,
		}),
	},
	cancelButton: {
		backgroundColor: "gray",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
	},
	saveButton: {
		backgroundColor: Colors.ArtVistaRed,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
	},
	closeButton: {
		position: "absolute",
		top: 16,
		right: 16,
	},
});
