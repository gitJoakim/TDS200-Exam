import { useEffect, useState, useCallback, useRef } from "react";
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
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Platform } from "react-native";
import { useAuthSession } from "@/providers/AuthContextProvider";
import ImageModal from "./Modals/GalleryModal";
import CameraModal from "./Modals/CameraModal";
import { dateFormatter } from "@/utils/dateFormatter";
import { ArtworkData } from "@/utils/artworkData";
import { addArtwork } from "@/api/artworkApi";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import FormActionButtons from "./UploadForm/FormActionButtons";

export default function UploadArtworkForm() {
	const [hashtag, setHashtag] = useState<string>("#");
	const [hashtagsArray, setHashtagsArray] = useState<string[]>([]);
	const hashtagInputRef = useRef<TextInput>(null);
	const [image, setImage] = useState<string | null>(null);
	const [date, setDate] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState<string>("");

	const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
	const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

	const { userNameSession } = useAuthSession();

	const { width, height } = Dimensions.get("window");
	const imageDimensionsStyle = { width: width - 64, height: height * 0.4 };

	const [isUploading, setIsUploading] = useState(false);

	function handleHashtagChange(input: string) {
		// makes sure inputfield starts with hashtag and only valid input is english alphabet or numbers
		// ** not mine, taken from stack overflow **
		const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, "").replace(/^#/, "");
		setHashtag(`#${sanitizedInput}`);
	}

	// add hashtag to the array
	function addHashtag() {
		if (hashtag.trim() && hashtag !== "#") {
			setHashtagsArray((prev) => [...prev, hashtag]);
			setHashtag("#");

			if (hashtagInputRef.current) {
				hashtagInputRef.current.focus();
			}
		}
	}

	// remove a hashtag from the array
	function removeHashtag(index: number) {
		setHashtagsArray((prev) => prev.filter((_, i) => i !== index));
	}

	// render all the hashtags
	function renderHashtagsJSX() {
		return hashtagsArray.map((hashtag: string, index) => (
			<Pressable
				key={index}
				style={styles.hashtag}
				onPress={() => removeHashtag(index)}
			>
				<Text style={styles.hashtagTextColor}>{hashtag}</Text>
			</Pressable>
		));
	}

	function clearForm() {
		setTitle("");
		setDescription("");
		setImage(null);
		setHashtagsArray([]);
		setHashtag("#");
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
			artist: userNameSession!,
			title: title,
			description: description,
			imageURL: image!,
			hashtags: hashtagsArray,
			date: dateFormatter(),
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

					<View
						style={{
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<View
							style={{
								width: "100%",
								height: 300,
								borderWidth: image ? 0 : 2,
								justifyContent: "center",
							}}
						>
							{image ? (
								<Image
									source={{ uri: image }}
									contentFit="contain"
									style={imageDimensionsStyle}
								/>
							) : (
								<Text
									style={{
										textAlign: "center",
										fontSize: 32,
										fontWeight: "bold",
									}}
								>
									Add an image of the Artwork
								</Text>
							)}
						</View>

						<View
							style={{
								flexDirection: "row",
								gap: 64,
							}}
						>
							{/* check platform and dont render camera modal button for web */}
							{Platform.OS !== "web" && (
								<Pressable
									style={{
										borderRadius: 50,
										backgroundColor: "orange",
										padding: 16,
									}}
									onPress={() => {
										setIsCameraModalOpen(true);
									}}
								>
									<Feather name="camera" size={32} color="black" />
								</Pressable>
							)}
							<Pressable
								style={{
									borderRadius: 50,
									backgroundColor: "orange",
									padding: 16,
								}}
								onPress={() => {
									setIsGalleryModalOpen(true);
								}}
							>
								<FontAwesome name="image" size={32} color="black" />
							</Pressable>
						</View>
					</View>

					<Text>Description</Text>
					<TextInput
						style={[styles.textInput, styles.descriptionTextField]}
						value={description}
						onChangeText={setDescription}
						multiline={true}
						placeholder="Describe the artwork.."
					/>

					<Text
						style={{
							textAlign: "center",
							color: "gray",
							marginVertical: 6,
						}}
					>
						{hashtagsArray.length === 0
							? "Type a hashtag and press Enter to add it (you can add multiple)"
							: "Tap a hashtag to remove it"}
					</Text>

					<View style={styles.hashtagsContainer}>{renderHashtagsJSX()}</View>
					<View
						style={{
							flexDirection: "row",
							width: "100%",
							alignItems: "center",
						}}
					>
						<TextInput
							style={[styles.textInput, { color: "blue", flex: 1 }]}
							value={hashtag}
							onChangeText={handleHashtagChange} // Use the filtered input handler
							autoCapitalize="none"
							onSubmitEditing={(event) => {
								addHashtag();
								event.preventDefault();
							}}
							ref={hashtagInputRef}
							blurOnSubmit={false} // input dont lose focus on submitting hashtag
						/>
					</View>

					{/*  Upload and Clear input buttons		*/}
					<FormActionButtons
						createArtwork={createArtwork}
						blurDuringUpload={blurDuringUpload}
						clearForm={clearForm}
					/>
				</View>
			</ScrollView>

			{/*	Camera and gallery modals	*/}
			<Modal visible={isGalleryModalOpen}>
				<ImageModal
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
		position: "absolute", // Makes the blur overlay position absolute
		top: 0,
		left: 0,
		justifyContent: "center", // Center content inside the blur container
		alignItems: "center", // Center content horizontally
	},
});
