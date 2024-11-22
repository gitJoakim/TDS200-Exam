import React, { useState } from "react";
import {
	Modal,
	View,
	Text,
	TextInput,
	Pressable,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { UserData } from "@/utils/userData";
import { Colors } from "@/constants/Colors";
import { updateUserBio, updateUserProfilePicture } from "@/api/userApi";
import GalleryModal from "./GalleryModal";

interface EditProfileModalProps {
	closeModal: () => void;
	userData: UserData | null;
	onSave?: () => void;
}

export default function EditProfileModal({
	closeModal,
	userData,
	onSave,
}: EditProfileModalProps) {
	const [editedBioText, setEditedBioText] = useState<string>(
		userData?.bio || ""
	);
	const [selectedImage, setSelectedImage] = useState<string | null>(
		userData?.profileImageUrl || null
	);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);

	// save function, saves image and bio if they have been changed
	const handleSave = async () => {
		if (!userData) return;

		let updated = false;

		if (editedBioText !== userData.bio) {
			await updateUserBio(userData.userId, editedBioText);
			updated = true;
		}

		if (selectedImage && selectedImage !== userData.profileImageUrl) {
			await updateUserProfilePicture(userData.userId, selectedImage);
			updated = true;
		}

		if (updated && onSave) {
			console.log("Changes saved successfully");
			onSave();
		}
		closeModal();
	};

	// Close modal when user taps cancel
	const handleCancel = () => {
		closeModal();
	};

	// open image picker modal when user taps camera icon
	const openImagePicker = () => {
		setIsImageModalOpen(true);
	};

	return (
		<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>

				{/* Profile Image container */}
				<TouchableOpacity
					onPress={openImagePicker}
					style={styles.profilePicContainer}
					accessibilityRole="button"
					accessibilityLabel="Change profile picture"
					accessibilityHint="Tap to select a new profile picture"
				>
					{selectedImage ? (
				// Profile Image
						<Image
							source={{ uri: selectedImage }}
							style={styles.profilePic}
							accessibilityLabel="Your profile picture"
						/>
					) : (
				// default profile icon if user has no picture
						<FontAwesome
							name="user-circle"
							size={104}
							color="black"
							accessibilityLabel="Default profile picture"
						/>
					)}
				
				{ /* camera icon to indicate that u can change picture  */ }
					<View style={styles.cameraIconOverlay}>
						<FontAwesome name="camera" size={24} color="white" />
					</View>
				</TouchableOpacity>

				{/* Username */}
				<Text style={styles.username} accessibilityLabel="Username">
					{userData?.username}
				</Text>

				{/* Bio */}
				<TextInput
					style={styles.textInput}
					value={editedBioText}
					onChangeText={setEditedBioText}
					multiline
					placeholder="Write something about yourself..."
					maxLength={200}
					textAlignVertical="top" // had to set this for android, its auto top on web and ios
					accessibilityLabel="Edit bio"
					accessibilityHint="Tap to edit your biography"
				/>
				<Text style={styles.charCount}>{editedBioText.length}/200</Text>

				{/* Save & Cancel Buttons */}
				<View style={styles.buttonsContainer}>
					<Pressable
						style={[styles.button, styles.cancelButton]}
						onPress={handleCancel}
						accessibilityRole="button"
						accessibilityLabel="Cancel editing"
						accessibilityHint="Tap to cancel the changes and close the modal"
					>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</Pressable>
					<Pressable
						style={styles.button}
						onPress={handleSave}
						accessibilityRole="button"
						accessibilityLabel="Save changes"
						accessibilityHint="Tap to save your changes and update your profile"
					>
						<Text style={styles.buttonText}>Save</Text>
					</Pressable>
				</View>
			</View>

			{/* Image Picker Modal */}
			{isImageModalOpen && (
				<Modal
					transparent={true}
					animationType="slide"
					accessibilityViewIsModal={true}
					accessibilityLabel="Image selection modal"
				>
					<GalleryModal
						closeModal={() => setIsImageModalOpen(false)}
						setImage={(imageUri: string) => {
							setSelectedImage(imageUri);
							setIsImageModalOpen(false);
						}}
					/>
				</Modal>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		width: "80%",
		borderRadius: 10,
		alignItems: "center",
	},
	profilePicContainer: {
		marginBottom: 20,
		width: 110,
		height: 110,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 55,
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed,
	},
	profilePic: {
		width: 104,
		height: 104,
		borderRadius: 52,
	},
	cameraIconOverlay: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		borderRadius: 15,
		padding: 4,
	},
	username: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	textInput: {
		width: "100%",
		height: 100,
		borderColor: Colors.ArtVistaRed,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginBottom: 5,
	},
	charCount: {
		alignSelf: "flex-end",
		fontSize: 12,
		color: "#777",
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 20,
		paddingHorizontal: 20,
	},

	button: {
		backgroundColor: Colors.ArtVistaRed,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},

	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},

	cancelButton: {
		backgroundColor: "transparent",
		borderColor: "gray",
		borderWidth: 2,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},

	cancelButtonText: {
		color: "gray",
		fontSize: 16,
		fontWeight: "bold",
	},
});
