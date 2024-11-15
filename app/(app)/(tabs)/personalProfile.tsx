import { getArtworksByUserId } from "@/api/artworkApi";
import { getUserInfoById } from "@/api/userApi";
import EditProfileModal from "@/components/Modals/EditProfileModal";
import ProfileArtGrid from "@/components/profile/ProfileArtGrid";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { Colors } from "@/constants/Colors";
import { useAuthSession } from "@/providers/AuthContextProvider";
import { ArtworkData } from "@/utils/artworkData";
import { UserData } from "@/utils/userData";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";

export default function PersonalProfile() {
	const { logOut, user } = useAuthSession();
	const [userData, setUserData] = useState<UserData | null>(null);
	const [artworks, setArtworks] = useState<ArtworkData[] | []>([]);
	const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
		useState<boolean>(false);
	const navigation = useNavigation();

	// Fetch the user data
	async function fetchUserData() {
		const userId = user!.uid;
		const userInfoFromDb = await getUserInfoById(userId);
		setUserData(userInfoFromDb);
	}

	// Fetch artworks by user ID
	async function getSelectedArtworkFromDb() {
		const userId = user!.uid;
		const artworksFromDb = await getArtworksByUserId(userId);
		setArtworks(artworksFromDb);
	}

	useEffect(() => {
		fetchUserData();
		getSelectedArtworkFromDb();

		navigation.setOptions({
			title: "Your Profile",
			headerLeft: () => (
				<Pressable
					onPress={() => {
						logOut();
					}}
					style={{ marginLeft: 15 }}
				>
					<Text style={{ color: Colors.ArtVistaRed, fontWeight: "bold" }}>
						Log out
					</Text>
				</Pressable>
			),
			headerRight: () => (
				<Pressable
					onPress={() => {
						setIsEditProfileModalOpen(true);
					}}
				>
					<Text>Settings</Text>
				</Pressable>
			),
		});
	}, [navigation]);

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ProfileInfo userData={userData} />
			<ProfileArtGrid artworks={artworks} />

			{/* Edit Profile Modal */}
			<Modal visible={isEditProfileModalOpen}>
				<EditProfileModal
					closeModal={() => setIsEditProfileModalOpen(false)}
					userData={userData} // Ensure userData is passed correctly
					onSave={fetchUserData}
				/>
			</Modal>
		</View>
	);
}
