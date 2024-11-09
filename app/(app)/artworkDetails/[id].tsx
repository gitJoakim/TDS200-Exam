import { ArtworkData } from "@/utils/artworkData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getArtworkById } from "@/api/artworkApi";
import Artwork from "@/components/Artwork";
import { View, Text } from "react-native";

export default function artworkDetails() {
	const { id } = useLocalSearchParams();
	const [artwork, setArtwork] = useState<ArtworkData | null>(null);

	async function getSelectedArtworkFromDb() {
		const artworkFromDb = await getArtworkById(id as string);
		if (artworkFromDb) {
			setArtwork(artworkFromDb);
		}
	}

	useEffect(() => {
		getSelectedArtworkFromDb();
	}, []);

	if (artwork === null) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Error occurred, please exit and try again.</Text>
			</View>
		);
	}

	// If artwork is available, render it
	return <Artwork artworkData={artwork} />;
}
