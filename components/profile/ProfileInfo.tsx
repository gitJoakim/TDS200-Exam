import { UserData } from "@/utils/userData";
import { View, Text, Image, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type ProfileInfoProps = {
	userData: UserData | null;
};

export default function ProfileInfo({ userData }: ProfileInfoProps) {
	if (!userData) {
		return (
			<View style={styles.mainContainer}>
				<Text>An error occurred. No profile data available.</Text>
			</View>
		);
	}

	return (
		<View style={styles.mainContainer}>
			{/* Profile Picture */}
			<View style={styles.profilePicContainer}>
				{userData.profileImageUrl ? (
					<Image
						source={{ uri: userData.profileImageUrl }}
						style={styles.profilePic}
					/>
				) : (
					<FontAwesome name="user-circle" size={64} color="black" />
				)}
			</View>

			{/* Username */}
			<Text style={styles.username}>{userData.username}</Text>

			{/* Bio */}
			<View style={styles.bioContainer}>
				{userData.bio ? (
					<Text style={styles.bio}>{userData.bio}</Text>
				) : (
					<Text>This user has no bio yet.</Text>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: "center",
		justifyContent: "flex-start",
		width: "100%", // Ensure the container spans full width
		paddingVertical: 10, // Add some vertical padding for spacing
		backgroundColor: "white",
	},
	profilePicContainer: {
		alignItems: "center",
		marginBottom: 10,
	},
	profilePic: {
		width: 64,
		height: 64,
		borderRadius: 50,
	},
	username: {
		fontSize: 20,
		fontWeight: "bold",
	},
	bio: {
		fontSize: 14,
		textAlign: "center",
	},
	bioContainer: {
		marginTop: 10,
		marginBottom: 10,
	},
});
