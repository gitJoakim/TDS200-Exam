import { auth } from "@/firebaseConfig";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";

// sign up / create user
export const signUp = async (
	email: string,
	password: string,
	username: string
) => {
	createUserWithEmailAndPassword(auth, email, password)
		.then(async (userCredential) => {
			await updateProfile(userCredential.user, {
				displayName: username,
			});
			console.log(
				`Signed up with: username: ${userCredential.user.displayName}, email: ${userCredential.user.email}`
			);
		})
		.catch((error) => {
			console.log("Error signing up: ", error);
		});
};

// log in
export const logIn = async (email: string, password: string) => {
	await signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			console.log("Sign in info: ", userCredential);
		})
		.catch((error) => {
			console.log("Error logging in: ", error);
		});
};

// log out
export const logOut = async () => {
	await auth.signOut().then(() => {});
};
