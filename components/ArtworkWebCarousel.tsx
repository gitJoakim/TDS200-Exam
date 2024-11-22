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

	// Reset FlatList scroll position when artworks changes
	useEffect(() => {
		if (flatListRef.current) {
			flatListRef.current.scrollToOffset({
				animated: true, 
				offset: 0, 
			});
		}
	}, [artworks]);

	return (
		<View style={styles.mainContainer}>
			<FlatList
				ref={flatListRef} 
				data={artworks}
				renderItem={({ item }) => (
					<ArtworkCarouselItem artwork={item} onLayout={onItemLayout} /> // render as Item artwork component
				)}
				keyExtractor={(item) => item.id} 
				horizontal={false} 
				pagingEnabled={true} 
				showsVerticalScrollIndicator={false} 
				snapToInterval={itemHeight}
				snapToAlignment="start"
				decelerationRate="fast" 
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
