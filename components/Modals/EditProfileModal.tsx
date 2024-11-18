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
	const [isImageModalOpen, setIsImageModalOpen] = useState(false); // State to control ImageModal

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

	const handleCancel = () => {
		closeModal();
	};

	const openImagePicker = () => {
		setIsImageModalOpen(true);
	};

	return (
		<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>
				{/* Profile Image with Tap-to-Change */}
				<TouchableOpacity
					onPress={openImagePicker}
					style={styles.profilePicContainer}
				>
					{selectedImage ? (
						<Image source={{ uri: selectedImage }} style={styles.profilePic} />
					) : (
						<FontAwesome name="user-circle" size={104} color="black" />
					)}
					<View style={styles.cameraIconOverlay}>
						<FontAwesome name="camera" size={24} color="white" />
					</View>
				</TouchableOpacity>

				{/* Username */}
				<Text style={styles.username}>{userData?.username}</Text>

				{/* Bio */}
				<TextInput
					style={styles.textInput}
					value={editedBioText}
					onChangeText={setEditedBioText}
					multiline
					placeholder="Write something about yourself..."
					maxLength={200}
				/>
				<Text style={styles.charCount}>{editedBioText.length}/200</Text>

				{/* Save & Cancel Buttons */}
				<View style={styles.buttonsContainer}>
					<Pressable
						style={[styles.button, styles.cancelButton]}
						onPress={handleCancel}
					>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</Pressable>
					<Pressable style={styles.button} onPress={handleSave}>
						<Text style={styles.buttonText}>Save</Text>
					</Pressable>
				</View>
			</View>

			{/* Image Picker Modal */}
			{isImageModalOpen && (
				<Modal transparent={true} animationType="slide">
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
		width: 110, // Set width slightly larger than image
		height: 110, // Set height slightly larger than image
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 55, // Match half of container width/height
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed,
	},
	profilePic: {
		width: 104, // Match container size minus border width (110 - 6)
		height: 104, // Match container size minus border width (110 - 6)
		borderRadius: 52, // Match half of profilePic width/height
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
		justifyContent: "space-between", // Spaces out buttons
		width: "100%",
		marginTop: 20, // Optional margin for spacing
		paddingHorizontal: 20,
	},

	button: {
		backgroundColor: Colors.ArtVistaRed, // Red color for the Save button
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},

	buttonText: {
		color: "#fff", // White text color for the Save button
		fontSize: 16,
		fontWeight: "bold",
	},

	cancelButton: {
		backgroundColor: "transparent", // Transparent background for the Cancel button
		borderColor: "gray", // Grey border
		borderWidth: 2, // Border width
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},

	cancelButtonText: {
		color: "gray", // Gray text color for the Cancel button
		fontSize: 16,
		fontWeight: "bold",
	},
});
