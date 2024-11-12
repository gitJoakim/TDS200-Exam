import React, { useState, useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { ArtworkData } from "@/utils/artworkData";

interface ArtworkGridImageProps {
	artwork: ArtworkData;
}

export default function ArtworkGridImage({ artwork }: ArtworkGridImageProps) {
	/***************************************************************************************
	 *  There might(probably is) a better way of doing this haha, but I was struggling to  *
	 *  get the masonry list to display nicely with images being so different in sizes     *
	 *  So this was my solution, I think it works well, but far from optimal.              *
	 ***************************************************************************************/

	const [imageWidth, setImageWidth] = useState<number>(0);
	const [imageHeight, setImageHeight] = useState<number>(0);

	// This function gets the image dimensions and calculates its aspect ratio
	useEffect(() => {
		Image.getSize(artwork.imageURL, (width, height) => {
			setImageWidth(width);
			setImageHeight(height);
		});
	}, [artwork.imageURL]);

	// Calculates the image height based on the aspect ratio
	const getImageHeight = () => {
		const aspectRatio = imageWidth / imageHeight;
		const containerWidth = (Dimensions.get("window").width - 24) / 2;
		return containerWidth / aspectRatio;
	};

	return (
		<View style={styles.container}>
			{imageWidth && imageHeight ? (
				<Image
					source={{ uri: artwork.imageURL }}
					style={{
						width: "100%",
						height: getImageHeight(),
					}}
					resizeMode="contain"
				/>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 3,
		paddingHorizontal: 6,
	},
});
