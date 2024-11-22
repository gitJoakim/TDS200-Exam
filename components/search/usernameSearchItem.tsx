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
			{/* expo-router link to user profile */}
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
					{/* Profile picture*/}
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
							// default icon if no profile picture
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
						{/* Username*/}
						<Text
							style={styles.username}
							accessible={true}
							accessibilityRole="text"
							accessibilityLabel={`Username: ${userData.username}`}
						>
							{userData.username}
						</Text>

						{/* number of artworks user has uploaded */}
						<Text
							style={styles.artworksCount}
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
		justifyContent: "flex-start",
	},
	profilePicContainer: {
		width: 50,
		height: 50,
		borderRadius: 50,
		overflow: "hidden",
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed,
		marginRight: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	profilePic: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	icon: {
		width: 47,
		height: 47,
	},
	username: {
		fontSize: 16,
		fontWeight: "bold",
		color: "black",
	},
	artworksCount: {
		fontSize: 14,
		color: "#777",
		marginTop: 4,
	},
});
