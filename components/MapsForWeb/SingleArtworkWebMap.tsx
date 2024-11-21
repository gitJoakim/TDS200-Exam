import React, { useEffect, useRef, useState } from "react";
import { Map, View as OlView } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import { Style, Circle, Fill, Stroke } from "ol/style";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Colors } from "@/constants/Colors";

type SmallWebMapProps = {
	region: { latitude: number; longitude: number } | null; // Center of the map (can be null)
	onMapClick?: ({
		latitude,
		longitude,
	}: {
		latitude: number;
		longitude: number;
	}) => void;
};

export default function SmallWebMap({ region, onMapClick }: SmallWebMapProps) {
	const mapRef = useRef<HTMLDivElement | null>(null);
	const mapInstance = useRef<Map | null>(null);

	// Default marker style
	const markerStyle = new Style({
		image: new Circle({
			radius: 10,
			fill: new Fill({
				color: Colors.ArtVistaRed,
			}),
			stroke: new Stroke({
				color: "black",
				width: 1,
			}),
		}),
	});

	// Create and add a marker to the map
	function createMarker(coords: { latitude: number; longitude: number }) {
		if (!mapInstance.current) return;

		const marker = new Feature({
			geometry: new Point(fromLonLat([coords.longitude, coords.latitude])),
		});
		marker.setStyle(markerStyle);

		const vectorSource = new VectorSource({
			features: [marker],
		});

		const vectorLayer = new VectorLayer({
			source: vectorSource,
		});

		mapInstance.current.addLayer(vectorLayer);
	}

	function setNewMapView(coords: { latitude: number; longitude: number }) {
		const mapView = mapInstance.current!.getView();
		mapView.setCenter(fromLonLat([coords.longitude, coords.latitude]));
		mapView.setZoom(8);
	}

	// Set up map click event listener using OpenLayers API
	useEffect(() => {
		// Initialize the map only once (on mount)
		if (mapRef.current && !mapInstance.current) {
			mapInstance.current = new Map({
				target: mapRef.current,
				view: new OlView({
					center: fromLonLat([10.75, 59.9]), // Default center
					zoom: 8,
				}),
				layers: [
					new TileLayer({
						source: new OSM(),
					}),
				],
			});

			// Add a click event listener for the map
			mapInstance.current.on("click", (event) => {
				// Get the coordinates of the click event in the map's native projection (EPSG:3857)
				const mapCoord = mapInstance.current?.getCoordinateFromPixel([
					event.pixel[0],
					event.pixel[1],
				]);

				if (mapCoord) {
					// Convert the coordinates from EPSG:3857 (Web Mercator) to EPSG:4326 (Longitude, Latitude)
					const lonLat = toLonLat(mapCoord); // Convert to lon, lat in EPSG:4326
					const lat = lonLat[1]; // Latitude
					const lon = lonLat[0]; // Longitude

					// Call the onMapClick prop if provided
					if (onMapClick) {
						onMapClick({ latitude: lat, longitude: lon });
					}
				}
			});
		}

		// Cleanup function to remove the map instance on component unmount
		return () => {
			if (mapInstance.current) {
				mapInstance.current.setTarget(undefined);
				mapInstance.current = null;
			}
		};
	}, [region]);

	// Add marker and set the map view if region is provided
	useEffect(() => {
		if (region) {
			setNewMapView(region);
			createMarker(region);
		}
	}, [region]);

	return (
		<div
			ref={mapRef}
			style={{
				width: "100%",
				height: "100%",
				borderRadius: 8,
				border: "1px solid #ccc", // Optional: Add a border for the map
			}}
		/>
	);
}
