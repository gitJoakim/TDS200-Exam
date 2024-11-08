import { View, Text, TextInput, StyleSheet } from "react-native";

export default function UploadArtworkForm() {
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<View style={{ width: "60%" }}>
				<Text>Title</Text>
				<TextInput style={styles.textInput}></TextInput>

				<Text>Description</Text>
				<TextInput style={styles.textInput}></TextInput>

				<Text>Hashtags</Text>
				<TextInput style={styles.textInput}></TextInput>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	textInput: {
		borderColor: "black",
		borderWidth: 2,
		padding: 6,
		marginBottom: 32,
	},
});
