import { db } from "@/firebaseConfig";
import { UserData } from "@/utils/userData";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
