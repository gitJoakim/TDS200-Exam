import { ArtworkData } from "@/utils/artworkData";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { getArtworkById } from "@/api/artworkApi";
import Artwork from "@/components/Artwork";
import { View, Text, ActivityIndicator, Pressable, Modal } from "react-native";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useAuthSession } from "@/providers/AuthContextProvider";
import * as artworkAPI from "@/api/artworkApi";
import AlertModal from "@/components/Modals/AlertModal";

export default function ArtworkDetails() {
	const { id } = useLocalSearchParams();
	const [artwork, setArtwork] = useState<ArtworkData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const navigation = useNavigation();
	const [isDeletingPost, setIsDeletingPost] = useState(false);
	const { user } = useAuthSession();

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

	async function handleDeletePost() {
		// an extra check just to be sure
		if (user!.uid === artwork!.userId) {
			setLoading(true);
			await artworkAPI.deleteArtwork(artwork!.id);
			setLoading(false);
			setIsDeletingPost(false);
			navigation.goBack();
		}
	}

	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				user?.uid === artwork?.userId ? ( // Conditional rendering
					<Pressable
						onPress={() => setIsDeletingPost(true)}
						style={{ marginRight: 16 }}
					>
						<Feather name="trash-2" size={24} color={Colors.ArtVistaRed} />
					</Pressable>
				) : null,
		});
		console.log("aaaaaaaaaa", artwork?.imageURL);
	}, [artwork]);

	useEffect(() => {
		getSelectedArtworkFromDb();
		navigation.setOptions({
			title: "Artwork",
			headerTitleAlign: "center",
		});
	}, []);

	if (loading) {
		// While loading, show the ActivityIndicator
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					borderTopColor: Colors.ArtVistaRed,
					borderTopWidth: 1,
				}}
			>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Loading Artwork...</Text>
			</View>
		);
	}

	if (errorMessage) {
		// If there's an error, show the error message
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					borderTopColor: Colors.ArtVistaRed,
					borderTopWidth: 1,
				}}
			>
				<Text>{errorMessage}</Text>
			</View>
		);
	}

	// If artwork is available, render it
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Artwork artworkData={artwork} />
			<Modal visible={isDeletingPost}>
				{loading && <ActivityIndicator />}
				<AlertModal
					prompt={
						"Are you sure you want to permanently delete this artwork? This action cannot be undone."
					}
					optionYes={"Yes, Delete "}
					optionNo={"No, Cancel"}
					onConfirm={handleDeletePost}
					onCancel={() => {
						setIsDeletingPost(false);
					}}
				/>
			</Modal>
		</View>
	);
}
