import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const Authentication = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
				width: "100%",
			}}
		>
			<Text>ArtVista</Text>
			<View style={{ width: 200 }}>
				<Text>Email</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
				></TextInput>
				<Text>Username</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
				></TextInput>
				<Text>Passowrd</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
				></TextInput>
				<View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
					<Pressable
						style={{ borderColor: "black", borderWidth: 2, width: 60 }}
					>
						<Text>Log in</Text>
					</Pressable>
					<Pressable
						style={{ borderColor: "black", borderWidth: 2, width: 60 }}
					>
						<Text>Sign up</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

export default Authentication;
