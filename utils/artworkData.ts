import { LocationObjectCoords } from "expo-location";
import { Timestamp } from "firebase/firestore";

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

export interface LikeData {
	artworkId: string;
	userIds: string[];
}

export interface Comment {
	commentId: string;
	commentAuthor: string;
	comment: string;
}

export interface CommentData {
	artworkId: string;
	comments: Comment[];
}
