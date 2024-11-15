import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";

interface MapModalProps {
	setLocation: (location: Location.LocationObjectCoords | null) => void; // Passes only latitude & longitude
	closeModal: () => void;
}

const MapModal = ({ setLocation, closeModal }: MapModalProps) => {
	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);
	const [selectedCoords, setSelectedCoords] =
		useState<Location.LocationObjectCoords | null>(null);

	function handleMapPress(event: any) {
		const location: Location.LocationObjectCoords =
			event.nativeEvent.coordinate;
		setSelectedCoords(location);

		console.log(location);
	}

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

	useEffect(() => {
		fetchAddressInfoFromCoords();
	}, [selectedCoords]);

	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalContent}>
				{/* Close Button */}
				<Pressable style={styles.closeButton} onPress={closeModal}>
					<Ionicons name="close" size={30} color={Colors.ArtVistaRed} />
				</Pressable>

				<MapView
					style={styles.map}
					zoomEnabled={true}
					scrollEnabled={true}
					initialRegion={{
						latitude: 37.78825, // Default center
						longitude: -122.4324, // Default center
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
					onPress={handleMapPress}
				>
					{/* Display Marker if a location is selected */}
					{selectedCoords && <Marker coordinate={selectedCoords} />}
				</MapView>

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
			</View>
		</View>
	);
};

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
		justifyContent: "flex-start",
	},
	map: {
		width: "100%",
		height: "80%",
	},
	addressText: {
		marginTop: 12,
		fontSize: 16,
		color: Colors.ArtVistaRed,
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		width: "100%",
		padding: 16,
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

export default MapModal;
