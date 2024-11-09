import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

export default function UploadArtworkForm() {
	const [hashtag, setHashtag] = useState<string>("#");
	const [hashtagsArray, setHashtagsArray] = useState<string[]>([]);

	// This function filters the input to allow only alphanumeric characters
	const handleHashtagChange = (input: string) => {
		// Makes sure inputfield starts with hashtag and only valid input is english alphabet or numbers
		// ** Not mine, taken from stack overflow **
		const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, "").replace(/^#/, "");

		setHashtag(`#${sanitizedInput}`);
	};

	// Function to remove hashtag
	function removeHashtag(index: number) {
		setHashtagsArray((prev) => prev.filter((_, i) => i !== index));
	}

	// JSX to render hashtags
	const displayHashtagsJSX = () => {
		return hashtagsArray.map((hashtag: string, index) => (
			<Pressable
				key={index}
				style={styles.hashtagStyle}
				onPress={() => {
					removeHashtag(index);
				}}
			>
				<Text>{hashtag}</Text>
				<Text> x</Text>
			</Pressable>
		));
	};

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
						style={styles.textInput}
						value={hashtag}
						onChangeText={handleHashtagChange} // Use the filtered input handler
						autoCapitalize="none"
					/>
					<Pressable
						onPress={() => {
							if (hashtag.trim() && hashtag !== "#") {
								setHashtagsArray((prev) => [...prev, hashtag]);
								setHashtag("#"); // Reset the input field to only '#'
							}
						}}
						style={{ backgroundColor: "blue", padding: 6 }}
					>
						<Text>Add</Text>
					</Pressable>
				</View>
				<View style={{ gap: 12 }}>{displayHashtagsJSX()}</View>
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
	hashtagStyle: {
		backgroundColor: "grey",
		flexDirection: "row",
	},
});
