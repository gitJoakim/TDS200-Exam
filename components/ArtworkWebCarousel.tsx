import { ArtworkData } from "@/utils/artworkData";
import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import ArtworkCarouselItem from "./ArtworkCarouselItem";
import React, { useState, useRef, useEffect } from "react";

type ArtworkWebCarouselProps = {
	artworks: ArtworkData[];
};

export default function ArtworkWebCarousel({
	artworks,
}: ArtworkWebCarouselProps) {
	const { height } = Dimensions.get("window"); // Get window height for proper snapping
	const [itemHeight, setItemHeight] = useState<number>(height); // Dynamically set the height for each item
	const flatListRef = useRef<FlatList>(null); // Create a ref for FlatList

	// Dynamically get the height of the child element (the artwork item)
	const onItemLayout = (e: any) => {
		const layoutHeight = e.nativeEvent.layout.height;
		setItemHeight(layoutHeight); // Set item height
	};

	// Reset FlatList scroll position when artworks prop changes
	useEffect(() => {
		// Reset scroll position to top with a smooth animation when the data changes
		if (flatListRef.current) {
			flatListRef.current.scrollToOffset({
				animated: true, // Enable smooth scrolling
				offset: 0, // Scroll to the top
			});
		}
	}, [artworks]); // Dependency array ensures it runs when artworks prop changes

	return (
		<View style={styles.mainContainer}>
			{/* FlatList */}
			<FlatList
				ref={flatListRef} // Attach the ref to FlatList
				data={artworks}
				renderItem={({ item }) => (
					<ArtworkCarouselItem artwork={item} onLayout={onItemLayout} />
				)}
				keyExtractor={(item) => item.id} // Ensure unique key for each item
				horizontal={false} // Enable vertical scrolling
				pagingEnabled={true} // Disable default paging (we handle snapping ourselves)
				showsVerticalScrollIndicator={false} // Hide scroll indicator
				snapToInterval={itemHeight} // Snapping interval based on item height
				snapToAlignment="start" // Ensure snap is at the top of the item
				decelerationRate="fast" // Smooth scrolling
				getItemLayout={(data, index) => ({
					length: itemHeight,
					offset: itemHeight * index,
					index,
				})}
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
});
