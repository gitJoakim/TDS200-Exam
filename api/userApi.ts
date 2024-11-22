import { db, getDownloadUrl } from "@/firebaseConfig";
import { UserData } from "@/utils/userData";
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	getDocs,
	collection,
} from "firebase/firestore";
import { uploadImage } from "./imageApi";

//**************************************
// CREATE
//**************************************
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
		//console.log("User Document written with ID:", userId);
	} catch (error) {
		//console.log("Error creating userdocument:", error);
	}
};

//**************************************
// READ
//**************************************

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
		//console.log("Error fetching userinfo by ID:", error);
		return null;
	}
};

export const getUsersBySearch = async (searchInput: string) => {
	try {
		const querySnapshot = await getDocs(collection(db, "users"));

		// Filter users locally by checking if the lowercase username matches the search input
		const filteredUsers = querySnapshot.docs
			.map((doc) => {
				return { ...doc.data(), userId: doc.id } as UserData;
			})
			.filter(
				(user) =>
					user.username &&
					user.username.toLowerCase().includes(searchInput.toLowerCase())
			);

		return filteredUsers;
	} catch (error) {
		//console.log("Error getting searched users");
		return [];
	}
};

//**************************************
// UPDATE
//**************************************

// Update user profile bio
export const updateUserBio = async (userId: string, newBio: string) => {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			bio: newBio,
		});
		//console.log("User bio updated");
	} catch (error) {
		//console.log("Error updating bio:", error);
	}
};

// Update profile picture
export const updateUserProfilePicture = async (
	userId: string,
	newProfilePictureUri: string
) => {
	try {
		const firebaseImagePath = await uploadImage(newProfilePictureUri); // upload image from imageApi.ts
		if (firebaseImagePath === "ERROR") {
			//console.error("Failed to upload profile picture");
			return;
		}

		const newProfilePictureUrl = await getDownloadUrl(firebaseImagePath);

		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			profileImageUrl: newProfilePictureUrl,
		});

		//console.log("User profile picture updated");
	} catch (error) {
		//console.log("Error updating profile picture:", error);
	}
};
