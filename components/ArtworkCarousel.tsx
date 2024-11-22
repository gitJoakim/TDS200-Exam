import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ArtworkCarouselItem from "./ArtworkCarouselItem";
import { ArtworkData } from "@/utils/artworkData";

type CarouselProps = {
	artworks: ArtworkData[];
};

export default function ArtworkCarousel({ artworks }: CarouselProps) {
	const width = Dimensions.get("screen").width;
	const height = Dimensions.get("screen").height;
	const carouselRef = useRef<any>(null);

	// Whenever the artworks data changes, reset the carousel to the start (index 0)
	useEffect(() => {
		if (carouselRef.current) {
			carouselRef.current.scrollTo({ index: 0, animated: true });
		}
	}, [artworks])

	return (
		<View style={styles.mainContainer}>
			<Carousel
				style={styles.carouselStyle}
				ref={carouselRef}
				loop={false}
				width={width}
				height={height}
				data={artworks}
				vertical={true}
				scrollAnimationDuration={1000} // smooooooooooooothes out scrolling duration
				onSnapToItem={(index) => {}}
				renderItem={({ item }) => <ArtworkCarouselItem artwork={item} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	carouselStyle: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
