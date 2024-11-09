import { useEffect, useState, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Pressable,
	Image,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Platform } from "react-native";
import { useAuthSession } from "@/providers/AuthContextProvider";
import ImageModal from "./Modals/GalleryModal";
import CameraModal from "./Modals/CameraModal";

export default function UploadArtworkForm() {
	const [hashtag, setHashtag] = useState<string>("#");
	const [hashtagsArray, setHashtagsArray] = useState<string[]>([]);
	const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
	const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
	const [image, setImage] = useState<string | null>(null);

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
					<TextInput style={styles.textInput} />

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
									style={{ resizeMode: "contain", width: "100%", height: 300 }}
									alt="Image of spot"
								/>
							) : (
								<Text
									style={{
										textAlign: "center",
										fontSize: 32,
										fontWeight: "bold",
									}}
								>
									Add an image of the spot
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
					<TextInput style={styles.textInput} />

					<Text>Hashtags</Text>
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
							onSubmitEditing={addHashtag}
						/>
						<Pressable
							onPress={addHashtag}
							style={{
								backgroundColor: "blue",
								padding: 6,
								alignSelf: "stretch",
							}}
						>
							<Text>Add</Text>
						</Pressable>
					</View>

					<Text
						style={{
							textAlign: "center",
							color: "gray",
							marginVertical: 6,
							opacity: hashtagsArray.length === 0 ? 0 : 1,
						}}
					>
						Tap a hashtag to remove it
					</Text>

					<View style={styles.hashtagsContainer}>{renderHashtagsJSX()}</View>
				</View>
			</ScrollView>

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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	textInput: {
		borderColor: "black",
		borderWidth: 2,
		padding: 6,
		marginBottom: 32,
	},
	hashtagsContainer: {
		gap: 12,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		flexWrap: "wrap",
	},
	hashtag: {
		backgroundColor: "lightgray",
	},
	hashtagTextColor: {
		color: "blue",
	},
});
