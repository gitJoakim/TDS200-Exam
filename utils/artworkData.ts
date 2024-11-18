import { LocationObjectCoords } from "expo-location";

export interface ArtworkData {
	id: string; // artwork id
	artist: string; // username of uploader
	userId: string; // id of artist
	title: string;
	description: string;
	imageURL: string;
	hashtags: string[];
	date: string;
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
