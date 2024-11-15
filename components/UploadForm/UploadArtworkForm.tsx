import { useRef, useState } from "react";
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
import CameraModal from "../Modals/CameraModal";
import GalleryModal from "../Modals/GalleryModal";
import { dateFormatter } from "@/utils/dateFormatter";
import { ArtworkData } from "@/utils/artworkData";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import FormActionButtons from "./FormActionButtons";
import HashtagsInput from "./HashtagsInput";
import ImagePicker from "./ImagePicker";
import * as Location from "expo-location";

import MapModal from "../Modals/MapModal";
import LocationSetter from "./LocationSetter";

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

	function clearForm() {
		setTitle("");
		setDescription("");
		setImage(null);
		setHashtagsArray([]);
		setLocation(null);
	}

	// checks if the title, description, and image are valid
	// hashtags aren't mandatory
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

	function createArtwork() {
		// If validation fails, we just stop creation
		if (!validateArtworkInputs()) {
			return;
		}

		const artwork: ArtworkData = {
			id: "", // we grab the id from firebase when we get the post so we don't need it yet
			userId: user!.uid,
			artist: user?.displayName!,
			title: title,
			description: description,
			imageURL: image!,
			hashtags: hashtagsArray,
			date: dateFormatter(),
			artworkCoords: location,
		};

		console.log(artwork);
		return artwork;
	}

	function blurDuringUpload() {
		setIsUploading(true);
		setTimeout(() => {
			setIsUploading(false);
			clearForm();
		}, 3500);
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
				// safeareaview for some reason ignored the statusbar on android ??? so this is my solution
			}}
		>
			<ScrollView
				style={{ flex: 1 }}
				keyboardDismissMode="interactive"
				automaticallyAdjustKeyboardInsets
			>
				<View style={{ paddingHorizontal: 24 }}>
					<Text>Title</Text>
					<TextInput
						style={styles.textInput}
						value={title}
						onChangeText={setTitle}
					/>

					{/*  Upload image from camera or gallery	*/}
					<ImagePicker
						image={image}
						setImage={setImage}
						setIsGalleryModalOpen={setIsGalleryModalOpen}
						setIsCameraModalOpen={setIsCameraModalOpen}
						width={width - 64}
						height={height * 0.4}
					/>

					<Text>Description</Text>
					<TextInput
						style={[styles.textInput, styles.descriptionTextField]}
						value={description}
						onChangeText={setDescription}
						multiline={true}
						placeholder="Describe the artwork.."
					/>

					{/*  Hashtags component		*/}
					<HashtagsInput
						hashtagsArray={hashtagsArray}
						setHashtagsArray={setHashtagsArray}
					/>

					{/* Location setter */}
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

			<Modal visible={isMapModalOpen} animationType="slide">
				<MapModal
					closeModal={() => setIsMapModalOpen(false)}
					setLocation={setLocation}
				/>
			</Modal>

			{/*	Camera and gallery modals 	*/}
			<Modal visible={isGalleryModalOpen}>
				<GalleryModal
					closeModal={() => {
						setIsGalleryModalOpen(false);
					}}
					setImage={setImage}
				/>
			</Modal>
			<Modal visible={isCameraModalOpen}>
				<CameraModal
					closeModal={() => {
						setIsCameraModalOpen(false);
					}}
					setImage={setImage}
				/>
			</Modal>

			{/*  Blurs screen during upload		*/}
			{isUploading && (
				<BlurView
					intensity={20}
					style={[styles.blurContainer, { height: height, width: width }]}
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
				</BlurView>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	textInput: {
		borderColor: "black",
		borderWidth: 1,
		padding: 8,
		marginBottom: 32,
		borderRadius: 12,
		width: "100%",
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
		justifyContent: "center",
		alignItems: "center",
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
