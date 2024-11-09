import { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

export default function UploadArtworkForm() {
	const [hashtag, setHashtag] = useState<string>("#");
	const [hashtagsArray, setHashtagsArray] = useState<string[]>([]);

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
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<View style={{ width: "60%" }}>
				<Text>Title</Text>
				<TextInput style={styles.textInput} />

				<Text>Description</Text>
				<TextInput style={styles.textInput} />

				<Text>Hashtags</Text>
				<View style={{ flexDirection: "row" }}>
					<TextInput
						style={[styles.textInput, { color: "blue" }]}
						value={hashtag}
						onChangeText={handleHashtagChange} // Use the filtered input handler
						autoCapitalize="none"
					/>
					<Pressable
						onPress={addHashtag}
						style={{ backgroundColor: "blue", padding: 6 }}
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
		</View>
	);
}

const styles = StyleSheet.create({
	textInput: {
		width: "100%",
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
