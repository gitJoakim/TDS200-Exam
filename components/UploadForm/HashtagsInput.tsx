import { Colors } from "@/constants/Colors";
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

	// makes sure inputfield starts with hashtag and only valid input is english alphabet or numbers
	// ** not mine, taken from stack overflow **
	function handleHashtagChange(input: string) {
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

	// remove any "#" from the array
	const removeHashtag = (index: number) => {
		setHashtagsArray((prev) => prev.filter((_, i) => i !== index));
	};

	// render all the hashtags on screen
	const renderHashtagsJSX = () => {
		return hashtagsArray.map((hashtag, index) => (
			<Pressable
				key={index}
				style={styles.hashtag}
				onPress={() => removeHashtag(index)}
				accessibilityLabel={`Remove hashtag ${hashtag}`}
				accessibilityRole="button"
			>
				<Text style={styles.hashtagTextColor}>{hashtag}</Text>
			</Pressable>
		));
	};

	return (
		<View>
			{ /* Hint/tip to user */ }
			<Text
				style={{
					textAlign: "center",
					color: "black",
					marginTop: 6,
				}}
				accessibilityLiveRegion="assertive"
			>
				{hashtagsArray.length === 0
					? "Type a hashtag and press Enter to add it (you can add multiple)"
					: "Tap a hashtag to remove it"}
			</Text>

			{ /* All hashtags user has entered*/ }
			<View style={styles.hashtagsContainer}>{renderHashtagsJSX()}</View>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					width: "100%",
					alignItems: "center",
				}}
			>
				{ /* Hashtags input field */ }
				<Text style={styles.textStyle}>Hashtags</Text>
				<TextInput
					style={[styles.textInput, { color: "blue", flex: 1 }]}
					value={hashtag}
					onChangeText={handleHashtagChange}
					autoCapitalize="none"
					onSubmitEditing={(event) => {
						addHashtag();
						event.preventDefault();
					}}
					 // keeps focus after user has submitted a hashtag
					 // so that u can easily add more
					blurOnSubmit={false}
					accessibilityLabel="Enter a hashtag"
					accessibilityHint="Type a hashtag and press Enter to add it."
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	textInput: {
		borderColor: Colors.ArtVistaRed,
		borderWidth: 1,
		padding: 8,
		marginBottom: 32,
		borderRadius: 8,
		width: "100%",
	},
	hashtagsContainer: {
		gap: 12,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		flexWrap: "wrap",
		marginTop: 4,
	},
	hashtag: {
		backgroundColor: "lightgray",
		padding: 8,
		borderRadius: 8,
	},
	hashtagTextColor: {
		color: "blue",
	},
	textStyle: {
		color: Colors.ArtVistaRed,
		fontSize: 18,
		textAlign: "left",
		width: "100%",
	},
});
