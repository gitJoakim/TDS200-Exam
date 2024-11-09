import { db, getDownloadUrl } from "@/firebaseConfig";
import { ArtworkData } from "@/utils/artworkData";
import { addDoc, collection } from "firebase/firestore";
import { uploadImageToFirebase } from "./imageApi";

/*
*************************************************

This is heavily inspired by lecture code

*************************************************
*/


// CREATE
export const addArtwork = async (artwork: ArtworkData) => {
	try {
		const firebaseImage = await uploadImageToFirebase(artwork.imageURL);
		if (firebaseImage === "ERROR") {
			return;
		}
		const artworkImageDownloadUrl = await getDownloadUrl(firebaseImage);
		const artworkWithImageData: ArtworkData = {
			...artwork,
			imageURL: artworkImageDownloadUrl,
		};

		const docRef = await addDoc(
			collection(db, "artworks"),
			artworkWithImageData
		);
		console.log("Document written with ID:", docRef);
	} catch (error) {
		console.log("Error adding document:", error);
	}
};