import { ArtworkData } from "@/utils/artworkData";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { getArtworkById } from "@/api/artworkApi";
import Artwork from "@/components/Artwork";
import {
	View,
	Text,
	ActivityIndicator,
	Pressable,
	Modal,
	StyleSheet,
} from "react-native";
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

	// fetch artwork from DB based on useLocalSearchParams id
	async function getSelectedArtworkFromDb() {
		try {
			const artworkFromDb = await getArtworkById(id as string);
			if (artworkFromDb) {
				setArtwork(artworkFromDb);
			} else {
				// If no artwork is found, set an error message
				setErrorMessage("Artwork not found. Please exit and try again.");
			}
		} catch (error) {
			// If there's an error fetching, show the error message
			setErrorMessage(
				"Uh oh, something went wrong. Please exit and try again."
			);
		} finally {
			setLoading(false);
		}
	}

	// delete post
	async function handleDeletePost() {
		// an extra check just to be sure user is the artist
		if (user!.uid === artwork!.userId) {
			setLoading(true);
			await artworkAPI.deleteArtwork(artwork!.id);
			setLoading(false);
			setIsDeletingPost(false);
			// navigate out when deletion is done
			navigation.goBack();
		}
	}

	// sets header right delete button when artwork is select
	// only if the user who selected the artwork is the artist
	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				user?.uid === artwork?.userId ? (
					<Pressable
						onPress={() => setIsDeletingPost(true)}
						style={{ marginRight: 16 }}
						accessibilityLabel="Delete Artwork"
						accessibilityHint="Deletes the artwork permanently"
						accessibilityRole="button"
					>
						<Feather name="trash-2" size={24} color={Colors.ArtVistaRed} />
					</Pressable>
				) : null,
		});
	}, [artwork]);

	// fetch artwork and set header on launch
	useEffect(() => {
		getSelectedArtworkFromDb();
		navigation.setOptions({
			title: "Artwork",
			headerTitleAlign: "center",
		});
	}, []);

	// While loading, show the ActivityIndicator
	if (loading) {
		return (
			<View style={styles.mainContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Loading Artwork...</Text>
			</View>
		);
	}

	// Show error message if artwork is not found
	if (!artwork || errorMessage) {
		return (
			<View style={styles.mainContainer}>
				<Text accessibilityRole="alert" style={{ color: Colors.ArtVistaRed }}>
					{errorMessage}
				</Text>
			</View>
		);
	}

	// If artwork is available, render it
	return (
		<View style={styles.mainContainer}>
			
			{/* Display Artowork */}
			<Artwork artworkData={artwork} />

			{/* Delete Alert Modal */}
			<Modal visible={isDeletingPost} accessibilityViewIsModal={true}>
				{loading && (
					<ActivityIndicator accessibilityLabel="Deleting artwork..." />
				)}
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

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderTopColor: Colors.ArtVistaRed,
		borderTopWidth: 1,
	},
});
