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

	// Create a ref for the Carousel
	const carouselRef = useRef<any>(null);

	// Whenever the artworks data changes, reset the carousel to the start (index 0)
	useEffect(() => {
		if (carouselRef.current) {
			// Scroll to the top (index 0) with animation
			carouselRef.current.scrollTo({ index: 0, animated: true });
		}
	}, [artworks]); // Dependency array ensures the effect runs when artworks changes

	return (
		<View style={styles.mainContainer}>
			<Carousel
				style={styles.carouselStyle}
				ref={carouselRef} // Attach the ref to the Carousel
				loop={false}
				width={width}
				height={height}
				data={artworks}
				vertical={true}
				scrollAnimationDuration={1000} // Smooth scrolling duration
				onSnapToItem={(index) => console.log("current index:", index)} // Log the current index
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
