import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	Platform,
	ScrollView,
	Image,
	Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Link } from "expo-router";
import { ArtworkData, LikeData } from "@/utils/artworkData";
import "ol/ol.css";
import WebMapWithOl from "./WebMap/WebMapWithOl";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import fetchAddressWithGoogleAPI from "@/utils/getAddressWithGoogle";
import * as Location from "expo-location";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { UserData } from "@/utils/userData";
import { useAuthSession } from "@/providers/AuthContextProvider";
import { getUserInfoById } from "@/api/userApi";
import { Colors } from "@/constants/Colors";
import * as artworkAPI from "@/api/artworkApi";
import CommentSection from "./CommentSection";

type ArtworkProps = {
	artworkData: ArtworkData | null;
};

export default function Artwork({ artworkData }: ArtworkProps) {
	const { width, height } = Dimensions.get("window");
	const imageDimensionsStyle = { width: width - 48, height: height * 0.4 };
	const [addressCoords, setAddressCoords] = useState<
		Location.LocationGeocodedAddress[] | null
	>(null);
	const [regionForMobileView, setRegionForMobileView] = useState({
		latitude: 10.75,
		longitude: 59.9,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});
	const [location, setLocation] =
		useState<Location.LocationObjectCoords | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [likesData, setLikesData] = useState<LikeData | null>(null);
	const [userHasLiked, setUserHasLiked] = useState(false);
	const { user } = useAuthSession();

	// Fetch the user data
	async function fetchUserData() {
		const userId = artworkData!.userId;
		const userInfoFromDb = await getUserInfoById(userId);
		setUserData(userInfoFromDb);
	}

	async function fetchLikesData() {
		const artworkId = artworkData!.id;
		const likesDataFromDb = await artworkAPI.getLikesByArtworkId(artworkId);
		setLikesData(likesDataFromDb?.likeData || null);
		if (likesDataFromDb?.likeData.userIds.includes(user!.uid)) {
			setUserHasLiked(true);
		} else {
			setUserHasLiked(false);
		}
	}

	async function handleLikeClick(artworkId: string, userId: string) {
		try {
			await artworkAPI.toggleLike(artworkId, userId); // Toggle the like on Firestore
			fetchLikesData(); // Fetch updated like data after the operation
		} catch (error) {
			console.error("Error toggling like:", error);
		}
	}

	const fetchAddressInfoFromCoords = async () => {
		if (location) {
			const address = await getAddressFromCoords(location);
			setAddressCoords(address);
		}
	};

	const fetchAddressInfoFromGoogle = async () => {
		if (location) {
			const address = await fetchAddressWithGoogleAPI(location);
			setAddressCoords(address);
		}
	};

	const renderHashtags = (hashtags: string[]) => {
		return hashtags.map((hashtag, index) => {
			return (
				<Text key={index} style={styles.hashtags}>
					{hashtag}
				</Text>
			);
		});
	};

	useEffect(() => {
		if (artworkData?.artworkCoords) {
			const { latitude, longitude } = artworkData.artworkCoords;
			setLocation({
				latitude,
				longitude,
				altitude: null,
				accuracy: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			});
			setRegionForMobileView({
				latitude: latitude,
				longitude: longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
		}
		fetchUserData();
		fetchLikesData();
	}, [artworkData]);

	useEffect(() => {
		if (location) {
			if (Platform.OS === "web" || "android") {
				fetchAddressInfoFromGoogle();
			} else {
				fetchAddressInfoFromCoords();
			}
		}
	}, [location]);

	return (
		<ScrollView style={styles.scrollContainer}>
			<View style={styles.container}>
				{/* Artwork Title and Artist */}
				<View>
					<Text style={styles.title}>{artworkData!.title}</Text>

					{/* Artwork Image */}

					<Image
						resizeMode="contain"
						style={[styles.artworkImage, imageDimensionsStyle]}
						source={{ uri: artworkData!.imageURL }}
					/>
				</View>
				{/* Date */}
				<Text style={styles.dateText}>{artworkData!.date}</Text>
				<View style={styles.textContainer}>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginVertical: 12, // Vertical margin
						}}
					>
						<Link
							href={{
								pathname: "/userProfile/[id]",
								params: { id: artworkData!.userId },
							}}
						>
							<View
								style={{
									width: "100%", // Ensure the container takes full width
									flexDirection: "row", // Horizontal layout
									alignItems: "center", // Vertically center items within the row
									justifyContent: "flex-start", // Align the items to the left
									columnGap: 6, // Space between image and text
								}}
							>
								<View style={styles.profilePicContainer}>
									{userData?.profileImageUrl ? (
										<Image
											resizeMode="center"
											source={{ uri: userData?.profileImageUrl! }}
											style={{ width: 24, height: 24, borderRadius: 50 }}
										/>
									) : (
										<FontAwesome name="user-circle" size={24} color="black" />
									)}
								</View>
								<Text style={styles.artistName}>{artworkData!.artist}</Text>
							</View>
						</Link>
						<Pressable
							onPress={() => {
								console.log("clicked like");
								handleLikeClick(artworkData!.id, user!.uid);
							}}
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								columnGap: 6,
							}}
						>
							<Text style={{ color: Colors.ArtVistaRed }}>
								{likesData?.userIds.length}
							</Text>
							<FontAwesome
								name={userHasLiked ? "heart" : "heart-o"} // Conditionally render heart or heart-o
								size={28}
								color={Colors.ArtVistaRed}
							/>
						</Pressable>
					</View>

					{/* Artwork Description */}
					<Text style={styles.description}>{artworkData!.description}</Text>

					{/* Hashtags */}
					<View style={styles.hashtagsContainer}>
						{renderHashtags(artworkData!.hashtags)}
					</View>
				</View>

				{/* Location */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
						marginBottom: 8,
					}}
				>
					<View style={styles.locationTextContainer}>
						<Text style={styles.locationTextStyle}>Location:</Text>
						<Text style={styles.locationTextStyle}>
							{artworkData!.artworkCoords
								? `${addressCoords?.[0]?.city}, ${addressCoords?.[0]?.country}`
								: "Unknown"}
						</Text>
					</View>
				</View>
				{/* Map Container */}
				<View style={styles.mapContainer}>
					{/* Conditionally render WebMapWithOl for Web or MapView for Mobile */}
					{Platform.OS === "web" ? (
						<WebMapWithOl region={location} />
					) : (
						<MapView
							style={styles.tinyMap}
							region={regionForMobileView} // Make sure `region` is correctly defined before using
							zoomEnabled={true}
							scrollEnabled={true}
							rotateEnabled={false}
							pitchEnabled={false}
						>
							{artworkData?.artworkCoords && (
								<Marker coordinate={artworkData.artworkCoords} />
							)}
						</MapView>
					)}
					{/* Overlay to grey out the map if no location */}
					{!location && <View style={styles.greyOverlay} />}
				</View>
				<CommentSection artworkId={artworkData!.id} />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
	},
	container: {
		backgroundColor: "white",
		flex: 1,
		justifyContent: "flex-start", // Keep it at the top
		alignItems: "center", // Align all children horizontally at the center
		paddingHorizontal: 24,
		paddingVertical: 24,
		width: "100%", // Ensure the container takes full width
		...(Platform.OS === "web" && {
			width: "50%", // Adjust width for web
			marginHorizontal: "auto", // Center content in web
		}),
	},
	artistName: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
	},
	dateText: {
		fontSize: 14,
		marginBottom: 20,
	},
	artworkImage: {
		marginVertical: 12,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 12,
	},
	description: {
		fontSize: 16,
		marginBottom: 12,
	},
	hashtags: {
		marginBottom: 20,
		textAlign: "center",
		color: "blue",
	},
	textContainer: {
		paddingHorizontal: 6,
		width: "100%",
		alignItems: "flex-start",
	},
	locationTextStyle: {
		textAlign: "center",
		fontSize: 14,
	},
	locationTextContainer: {
		paddingHorizontal: 6,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	hashtagsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	mapContainer: {
		width: "100%",
		height: 180, // A bit larger map container to keep a balance
		borderRadius: 10,
		overflow: "hidden",
		marginBottom: 12,
		position: "relative",
	},
	profilePicContainer: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
		borderWidth: 3,
		borderColor: Colors.ArtVistaRed,
	},
	tinyMap: {
		width: "100%",
		height: "100%",
		borderRadius: 10,
	},
	greyOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent grey overlay
		borderRadius: 8,
	},
});
