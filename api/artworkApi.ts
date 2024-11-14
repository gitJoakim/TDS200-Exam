import { db, getDownloadUrl } from "@/firebaseConfig";
import { ArtworkData } from "@/utils/artworkData";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { uploadImageToFirebase } from "./imageApi";

/*
*************************************************

This is heavily inspired by lecture code

*************************************************
*/

//**************************************
// CREATE
//**************************************

// create an artwork
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

//**************************************
// READ
//**************************************

// get all artwork posts
export const getAllArtworks = async () => {
	try {
		const result = await getDocs(collection(db, "artworks"));
		return result.docs.map((doc) => {
			return { ...doc.data(), id: doc.id } as ArtworkData; // replaces artwork id (which we set to null on creation) with its id from firebase
		});
	} catch (error) {
		console.log("Error fetching all posts:", error);
		return [];
	}
};

// get single artwork based on its id
export const getArtworkById = async (id: string) => {
	try {
		const specificArtwork = await getDoc(doc(db, "artworks", id));
		if (!specificArtwork.exists()) {
			throw new Error(`Could not find any artwork with this ID: ${id}`);
		}
		console.log("Artwork by specific ID:", specificArtwork.data());

		return {
			...specificArtwork.data(),
			id: specificArtwork.id,
		} as ArtworkData;
	} catch (error) {
		console.log("Error fetching artwork by ID:", error);
		return null;
	}
};

export const getArtworksByUserId = async (userId: string) => {
	try {
		const result = await getDocs(
			query(collection(db, "artworks"), where("userId", "==", userId))
		);
		return result.docs.map((doc) => {
			return { ...doc.data(), id: doc.id } as ArtworkData;
		});
	} catch (error) {
		console.log("Error fetching artworks by user id:", error);
		return [];
	}
};

//**************************************
// DELETE
//**************************************

export const deleteArtwork = async (id: string) => {
	try {
		const artworkToBeDeleted = doc(db, "posts", id);
		await deleteDoc(artworkToBeDeleted);
		console.log(`Artwork with ID: ${id} has been deleted`);
	} catch (error) {
		console.log(`Error deleting artwork with ID: ${id}, \n ERROR: `, error);
	}
};
