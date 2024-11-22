import { UserData } from "@/utils/userData";
import { View, Text, Image, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";

type ProfileInfoProps = {
	userData: UserData | null;
};

export default function ProfileInfo({ userData }: ProfileInfoProps) {

	{ /* Render error message if no userData */ }
	if (!userData) {
		return (
			<View
				style={styles.mainContainer}
				accessible={true}
				accessibilityLabel="Profile data unavailable"
			>
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
						accessible={true}
						accessibilityLabel={`Profile picture of ${userData.username}`}
					/>
				) : (
					// Default icon if no profile pic
					<FontAwesome
						name="user-circle"
						size={64}
						color="black"
						accessible={true}
						accessibilityLabel={`Default profile picture for ${userData.username}`}
					/>
				)}
			</View>

			{/* Username */}
			<Text
				style={styles.username}
				accessible={true}
				accessibilityLabel={`Username: ${userData.username}`}
			>
				{userData.username}
			</Text>

			{/* Bio */}
			<View style={styles.bioContainer}>
				{userData.bio ? (
					<Text
						style={styles.bio}
						accessible={true}
						accessibilityLabel={`Bio: ${userData.bio}`}
					>
						{userData.bio}
					</Text>
				) : (
					// default bio if user has none
					<Text
						accessible={true}
						accessibilityLabel="This user has no bio yet."
					>
						This user has no bio yet.
					</Text>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: "center",
		justifyContent: "flex-start",
		width: "100%",
		paddingVertical: 10,
		backgroundColor: "white",
	},
	profilePicContainer: {
		alignItems: "center",
		marginBottom: 10,
		borderRadius: 50,
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed,
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
