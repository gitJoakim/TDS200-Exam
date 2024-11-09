export interface ArtworkData {
	id: string | null;
	artist: string; // username of uploader
	title: string;
	description: string;
	imageURL: string;
	hashtags: string[];
	date: string;
}
