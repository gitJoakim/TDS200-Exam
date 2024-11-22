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
	ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Link, useNavigation } from "expo-router";
import { ArtworkData, LikeData } from "@/utils/artworkData";
import "ol/ol.css";
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
import { Timestamp } from "firebase/firestore";
import SingleArtworkWebMap from "./MapsForWeb/SingleArtworkWebMap";

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
	const [likeClickLoading, setLikeClickLoading] = useState(false);
	const { user } = useAuthSession();
	const navigation = useNavigation();

	// Fetch the user data
	async function fetchUserData() {
		const userId = artworkData!.userId;
		const userInfoFromDb = await getUserInfoById(userId);
		setUserData(userInfoFromDb);
	}

	// fetch all likes
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

	// handles like click through API adds or removes userId from array
	async function handleLikeClick(artworkId: string, userId: string) {
		setLikeClickLoading(true);
		try {
			await artworkAPI.toggleLike(artworkId, userId);
			fetchLikesData();
			setLikeClickLoading(false);
		} catch (error) {
			console.error("Error toggling like:", error);
			setLikeClickLoading(false);
		}
	}

	// get address from coords through expo-location reverseGeocodeAsync()
	const getAddressInfoFromCoords = async () => {
		if (location) {
			const address = await getAddressFromCoords(location);
			setAddressCoords(address);
		}
	};

	// get address from coords thorugh google lcoation API
	const getAddressInfoFromGoogle = async () => {
		if (location) {
			const address = await fetchAddressWithGoogleAPI(location);
			setAddressCoords(address);
		}
	};

	// render all hashtags
	const renderHashtags = (hashtags: string[]) => {
		return hashtags.map((hashtag, index) => {
			return (
				<Text key={index} style={styles.hashtags}>
					{hashtag}
				</Text>
			);
		});
	};

	// date formatter, takes in fire firebase firestore Timestamp data type
	// inspired by someone on stack overflow
	const dateFormatter = (artworkDate: Timestamp) => {
		const dateOfArtwork = artworkDate.toDate();
		const formattedDate = dateOfArtwork.toLocaleDateString("en-GB", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const [day, month, year] = formattedDate.split(" ");
		return `${month} ${day}, ${year}`;
	};

	// initialize location and fetch relevant data when artworkData has been set
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

	// fetch address when location is set
	useEffect(() => {
		if (location) {
			// get address through google API for web and android
			if (Platform.OS === "web" || "android") {
				getAddressInfoFromGoogle();
			} else {
				// get address through expo-location reverseGeocodeAsync() for iOS
				getAddressInfoFromCoords();
			}
		}
	}, [location]);

	// set header style on init
	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				borderBottomWidth: 1,
				borderBottomColor: Colors.ArtVistaRed,
			},
		});
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.innerContainer}>
					{/* Artwork Title and Artist */}
					<View>
						<Text style={styles.title} accessibilityRole="text">
							{artworkData!.title}
						</Text>

						{/* Artwork Image */}

						<Image
							resizeMode="contain"
							style={[styles.artworkImage, imageDimensionsStyle]}
							source={{ uri: artworkData!.imageURL }}
							accessible={true}
							accessibilityLabel={`Artwork titled ${artworkData!.title}`}
						/>
					</View>
					{/* Date */}
					<Text style={styles.dateText} accessibilityRole="text">
						{dateFormatter(artworkData!.date as Timestamp)}
					</Text>
					<View style={styles.textContainer}>
						<View
							style={{
								width: "100%",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginVertical: 12, 
							}}
						>
							{ /* Link to profileDetails*/ }
							<Link
								href={{
									pathname: "/userProfile/[id]",
									params: { id: artworkData!.userId },
								}}
							>
								{ /* picture and name container */ }
								<View
									style={{
										width: "100%",
										flexDirection: "row", 
										alignItems: "center",
										justifyContent: "flex-start",
										columnGap: 6, 
									}}
									accessible={true}
									accessibilityRole="link"
									accessibilityLabel={`Go to ${artworkData!.artist}'s profile`}
								>
									<View style={styles.profilePicContainer}>
										{userData?.profileImageUrl ? (
											// picture 
											<Image
												resizeMode="cover"
												source={{ uri: userData?.profileImageUrl! }}
												style={{ width: 24, height: 24, borderRadius: 50 }}
												accessible={true}
												accessibilityLabel={`Profile image of ${artworkData?.artist}`}
											/>
										) : (
											// default icon if no picture
											<FontAwesome
												name="user-circle"
												size={24}
												color="black"
												accessible={true}
												accessibilityLabel={`Default profile image of ${artworkData?.artist}`}
											/>
										)}
									</View>
									{/* username */}
									<Text style={styles.artistName} accessibilityRole="text">
										{artworkData!.artist}
									</Text>
								</View>
							</Link>

							{ /* Like Button */ }
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
								accessible={true}
								accessibilityRole="button"
								accessibilityLabel="Like this artwork"
								accessibilityHint="Toggles like status"
							>
								<Text style={{ color: Colors.ArtVistaRed }}>
									{likesData?.userIds.length}
								</Text>

								{/* activity indicator to show that likeclick worked while updating data */ }
								{likeClickLoading ? (
									<ActivityIndicator color={Colors.ArtVistaRed} />
								) : (
									// render different based on if liked or not
									<FontAwesome
										name={userHasLiked ? "heart" : "heart-o"}
										size={28}
										color={Colors.ArtVistaRed}
									/>
								)}
							</Pressable>
						</View>

						{/* Artwork Description */}
						<Text style={styles.description} accessibilityRole="text">
							{artworkData!.description}
						</Text>

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
					{location && (
						<View style={styles.mapContainer}>
							{Platform.OS === "web" ? (
								// OpenLayers for Web
								<SingleArtworkWebMap region={location} />
							) : (
								// MapView for mobile
								<MapView
									style={styles.tinyMap}
									region={regionForMobileView}
									zoomEnabled={true}
									scrollEnabled={true}
									rotateEnabled={false}
									pitchEnabled={false}
									accessibilityLabel={`Map showing the location of ${
										artworkData!.title
									}`}
								>
									{artworkData?.artworkCoords && (
										<Marker
											coordinate={artworkData.artworkCoords}
											title={artworkData!.artist}
											description={artworkData!.title}
											accessibilityLabel="Artwork location"
										/>
									)}
								</MapView>
							)}

							{/* Overlay to grey out the map if no location */}
							{!location && <View style={styles.greyOverlay} />}
						</View>
					)}

					{/* Comment section */}
					<CommentSection artworkId={artworkData!.id} />
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flex: 1,
		justifyContent: "flex-start", 
		alignItems: "center", 
	},
	scrollContainer: {
		flex: 1,
		width: "100%",
	},
	innerContainer: {
		paddingHorizontal: 24,
		...(Platform.OS === "web" && {
			width: "50%", 
			marginHorizontal: "auto", 
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
		alignSelf: "center",
	},
	artworkImage: {
		marginVertical: 12,
		alignSelf: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 12,
		marginTop: 16,
	},
	description: {
		fontSize: 16,
		marginBottom: 12,
	},
	hashtags: {
		marginBottom: 6,
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
		marginBottom: 20,
		flexDirection: "row",
		flexWrap: "wrap",
		columnGap: 12,
	},
	mapContainer: {
		width: "100%",
		height: 180, 
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
		backgroundColor: "rgba(0, 0, 0, 0.6)", 
	},
});
