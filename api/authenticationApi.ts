import { auth } from "@/firebaseConfig";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { createUserInDb } from "./userApi";

//**************************************
// Inspired by lecture code
//**************************************

// sign up / create user
export const signUp = async (
	email: string,
	password: string,
	username: string
) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		await updateProfile(userCredential.user, { displayName: username });
		// we save userdata as a user in db
		await createUserInDb(userCredential.user.uid, username, email);
		//console.log(`Signed up with: username: ${userCredential.user.displayName}, email: ${userCredential.user.email}`);
	} catch (error) {
		throw new Error(handleFirebaseError(error));
	}
};

// log in
export const logIn = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		//console.log("Sign in info: ", userCredential);
	} catch (error) {
		throw new Error(handleFirebaseError(error));
	}
};

// error handling for a smooth user feedback on the login page.
const handleFirebaseError = (error: any) => {
	let errorMessage = "An unexpected error occurred. Please try again.";
	switch (error.code) {
		case "auth/invalid-email":
			errorMessage = "Incorrect login information.";
			break;
		case "auth/user-not-found":
			errorMessage = "Incorrect login information.";
			break;
		case "auth/wrong-password":
			errorMessage = "Incorrect login information.";
			break;
		case "auth/email-already-in-use":
			errorMessage = "This email is already in use.";
			break;
		case "auth/weak-password":
			errorMessage = "Password must be at least 6 characters long.";
			break;
		default:
			errorMessage = error.message || "An unexpected error occurred. Sorry :(";
			break;
	}
	return errorMessage;
};

// log out
export const logOut = async () => {
	await auth.signOut().then(() => {});
};
