import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import * as authenticationAPI from "@/api/authenticationApi"; // Assuming this API handles sign up
import { useAuthSession } from "@/providers/AuthContextProvider";

const Authentication = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { user } = useAuthSession();

	const handleSignUp = () => {
		if (!username.trim()) {
			alert("Please set a valid username.");
			return;
		}

		// Proceed with sign-up process
		authenticationAPI.signUp(email, password, username);
		console.log("User signed up");
	};

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
			<Text
				style={{
					fontFamily: "Dancing-Script",
					fontSize: 48,
					color: "#DC143C",
				}}
			>
				ArtVista
			</Text>
			<View style={{ width: 200 }}>
				<Text>Email</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
				/>
				<Text>Username</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
					value={username}
					onChangeText={setUsername}
					autoCapitalize="none"
				/>
				<Text>Password</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
					value={password}
					onChangeText={setPassword}
					autoCapitalize="none"
				/>
				<View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
					<Pressable
						style={{ borderColor: "black", borderWidth: 2, width: 60 }}
						onPress={() => {
							authenticationAPI.logIn(email, password);
						}}
					>
						<Text>Log in</Text>
					</Pressable>
					<Pressable
						style={{ borderColor: "black", borderWidth: 2, width: 60 }}
						onPress={handleSignUp} // Use the validation function for sign-up
					>
						<Text>Sign up</Text>
					</Pressable>
				</View>

				<Pressable
					onPress={() => {
						authenticationAPI.logOut();
					}}
				>
					<Text>Log Out</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default Authentication;
