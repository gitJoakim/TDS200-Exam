import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import * as authenticationAPI from "@/api/authenticationApi";
import { useAuthSession } from "@/providers/AuthContextProvider";

const Authentication = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { userNameSession } = useAuthSession();

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
				></TextInput>
				<Text>Username</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
					value={username}
					onChangeText={setUsername}
					autoCapitalize="none"
				></TextInput>
				<Text>Passowrd</Text>
				<TextInput
					style={{ borderColor: "black", borderWidth: 2, marginBottom: 16 }}
					value={password}
					onChangeText={setPassword}
					autoCapitalize="none"
				></TextInput>
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
						onPress={() => {
							authenticationAPI.signUp(email, password, username);
							console.log("lol");
						}}
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
