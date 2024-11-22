import { getArtworksByUserId } from "@/api/artworkApi";
import { getUserInfoById } from "@/api/userApi";
import ProfileArtGrid from "@/components/profile/ProfileArtGrid";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { Colors } from "@/constants/Colors";
import { ArtworkData } from "@/utils/artworkData";
import { UserData } from "@/utils/userData";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export default function UserProfile() {
	const { id } = useLocalSearchParams(); // Retrieves id from URL
	const [artworks, setArtworks] = useState<ArtworkData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const navigation = useNavigation();
	const [userData, setUserData] = useState<UserData | null>(null);

	// Fetch user data by ID
	async function getUserDataById() {
		setLoading(true);
		try {
			const userInfoFromDb = await getUserInfoById(id as string);
			if (userInfoFromDb) {
				setUserData(userInfoFromDb);
			} else {
				// If no user is found, set an error message
				setErrorMessage("User not found");
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

	// Fetch artworks by user ID
	async function getSelectedArtworkFromDb() {
		if (!id) {
			setErrorMessage("User ID is missing");
			return;
		}
		try {
			const artworksFromDb = await getArtworksByUserId(id as string);
			if (artworksFromDb) {
				setArtworks(artworksFromDb);
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

	// Update navigation title when userData is loaded
	useEffect(() => {
		if (userData?.username) {
			navigation.setOptions({
				title: userData.username,
				headerTitleAlign: "center",
			});
		}
	}, [userData]);

	// fetch userData and artworks on init
	useEffect(() => {
		if (id) {
			getUserDataById();

			getSelectedArtworkFromDb();
		}
	}, []);

	// Display user information and artworks
	return (
		<View style={styles.mainContainer}>
			{errorMessage ? (
				<Text
					accessibilityRole="alert"
					accessibilityLiveRegion="assertive"
					accessibilityLabel={errorMessage}
				>
					{errorMessage}
				</Text>
			) : (
				<>
					{/* Profile header info */}
					<ProfileInfo userData={userData} />

					{/* Profile artowkrs grid */}
					<ProfileArtGrid artworks={artworks} />
				</>
			)}
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
