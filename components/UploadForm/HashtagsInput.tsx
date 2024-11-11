import React, { useState } from "react";
import { Pressable, View, Text, StyleSheet, TextInput } from "react-native";

type HashtagsInputProps = {
	hashtagsArray: string[];
	setHashtagsArray: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function HashtagsInput({
	hashtagsArray,
	setHashtagsArray,
}: HashtagsInputProps) {
	const [hashtag, setHashtag] = useState<string>("#");

	function handleHashtagChange(input: string) {
		// makes sure inputfield starts with hashtag and only valid input is english alphabet or numbers
		// ** not mine, taken from stack overflow **
		const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, "").replace(/^#/, "");
		setHashtag(`#${sanitizedInput}`);
	}

	// add hashtag to the array
	const addHashtag = () => {
		if (hashtag.trim() && hashtag !== "#") {
			setHashtagsArray((prev) => [...prev, hashtag]);
			setHashtag("#");
		}
	};

	// remove a hashtag from the array
	const removeHashtag = (index: number) => {
		setHashtagsArray((prev) => prev.filter((_, i) => i !== index));
	};

	// render all the hashtags
	const renderHashtagsJSX = () => {
		return hashtagsArray.map((hashtag, index) => (
			<Pressable
				key={index}
				style={styles.hashtag}
				onPress={() => removeHashtag(index)}
			>
				<Text style={styles.hashtagTextColor}>{hashtag}</Text>
			</Pressable>
		));
	};

	return (
		<View>
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
				style={{ flexDirection: "row", width: "100%", alignItems: "center" }}
			>
				<TextInput
					style={[styles.textInput, { color: "blue", flex: 1 }]}
					value={hashtag}
					onChangeText={handleHashtagChange}
					autoCapitalize="none"
					onSubmitEditing={(event) => {
						addHashtag();
						event.preventDefault();
					}}
					blurOnSubmit={false} // keeps focus after user has submitted a hashtag
				/>
			</View>
		</View>
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
		padding: 8,
		borderRadius: 8,
	},
	hashtagTextColor: {
		color: "blue",
	},
});
