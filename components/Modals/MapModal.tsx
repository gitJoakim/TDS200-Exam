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
import WebMapWithOl from "../WebMap/WebMapWithOl";
import fetchAddressWithGoogleAPI from "@/utils/getAddressWithGoogle";

interface MapModalProps {
	setLocation: (location: Location.LocationObjectCoords | null) => void; // Passes only latitude & longitude
	closeModal: () => void;
}

export default function MapModal({ setLocation, closeModal }: MapModalProps) {
	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);
	const [selectedCoords, setSelectedCoords] =
		useState<Location.LocationObjectCoords | null>(null);

	const handleMapPress = useCallback((event: MapPressEvent) => {
		const location = event.nativeEvent.coordinate;
		setSelectedCoords(location as Location.LocationObjectCoords); // Directly setting coords without additional processing
	}, []);

	function handleSaveLocation() {
		setLocation(selectedCoords);
		closeModal();
	}

	const fetchAddressInfoFromCoords = async () => {
		if (selectedCoords) {
			const address = await getAddressFromCoords(selectedCoords);
			setAddressCoords(address);
		}
	};

	const fetchAddressInfoFromGoogle = async () => {
		if (selectedCoords) {
			const address = await fetchAddressWithGoogleAPI(selectedCoords);
			setAddressCoords(address);
		}
	};

	useEffect(() => {
		if (Platform.OS === "web" || "android") {
			fetchAddressInfoFromGoogle();
		} else {
			fetchAddressInfoFromCoords();
		}
	}, [selectedCoords]);

	// fetch user position and set that as location if permission granted
	useEffect(() => {
		if (Platform.OS !== "web") {
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
				{Platform.OS === "web" ? (
					<View
						style={{
							flex: 4,
							width: "100%",
						}}
					>
						<WebMapWithOl
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
					>
						{/* Display Marker if a location is selected */}
						{selectedCoords && <Marker coordinate={selectedCoords} />}
					</MapView>
				)}

				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					{/* Display Address */}
					<Text style={styles.addressText}>
						{addressCoords
							? `${addressCoords?.[0]?.city}, ${addressCoords?.[0]?.country}`
							: "Select a location"}
					</Text>

					{/* Button Row */}
					<View style={styles.buttonContainer}>
						<Pressable style={styles.cancelButton} onPress={closeModal}>
							<Text style={styles.buttonText}>Cancel</Text>
						</Pressable>
						<Pressable style={styles.saveButton} onPress={handleSaveLocation}>
							<Text style={styles.buttonText}>Save Location</Text>
						</Pressable>
					</View>
				</View>
				{/* Close Button */}
				<Pressable style={styles.closeButton} onPress={closeModal}>
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
		justifyContent: "space-between", // Spreads buttons horizontally
		alignItems: "center",
		width: "90%", // Makes the button container a bit narrower than the modal
		marginVertical: 16, // Adds spacing at the bottom
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
