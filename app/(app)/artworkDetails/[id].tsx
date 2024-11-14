import { ArtworkData } from "@/utils/artworkData";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { getArtworkById } from "@/api/artworkApi";
import Artwork from "@/components/Artwork";
import { View, Text, ActivityIndicator } from "react-native";

export default function ArtworkDetails() {
	const { id } = useLocalSearchParams();
	const [artwork, setArtwork] = useState<ArtworkData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const navigation = useNavigation();

	async function getSelectedArtworkFromDb() {
		try {
			const artworkFromDb = await getArtworkById(id as string);
			if (artworkFromDb) {
				setArtwork(artworkFromDb);
			}
		} catch (error) {
			setErrorMessage(
				"Uh oh, something went wrong. Please exit and try again."
			);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getSelectedArtworkFromDb();
		navigation.setOptions({
			title: "Artwork",
		});
	}, []);

	if (loading) {
		// While loading, show the ActivityIndicator
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Loading Artwork...</Text>
			</View>
		);
	}

	if (errorMessage) {
		// If there's an error, show the error message
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>{errorMessage}</Text>
			</View>
		);
	}

	// If artwork is available, render it
	return <Artwork artworkData={artwork} />;
}
