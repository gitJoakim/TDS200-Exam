import React, { useState } from "react";
import {
	Modal,
	View,
	Text,
	TextInput,
	Pressable,
	StyleSheet,
	Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome icon
import { UserData } from "@/utils/userData"; // Assuming UserData is already imported
import { Colors } from "@/constants/Colors";

// Defining the props for EditProfileModal component
interface EditProfileModalProps {
	closeModal: () => void;
	userData: UserData | null;
}

export default function EditProfileModal({
	closeModal,
	userData,
}: EditProfileModalProps) {
	const [editedBio, setEditedBio] = useState<string>(userData?.bio || "");

	// Handle Save action: call the API to save changes
	const handleSave = async () => {
		console.log("clicked save");
		// You can add your API call here to save the bio changes
	};

	// Handle Cancel action: reset and close the modal
	const handleCancel = () => {
		closeModal(); // Ensure you're calling the closeModal function to close the modal
	};

	return (
		<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>
				{/* Profile Image or Icon */}
				<View style={styles.profilePicContainer}>
					{userData?.profileImageUrl ? (
						<Image
							source={{ uri: userData.profileImageUrl }}
							style={styles.profilePic}
						/>
					) : (
						<FontAwesome name="user-circle" size={64} color="black" />
					)}
				</View>

				{/* Username */}
				<Text style={styles.username}>{userData?.username}</Text>

				{/* Bio */}
				<TextInput
					style={styles.textInput}
					value={editedBio}
					onChangeText={setEditedBio}
					multiline
					placeholder="Write something about yourself..."
				/>

				{/* Save & Cancel Buttons */}
				<View style={styles.buttonsContainer}>
					<Pressable
						onPress={handleSave}
						style={[styles.button, styles.saveButton]}
					>
						<Text style={styles.buttonText}>Save</Text>
					</Pressable>
					<Pressable
						onPress={handleCancel}
						style={[styles.button, styles.cancelButton]}
					>
						<Text style={styles.buttonText}>Cancel</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

// Styles for the modal
const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 50,
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed,
	},
	profilePic: {
		width: 100,
		height: 100,
		borderRadius: 50, // Circular image
	},
	username: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	textInput: {
		width: "100%",
		height: 100,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		margin: 5,
	},
	saveButton: {
		backgroundColor: "#4CAF50",
	},
	cancelButton: {
		backgroundColor: "#f44336",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
});
