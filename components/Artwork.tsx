import { ArtworkData } from "@/utils/artworkData";
import { Link } from "expo-router";
import { Pressable, View, Text, Image } from "react-native";

type ArtworkProps = {
	artworkData: ArtworkData;
};
export default function Artwork({ artworkData }: ArtworkProps) {
	return (
		<Pressable
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<View>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Text>{artworkData.artist}</Text>
					<Text>{artworkData.date}</Text>
				</View>
				<Text>{artworkData.title}</Text>
				<Image
					style={{ width: 400, height: 300 }}
					source={{ uri: artworkData.imageURL }}
				/>
				<Text>{artworkData.description}</Text>
				<Text>{artworkData.hashtags}</Text>
			</View>
		</Pressable>
	);
}
