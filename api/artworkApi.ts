import { db, getDownloadUrl } from "@/firebaseConfig";
import {
	ArtworkData,
	Comment,
	CommentData,
	LikeData,
} from "@/utils/artworkData";
import {
	addDoc,
	arrayRemove,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
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
export const createArtwork = async (artwork: ArtworkData) => {
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
		await createLikesData(artworkId);
		await createCommentsData(artworkId);
	} catch (error) {
		console.log("Error adding document:", error);
	}
};

// creates likes collection
export const createLikesData = async (artworkId: string) => {
	try {
		const likesData: LikeData = {
			artworkId,
			userIds: [],
		};
		await addDoc(collection(db, "likes"), likesData);
		console.log("Likes created for artwork:", artworkId);
	} catch (error) {
		console.log("Error creating likes:", error);
	}
};

// creates comments collection
export const createCommentsData = async (artworkId: string) => {
	try {
		const commentData: CommentData = {
			artworkId,
			comments: [],
		};
		await addDoc(collection(db, "comments"), commentData);
		console.log("Successfully created comments for artworkId:", artworkId);
	} catch (error) {
		console.log("Error creating comments:", error);
	}
};

export const addComment = async (artworkId: string, comment: Comment) => {
	try {
		const result = await getDocs(
			query(collection(db, "comments"), where("artworkId", "==", artworkId))
		);

		if (!result.empty) {
			const commentData = result.docs[0].data() as CommentData;

			const newCommentId = doc(collection(db, "comments")).id;

			const commentWithId = { ...comment, commentId: newCommentId };
			const updatedComments = [...commentData.comments, commentWithId];

			const commentDocRef = result.docs[0].ref;

			await updateDoc(commentDocRef, {
				comments: updatedComments,
			});

			console.log("Comment was successfully added!!!! WOOOOO");
		} else {
			console.log("No comments document found for this artworkId:", artworkId);
		}
	} catch (error) {
		console.log("Error adding comment to artworkId:", artworkId);
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

export const getAllArtworksByOrder = async (newest: boolean) => {
	try {
		const result = await getDocs(
			query(
				collection(db, "artworks"),
				orderBy("date", newest ? "desc" : "asc")
			)
		);
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

export const getArtworkByHashtagSearch = async (searchInput: string) => {
	// search requires minimum 2 charcter, so we just return early if its not true
	if (searchInput.length < 2) {
		console.log(
			"Search query is too short. Please enter at least 2 characters."
		);
		return [];
	}
	try {
		const querySnapshot = await getDocs(
			query(
				collection(db, "artworks"),
				where("hashtags", "array-contains", searchInput)
			)
		);
		return querySnapshot.docs.map((doc) => {
			return { ...doc.data(), id: doc.id } as ArtworkData;
		});
	} catch (error) {
		console.log("Error getting posts by hashtag:", error);
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
			return null;
		}
	} catch (error) {
		console.log("Error fetching likes:", error);
		return null;
	}
};

// gets comments
export const getCommentsByArtworkId = async (artworkId: string) => {
	try {
		const result = await getDocs(
			query(collection(db, "comments"), where("artworkId", "==", artworkId))
		);
		if (!result.empty) {
			const commentData = result.docs[0].data();
			const docId = result.docs[0].id;
			return { commentData: commentData as CommentData, docId };
		} else {
			return null;
		}
	} catch (error) {
		console.log("Error fetching comments", error);
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
				updatedUserIds = likesData.likeData.userIds.filter(
					(id) => id !== userId
				);
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
		const artworkToBeDeleted = doc(db, "artworks", id);
		await deleteDoc(artworkToBeDeleted);
		console.log(`Artwork with ID: ${id} has been deleted`);
	} catch (error) {
		console.log(`Error deleting artwork with ID: ${id}, \n ERROR: `, error);
	}
};

export const deleteComment = async (artworkId: string, commentId: string) => {
	try {
		const querySnapshot = await getDocs(
			query(collection(db, "comments"), where("artworkId", "==", artworkId))
		);

		if (!querySnapshot.empty) {
			const docSnap = querySnapshot.docs[0];
			const commentsArray = docSnap.data().comments;
			const commentToRemove = commentsArray.find(
				(comment: { commentId: string }) => comment.commentId === commentId
			);

			if (!commentToRemove) {
				console.log("Comment with ID", commentId, "not found.");
				return null;
			}

			const artworkRef = doc(db, "comments", docSnap.id);
			await updateDoc(artworkRef, {
				comments: arrayRemove(commentToRemove),
			});

			console.log("Successfully deleted comment with ID:", commentId);
			return; // Successfully deleted, no need to return any data
		} else {
			console.log("No matching document found for artworkId:", artworkId);
			return null; // Return null if no matching document found
		}
	} catch (error) {
		console.log("Error deleting comment:", error);
		return null;
	}
};
