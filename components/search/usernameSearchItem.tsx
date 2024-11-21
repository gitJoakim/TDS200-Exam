import { Text, View, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { UserData } from "@/utils/userData";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";

type UsernameSearchItemProps = {
	userData: UserData;
	numberOfArtworks: number;
};

export default function UsernameSearchItem({
	userData,
	numberOfArtworks,
}: UsernameSearchItemProps) {
	return (
		<View style={styles.cardContainer}>
			<Link
				href={{
					pathname: "/userProfile/[id]",
					params: { id: userData.userId },
				}}
				accessible={true}
				accessibilityRole="link"
				accessibilityLabel={`Go to ${userData.username}'s profile`}
			>
				<View style={styles.cardContent}>
					{/* Profile picture with red border if available */}
					<View style={styles.profilePicContainer}>
						{userData?.profileImageUrl ? (
							<Image
								source={{ uri: userData.profileImageUrl }}
								style={styles.profilePic}
								resizeMode="cover"
								accessible={true}
								accessibilityLabel={`${userData.username}'s profile picture`}
							/>
						) : (
							<FontAwesome
								name="user-circle"
								size={47}
								color="black"
								style={styles.icon}
								accessible={true}
								accessibilityLabel={`${userData.username}'s profile picture`}
							/>
						)}
					</View>

					<View>
						<Text
							style={styles.username}
							accessible={true}
							accessibilityRole="text"
							accessibilityLabel={`Username: ${userData.username}`}
						>
							{userData.username}
						</Text>
						<Text
							style={styles.postsCount}
							accessible={true}
							accessibilityRole="text"
							accessibilityLabel={`${numberOfArtworks} artworks`}
						>
							{numberOfArtworks} artworks
						</Text>
					</View>
				</View>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		width: "100%",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ArtVistaRed,
	},
	cardContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start", // Align content to the start (left side)
	},
	profilePicContainer: {
		width: 50,
		height: 50,
		borderRadius: 50,
		overflow: "hidden",
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed, // Optional border for profile pic
		marginRight: 12, // Space between the profile picture and the text
		justifyContent: "center", // Center the content inside the container
		alignItems: "center", // Ensure content is centered horizontally
	},
	profilePic: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	icon: {
		// Align the icon inside the container with the same size as the container
		width: 47,
		height: 47,
		// The icon itself will now be centered inside the container automatically
	},
	username: {
		fontSize: 16,
		fontWeight: "bold",
		color: "black", // Dark color for the username
	},
	postsCount: {
		fontSize: 14,
		color: "#777", // Lighter gray for the posts count
		marginTop: 4,
	},
});
