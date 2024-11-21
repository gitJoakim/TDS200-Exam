import { getArtworksByUserId } from "@/api/artworkApi";
import { getUserInfoById } from "@/api/userApi";
import EditProfileModal from "@/components/Modals/EditProfileModal";
import ProfileArtGrid from "@/components/profile/ProfileArtGrid";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { Colors } from "@/constants/Colors";
import { useAuthSession } from "@/providers/AuthContextProvider";
import { ArtworkData } from "@/utils/artworkData";
import { UserData } from "@/utils/userData";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AlertModal from "@/components/Modals/AlertModal";

export default function PersonalProfile() {
	const { logOut, user } = useAuthSession();
	const [userData, setUserData] = useState<UserData | null>(null);
	const [artworks, setArtworks] = useState<ArtworkData[] | []>([]);
	const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
		useState<boolean>(false);
	const navigation = useNavigation();
	const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

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

	useFocusEffect(
		useCallback(() => {
			fetchUserData();
			getSelectedArtworkFromDb();
		}, [])
	);

	useEffect(() => {
		fetchUserData();
		getSelectedArtworkFromDb();

		navigation.setOptions({
			title: "Your Profile",
			headerTitleAlign: "center",
			headerLeft: () => (
				<Pressable
					onPress={() => {
						setIsLogOutModalOpen(true);
					}}
					style={{
						marginLeft: 16,
					}}
					accessible={true}
					accessibilityLabel="Log out"
				>
					<MaterialIcons name="logout" size={24} color={Colors.ArtVistaRed} />
				</Pressable>
			),
			headerRight: () => (
				<Pressable
					onPress={() => {
						setIsEditProfileModalOpen(true);
					}}
					style={{ marginRight: 16 }}
					accessible={true}
					accessibilityLabel="Profile settings"
				>
					<MaterialIcons name="settings" size={24} color={Colors.ArtVistaRed} />
				</Pressable>
			),
		});
	}, [navigation]);

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
			<ProfileInfo userData={userData} />
			<ProfileArtGrid artworks={artworks} />

			{/* Edit Profile Modal */}
			<Modal
				visible={isEditProfileModalOpen}
				accessible={true}
				accessibilityViewIsModal={true}
				accessibilityLabel="Edit profile modal"
			>
				<EditProfileModal
					closeModal={() => setIsEditProfileModalOpen(false)}
					userData={userData} // Ensure userData is passed correctly
					onSave={fetchUserData}
				/>
			</Modal>
			<Modal
				visible={isLogOutModalOpen}
				accessible={true}
				accessibilityViewIsModal={true}
				accessibilityLabel="Log out Confirmation"
			>
				<AlertModal
					prompt="Are you sure you want to log out?"
					optionNo="No, cancel"
					optionYes="Yes, Log Out"
					onConfirm={logOut}
					onCancel={() => {
						setIsLogOutModalOpen(false);
					}}
				/>
			</Modal>
		</View>
	);
}
