import {
	View,
	Text,
	StyleSheet,
	Platform,
	Dimensions,
	SafeAreaView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ArtworkData } from "@/utils/artworkData";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { UserData } from "@/utils/userData";
import { getUserInfoById } from "@/api/userApi";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";

type ArtworkCarouselItemProps = {
	artwork: ArtworkData;
	onLayout?: (e: any) => void;
};
const { height } = Dimensions.get("window");

export default function ArtworkCarouselItem({
	artwork,
}: ArtworkCarouselItemProps) {
	const { width, height } = Dimensions.get("window");
	// setting it slightly bigger for web
	const imageDimensionsStyle =
		Platform.OS === "web"
			? { width, height: height * 0.6 }
			: { width: width - 64, height: height * 0.4 };
	const [userData, setUserData] = useState<UserData | null>(null);

	// Fetch the user data
	async function fetchUserData() {
		const artistId = artwork.userId;
		const userInfoFromDb = await getUserInfoById(artistId);
		setUserData(userInfoFromDb);
	}

	useEffect(() => {
		fetchUserData();
	}, [artwork]);

	return (
		<SafeAreaView style={styles.imageContainer}>
			<Link
				href={{ pathname: "/artworkDetails/[id]", params: { id: artwork.id } }}
				accessibilityRole="link"
				accessibilityLabel={`Go to details of artwork titled '${artwork.title}'`}
			>
				<View>
					<Image
						style={[styles.image, imageDimensionsStyle]}
						source={{ uri: artwork.imageURL }}
						contentFit="contain"
						accessibilityLabel={`Image of artwork titled '${artwork.title}'`}
					/>
				</View>
			</Link>
			<Text
				style={styles.artworkTitle}
				accessibilityRole="text"
				accessibilityLabel={`Artwork title: ${artwork.title}`}
			>
				'{artwork.title}'
			</Text>
			<Link
				href={{ pathname: "/userProfile/[id]", params: { id: artwork.userId } }}
				accessibilityRole="link"
				accessibilityLabel={`Go to artist profile of ${artwork.artist}`}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: 6,
					}}
				>
					{/* Profile picture with red border if available */}
					<View style={styles.profilePicContainer}>
						{userData?.profileImageUrl ? (
							<Image
								source={{ uri: userData.profileImageUrl }}
								style={styles.profilePic}
								accessibilityLabel={`${artwork.artist} profile picture`}
							/>
						) : (
							<FontAwesome
								name="user-circle"
								size={24}
								color="black"
								accessibilityLabel={`Default profile picture for ${artwork.artist}`}
							/>
						)}
					</View>
					<Text
						style={styles.artistName}
						accessibilityRole="text"
						accessibilityLabel={`Artist: ${artwork.artist}`}
					>
						{artwork.artist}
					</Text>
				</View>
			</Link>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	artworkTitle: {
		textAlign: "center",
		marginBottom: 12,
		fontSize: 24,
		fontStyle: "italic",
	},
	image: {
		marginBottom: 36,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		...Platform.select({
			web: {
				marginTop: height * 0.05,
				marginBottom: height * 0.025,
			},
		}),
	},
	profilePicContainer: {
		width: 30,
		height: 30,
		borderRadius: 50, // Circle shape
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed, // Assuming you have a color constant for the red
		overflow: "hidden", // Ensures the image fits within the circular border
		justifyContent: "center",
		alignItems: "center",
	},
	profilePic: {
		width: "100%",
		height: "100%",
		borderRadius: 50,
	},
	artistName: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
	},
});
