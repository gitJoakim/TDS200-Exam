import { getStorageRef } from "@/firebaseConfig";
import { uploadBytesResumable } from "firebase/storage";
import uuid from "react-native-uuid";

/*
*************************************************

THIS IS TAKEN FROM LECTURE CODE

*************************************************
*/

export const uploadImageToFirebase = async (uri: string) => {
	const fetchResponse = await fetch(uri);
	const blob = await fetchResponse.blob();

	// Use UUID for a unique name
	const imagePath = uuid.v4(); // Generates a unique ID each time

	const uploadPath = `images/${imagePath}`;

	const imageRef = getStorageRef(uploadPath);

	try {
		await uploadBytesResumable(imageRef, blob);
		console.log("Uploading image to", uploadPath);
		return uploadPath;
	} catch (e) {
		console.error("error uploading image", e);
		return "ERROR";
	}
};
