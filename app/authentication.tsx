import { useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import * as authenticationAPI from "@/api/authenticationApi"; // Assuming this API handles sign up
import { Colors } from "@/constants/Colors";

const Authentication = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Log In and Sign Up
	const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

	// Handle Log In
	const handleLogIn = async () => {
		if (!email || !password) {
			setErrorMessage("Please enter both email and password.");
			return;
		}
		try {
			await authenticationAPI.logIn(email, password);
		} catch (error) {
			const errorMessageType = error as Error;
			setErrorMessage(
				errorMessageType.message || "Woops an error occurred, please try again."
			);
		}
	};

	// Handle Sign Up
	const handleSignUp = async () => {
		if (!username.trim() || !email.trim() || !password.trim()) {
			setErrorMessage("Please fill out all fields.");
			return;
		}
		try {
			await authenticationAPI.signUp(email, password, username);
		} catch (error) {
			const errorMessageType = error as Error;
			setErrorMessage(
				errorMessageType.message || "Woops an error occured, please try again."
			);
		}
	};

	// Toggle between Sign Up and Log In forms
	const toggleMode = () => {
		setIsSignUp((prev) => !prev); // Toggle between Log In and Sign Up
		setEmail("");
		setPassword("");
		setUsername(""); // Reset username field when toggling
		setErrorMessage(""); // Clear any previous error message
	};

	/*
	 * --------------------------------------------------------
	 *	Very nice UI design by ChatGPT, altered by me to fit
	 *  the ArtVista Application! I can't take all the credit.
	 * --------------------------------------------------------
	 */

	return (
		<View style={styles.container}>
			<View style={styles.formContainer}>
				<Text style={styles.title}>ArtVista</Text>

				{/* Email Field */}
				<Text>Email</Text>
				<TextInput
					style={styles.input}
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					placeholder="Enter your email"
				/>

				{/* Conditional rendering for Sign Up */}
				{isSignUp && (
					<View>
						<Text>Username</Text>
						<TextInput
							style={styles.input}
							value={username}
							onChangeText={setUsername}
							autoCapitalize="none"
							placeholder="Choose a username"
						/>
					</View>
				)}

				{/* Password Field */}
				<Text>Password</Text>
				<TextInput
					style={styles.input}
					value={password}
					onChangeText={setPassword}
					autoCapitalize="none"
					secureTextEntry
					placeholder="Enter your password"
				/>

				{/* Display error message if there is one */}
				{errorMessage ? (
					<Text style={styles.errorMessage}>{errorMessage}</Text>
				) : null}

				{/* Submit Button */}
				<Pressable
					style={[styles.button, styles.submitButton]}
					onPress={isSignUp ? handleSignUp : handleLogIn}
				>
					<Text style={styles.buttonText}>
						{isSignUp ? "Sign Up" : "Log In"}
					</Text>
				</Pressable>

				{/* Toggle between Log In and Sign Up */}
				<View style={styles.toggleContainer}>
					<Text>
						{isSignUp ? "Already have an account?" : "Don't have an account?"}
					</Text>
					<Pressable onPress={toggleMode}>
						<Text style={styles.toggleText}>
							{isSignUp ? "Log In" : "Sign Up"}
						</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 20,
		backgroundColor: "#f7f7f7",
	},
	title: {
		textAlign: "center",
		fontFamily: "Dancing-Script",
		fontSize: 48,
		color: Colors.ArtVistaRed,
		marginBottom: 40,
	},
	formContainer: {
		width: "100%",
		maxWidth: 400,
		padding: 20,
		backgroundColor: "white",
		borderRadius: 12,
		borderColor: Colors.ArtVistaRed,
		borderWidth: 2,
	},
	input: {
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 12,
		marginBottom: 16,
	},
	button: {
		borderRadius: 5,
		paddingVertical: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	submitButton: {
		backgroundColor: Colors.ArtVistaRed,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	toggleContainer: {
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	toggleText: {
		color: Colors.ArtVistaRed,
		fontWeight: "bold",
	},
	errorMessage: {
		color: Colors.ArtVistaRed,
		fontWeight: "bold",
		marginBottom: 12,
	},
});

export default Authentication;
