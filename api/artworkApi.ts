import { db, getDownloadUrl } from "@/firebaseConfig";
import { ArtworkData, LikeData } from "@/utils/artworkData";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
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
		const artworkId = docRef.id;
		await addLikesData(artworkId);
		console.log("Likes created for artwork:", artworkId);
	} catch (error) {
		console.log("Error adding document:", error);
	}
};

// creates likes collection
export const addLikesData = async (artworkId: string) => {
	try {
		const likesData: LikeData = {
			artworkId,
			userIds: [],
		};
		await addDoc(collection(db, "likes"), likesData);
	} catch (error) {
		console.log("Error creating likes:", error);
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

// get likes collection based on artworkId
export const getLikesByArtworkId = async (artworkId: string) => {
	try {
		const result = await getDocs(
			query(collection(db, "likes"), where("artworkId", "==", artworkId))
		);
		if (!result.empty) {
			const likeData = result.docs[0].data();
			const docId = result.docs[0].id;
			return { likeData: likeData as LikeData, docId };
		} else {
			console.log("returning null!!!!!");
			return null;
		}
	} catch (error) {
		console.log("Error fetching likes:", error);
		return null;
	}
};

//**************************************
// UPDATE
//**************************************

export const toggleLike = async (artworkId: string, userId: string) => {
	try {
		const likesData = await getLikesByArtworkId(artworkId); // Fetch likes data for the artwork
		if (likesData) {
			let updatedUserIds;

			// Toggle the like for the user
			if (likesData.likeData.userIds.includes(userId)) {
				updatedUserIds = likesData.likeData.userIds.filter((id) => id !== userId);
			} else {
				updatedUserIds = [...likesData.likeData.userIds, userId];
			}

			// Update the likes in Firestore
			const likeDocRef = doc(db, "likes", likesData.docId);
			await updateDoc(likeDocRef, {
				userIds: updatedUserIds,
			});
		}
	} catch (error) {
		console.error("Error toggling like for userId:", userId);
		console.error("Error toggling like on post:", artworkId);
		console.log(error);
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
