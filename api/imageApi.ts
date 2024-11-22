import { getStorageRef } from "@/firebaseConfig";
import { deleteObject, ref, uploadBytesResumable } from "firebase/storage";
import uuid from "react-native-uuid";

/*
*************************************************

THIS IS TAKEN FROM LECTURE CODE

*************************************************
*/

// upload image to firebase storage folder named images
export const uploadImage = async (uri: string) => {
	const fetchResponse = await fetch(uri);
	const blob = await fetchResponse.blob();

	// uses react-native-uuid for a unique id (name)
	const imagePath = uuid.v4();

	const uploadPath = `images/${imagePath}`;

	const imageRef = getStorageRef(uploadPath);

	try {
		await uploadBytesResumable(imageRef, blob);
		//console.log("Uploading image to", uploadPath);
		return uploadPath;
	} catch (e) {
		//console.error("error uploading image", e);
		return "ERROR";
	}
};
