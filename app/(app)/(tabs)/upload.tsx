import { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Modal,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { Platform } from "react-native";
import { useAuthSession } from "@/providers/AuthContextProvider";
import { ArtworkData } from "@/utils/artworkData";
import { Colors } from "@/constants/Colors";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";
import LocationSetter from "@/components/UploadForm/LocationSetter";
import MapModal from "@/components/Modals/MapModal";
import FormActionButtons from "@/components/UploadForm/FormActionButtons";
import HashtagsInput from "@/components/UploadForm/HashtagsInput";
import ImagePicker from "@/components/UploadForm/ImagePicker";
import GalleryModal from "@/components/Modals/GalleryModal";
import CameraModal from "@/components/Modals/CameraModal";

export default function UploadArtworkForm() {
	const [hashtagsArray, setHashtagsArray] = useState<string[]>([]);
	const [image, setImage] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState<string>("");
	const [location, setLocation] =
		useState<Location.LocationObjectCoords | null>(null);
	const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
	const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);
	const { user } = useAuthSession();
	const { width, height } = Dimensions.get("window");
	const [isUploading, setIsUploading] = useState(false);
	const navigation = useNavigation();
	const scrollViewRef = useRef<ScrollView>(null);

	// clear all form fields
	function clearForm() {
		setTitle("");
		setDescription("");
		setImage(null);
		setHashtagsArray([]);
		setLocation(null);
	}

	// checks if the title, description, and image are valid
	// hashtags and location aren't mandatory
	// gives alerts when mandatory fields are not filled
	function validateArtworkInputs() {
		if (!title.trim()) {
			alert("Please add a valid title to your artwork.");
			return false;
		}

		if (!description.trim()) {
			alert("Please enter a description for the artwork.");
			return false;
		}

		if (!image) {
			alert("Please add an image of the artwork.");
			return false;
		}

		return true;
	}

	// creating artwork
	function createArtwork() {
		// If validation fails, we just stop creation
		if (!validateArtworkInputs()) {
			return;
		}

		const artwork: ArtworkData = {
			id: "", // we grab the id from firebase when we get the post so we don't need it yet
			userId: user!.uid,
			artist: user!.displayName!,
			title: title,
			description: description,
			imageURL: image!,
			hashtags: hashtagsArray,
			date: new Date(),
			artworkCoords: location,
		};
		return artwork;
	}

	// blur/whiten out background during upload to minimize potential bugs
	// this also gives a good indicator to the user that we are uploading
	function blurDuringUpload() {
		setIsUploading(true);
		setTimeout(() => {
			setIsUploading(false);
			clearForm();
			scrollViewRef.current?.scrollTo({ y: 0, animated: true });
		}, 3500);
	}

	// setup header on init
	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				borderBottomWidth: 1,
				borderBottomColor: Colors.ArtVistaRed,
			},
		});
	}, []);

	return (
		<SafeAreaView style={[styles.contentContainer]}>
			<ScrollView
				ref={scrollViewRef}
				style={{ flex: 1 }}
				keyboardDismissMode="interactive"
				automaticallyAdjustKeyboardInsets
			>
				<View style={{ paddingHorizontal: 24, marginVertical: 12 }}>
					{/* Title input field */}
					<Text style={styles.textStyle}>Title *</Text>
					<TextInput
						style={styles.textInput}
						value={title}
						onChangeText={setTitle}
						placeholder="Give the artwork a title..."
						accessibilityLabel="Artwork title input"
						accessibilityHint="Enter a title for the artwork"
					/>

					{/*  Upload image from camera or gallery component	*/}
					<ImagePicker
						image={image}
						setIsGalleryModalOpen={setIsGalleryModalOpen}
						setIsCameraModalOpen={setIsCameraModalOpen}
						width={width - 64}
						height={height * 0.4}
					/>

					{/* Description input field */}
					<Text style={styles.textStyle}>Description *</Text>
					<TextInput
						style={[styles.textInput, styles.descriptionTextField]}
						value={description}
						onChangeText={setDescription}
						multiline={true}
						placeholder="Describe the artwork.."
						textAlignVertical="top" // had to set this for android, its auto top on web and ios
						accessibilityLabel="Artwork description input"
						accessibilityHint="Describe your artwork in a few words"
					/>

					{/*  Hashtags component	*/}
					<HashtagsInput
						hashtagsArray={hashtagsArray}
						setHashtagsArray={setHashtagsArray}
					/>

					{/* Location setter component */}
					<LocationSetter
						location={location}
						setIsMapModalOpen={setIsMapModalOpen}
					/>

					{/*  Upload and Clear-input buttons		*/}
					<FormActionButtons
						createArtwork={createArtwork}
						blurDuringUpload={blurDuringUpload}
						clearForm={clearForm}
					/>
				</View>
			</ScrollView>

			{/* Modal for map to set location */}
			<Modal
				visible={isMapModalOpen}
				animationType="slide"
				accessibilityViewIsModal={true}
				accessibilityLabel="Map modal to select artwork location"
			>
				<MapModal
					closeModal={() => setIsMapModalOpen(false)}
					setLocation={setLocation}
				/>
			</Modal>

			{/*	Gallery modal 	*/}
			<Modal
				visible={isGalleryModalOpen}
				accessibilityViewIsModal={true}
				accessibilityLabel="Gallery Modal"
			>
				<GalleryModal
					closeModal={() => {
						setIsGalleryModalOpen(false);
					}}
					setImage={setImage}
				/>
			</Modal>

			{/* Camera modal */}
			<Modal
				visible={isCameraModalOpen}
				accessibilityViewIsModal={true}
				accessibilityLabel="Camera Modal"
			>
				<CameraModal
					closeModal={() => {
						setIsCameraModalOpen(false);
					}}
					setImage={setImage}
				/>
			</Modal>

			{/*  Blurs screen during upload		*/}
			{isUploading && (
				<View
					style={styles.blurContainer}
					accessibilityLiveRegion="assertive"
					accessibilityRole="alert"
					accessibilityLabel="Uploading artwork, please wait."
				>
					<ActivityIndicator />
					<Text style={{ textAlign: "center", marginTop: 12, fontSize: 18 }}>
						Uploading your masterpiece to{" "}
						<Text
							style={{
								color: Colors.ArtVistaRed,
								fontSize: 30,
								fontFamily: "Dancing-Script",
							}}
						>
							ArtVista
						</Text>
						.
					</Text>
					<Text style={{ textAlign: "center", marginTop: 6, fontSize: 18 }}>
						Please wait a moment!
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		backgroundColor: "white",
		...(Platform.OS === "web" && {
			width: "50%",
			marginHorizontal: "auto",
		}),
	},
	textInput: {
		borderColor: Colors.ArtVistaRed,
		borderWidth: 1,
		padding: 8,
		marginBottom: 32,
		borderRadius: 8,
		width: "100%",
	},
	textStyle: {
		color: Colors.ArtVistaRed,
		fontSize: 18,
	},
	hashtagsContainer: {
		gap: 12,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		flexWrap: "wrap",
		marginBottom: 12,
	},
	hashtag: {
		backgroundColor: "lightgray",
	},
	hashtagTextColor: {
		color: "blue",
	},
	descriptionTextField: {
		height: 100,
	},
	blurContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.8)",
	},

	locationContainer: {
		marginBottom: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	tinyMap: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginBottom: 8,
	},
	locationIconContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	locationText: {
		color: Colors.ArtVistaRed,
		marginTop: 8,
		fontSize: 12,
	},
});
