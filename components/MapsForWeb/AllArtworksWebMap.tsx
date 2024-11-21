import React, { useEffect, useRef, useState } from "react";
import { Map, View as OlView } from "ol";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import { Style, Circle, Fill, Stroke } from "ol/style";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";

type AllArtworksWebMapProps = {
	artworks: ArtworkData[]; // Array of artworks with coordinates
};

export default function AllArtworksWebMap({
	artworks,
}: AllArtworksWebMapProps) {
	const mapRef = useRef<HTMLDivElement | null>(null);
	const mapInstance = useRef<Map | null>(null);

	// State to keep track of the selected artwork
	const [selectedArtwork, setSelectedArtwork] = useState<ArtworkData | null>(
		null
	);

	// Default marker style for artworks (red circle)
	const markerStyle = () =>
		new Style({
			image: new Circle({
				radius: 10, // Increase the radius for selected artwork
				fill: new Fill({
					color: Colors.ArtVistaRed, // Change color to blue if selected
				}),
				stroke: new Stroke({
					color: "black",
					width: 1,
				}),
			}),
		});

	// Create and add a marker for a single artwork
	function createMarker(
		coords: { latitude: number; longitude: number },
		artwork: ArtworkData
	) {
		if (!mapInstance.current) return;

		const marker = new Feature({
			geometry: new Point(fromLonLat([coords.longitude, coords.latitude])),
		});

		// Set the default marker style
		marker.setStyle(markerStyle());

		const vectorSource = new VectorSource({
			features: [marker],
		});

		const vectorLayer = new VectorLayer({
			source: vectorSource,
		});

		mapInstance.current.addLayer(vectorLayer);

		// Store the marker and its associated artwork in the map instance
		marker.set("artwork", artwork);
	}

	// Set up the map view
	function initializeMap() {
		if (mapRef.current && !mapInstance.current) {
			mapInstance.current = new Map({
				target: mapRef.current,
				view: new OlView({
					center: fromLonLat([10.75, 59.9]), // Default center
					zoom: 5,
				}),
				layers: [
					new TileLayer({
						source: new OSM(),
					}),
				],
			});

			// Add click listener to the map to check if a feature was clicked
			mapInstance.current.on("click", (event) => {
				const feature = mapInstance.current?.forEachFeatureAtPixel(
					event.pixel,
					(feature) => feature
				);

				if (feature) {
					const artwork = feature.get("artwork"); // Get the associated artwork from the feature
					if (artwork) {
						setSelectedArtwork(artwork);
					}
				}
			});
		}
	}

	// Add markers for all artworks
	useEffect(() => {
		if (artworks.length > 0 && mapInstance.current) {
			artworks.forEach((artwork) => {
				createMarker(
					{
						latitude: artwork.artworkCoords?.latitude ?? 0,
						longitude: artwork.artworkCoords?.longitude ?? 0,
					},
					artwork
				);
			});
		}
	}, [artworks]);

	// Initialize map once on mount
	useEffect(() => {
		initializeMap();

		// Cleanup function to remove the map instance on component unmount
		return () => {
			if (mapInstance.current) {
				mapInstance.current.setTarget(undefined);
				mapInstance.current = null;
			}
		};
	}, []);

	return (
		<View style={styles.container}>
			{/* Map takes full width and height */}
			<div ref={mapRef} style={styles.map} />
			{/* Info container on top of the map, occupying 40% height on the right */}
			<View style={styles.infoContainer}>
				{selectedArtwork ? (
					<Link
						href={{
							pathname: "/artworkDetails/[id]",
							params: { id: selectedArtwork.id },
						}}
					>
						<View style={styles.innerInfoContainer}>
							<Text style={styles.title}>{selectedArtwork.title}</Text>
							<Image
								source={{ uri: selectedArtwork.imageURL }}
								style={styles.image}
								resizeMode="cover"
							/>
							<Text style={styles.tipText}>
								Tap the preview to view the full artwork
							</Text>
						</View>
					</Link>
				) : (
					<Text style={styles.noSelection}>
						Click a point to preview, then click the preview to view details.
					</Text>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row", // Align the map and the info container side by side
		height: "100%", // Full height for the container
		width: "100%", // Full width for the container
		position: "relative", // To allow the info container to overlay
	},
	map: {
		width: "100%", // Map takes up full width
		height: "100%", // Map takes up full height
	},
	infoContainer: {
		margin: 16,
		position: "absolute", // Position over the map
		right: 0, // Align to the right
		top: 0, // Align to the top
		width: "20%", // Info container occupies 20% of the width
		height: "auto", // Info container takes up auto height
		backgroundColor: "white", // White background for the info container
		padding: 12,
		borderWidth: 2,
		borderColor: Colors.ArtVistaRed,
		borderRadius: 12,
	},
	innerInfoContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
		color: Colors.ArtVistaRed,
	},
	tipText: {
		marginTop: 12,
		textAlign: "center",
		color: Colors.ArtVistaRed,
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
	},
	noSelection: {
		fontSize: 16,
		color: "#888",
		textAlign: "center", // Center the noSelection text
	},
});
