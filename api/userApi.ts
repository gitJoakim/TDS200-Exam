import { db, getDownloadUrl } from "@/firebaseConfig";
import { UserData } from "@/utils/userData";
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	getDocs,
	query,
	where,
	collection,
} from "firebase/firestore";
import { uploadImageToFirebase } from "./imageApi";

export const createUserInDb = async (
	userId: string,
	username: string,
	email: string,
	profileImageUrl: string | null = null,
	bio: string = ""
) => {
	try {
		const userProfile: UserData = {
			userId,
			username,
			email,
			profileImageUrl,
			bio,
		};
		const userRef = doc(db, "users", userId);
		await setDoc(userRef, userProfile);
		console.log("User Document written with ID:", userId);
	} catch (error) {
		console.log("Error creating userdocument:", error);
	}
};

export const getUserInfoById = async (userId: string) => {
	try {
		const specificUser = await getDoc(doc(db, "users", userId));
		if (!specificUser.exists()) {
			throw new Error(`Could not find any users with ID: ${userId}`);
		}
		return {
			...specificUser.data(),
			userId: specificUser.id,
		} as UserData;
	} catch (error) {
		console.log("Error fetching userinfo by ID:", error);
		return null;
	}
};

export const getUsersBySearch = async (searchInput: string) => {
	try {
		const endString = searchInput + "\uf8ff";
		const querySnapshot = await getDocs(
			query(
				collection(db, "users"),
				where("username", ">=", searchInput),
				where("username", "<=", endString)
			)
		);
		return querySnapshot.docs.map((doc) => {
			return { ...doc.data(), userId: doc.id } as UserData;
		});
	} catch (error) {
		console.log("Error getting searched users");
		return [];
	}
};

// Update bio function
export const updateUserBio = async (userId: string, newBio: string) => {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			bio: newBio,
		});
		console.log("User bio updated");
	} catch (error) {
		console.log("Error updating bio:", error);
	}
};

// Update profile picture function
export const updateUserProfilePicture = async (
	userId: string,
	newProfilePictureUri: string // Pass the local URI here
) => {
	try {
		const firebaseImagePath = await uploadImageToFirebase(newProfilePictureUri);
		if (firebaseImagePath === "ERROR") {
			console.error("Failed to upload profile picture");
			return;
		}

		const newProfilePictureUrl = await getDownloadUrl(firebaseImagePath);

		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			profileImageUrl: newProfilePictureUrl, // Save the Firebase Storage URL
		});

		console.log("User profile picture updated");
	} catch (error) {
		console.log("Error updating profile picture:", error);
	}
};
