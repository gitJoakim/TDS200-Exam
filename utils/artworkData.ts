import { LocationObjectCoords } from "expo-location";
import { Timestamp } from "firebase/firestore";


// Artwork Interface
export interface ArtworkData {
	id: string; // artwork id
	artist: string; // username of uploader
	userId: string; // id of artist
	title: string;
	description: string;
	imageURL: string;
	hashtags: string[];
	date: Date | Timestamp;
	artworkCoords: LocationObjectCoords | null;
}

// Likes Interface
export interface LikeData {
	artworkId: string;
	userIds: string[];
}

// Comment Interface
export interface Comment {
	commentId: string;
	commentAuthor: string;
	comment: string;
}

// comments interface
export interface CommentData {
	artworkId: string;
	comments: Comment[];
}
