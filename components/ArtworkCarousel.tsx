import Carousel from "react-native-reanimated-carousel";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ArtworkCarouselItem from "./ArtworkCarouselItem";
import { ArtworkData } from "@/utils/artworkData";

type CarouselProps = {
	artworks: ArtworkData[];
};

export default function ArtworkCarousel({ artworks }: CarouselProps) {
	const width = Dimensions.get("screen").width;
	const height = Dimensions.get("screen").height;
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Carousel
				loop
				width={width}
				height={height}
				style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
				}}
				data={artworks}
				vertical={true}
				scrollAnimationDuration={1000}
				onSnapToItem={(index) => console.log("current index:", index)}
				renderItem={({ item }) => <ArtworkCarouselItem artwork={item} />}
			/>
		</View>
	);
}
