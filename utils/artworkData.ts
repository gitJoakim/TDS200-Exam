import { LocationObjectCoords } from "expo-location";

export interface ArtworkData {
	id: string;
	artist: string; // username of uploader
	userId: string;
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
