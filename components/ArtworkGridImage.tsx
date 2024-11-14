import React, { useState, useEffect } from "react";
import { Dimensions, Image, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArtworkData } from "@/utils/artworkData";

interface ArtworkGridImageProps {
	artwork: ArtworkData;
}

export default function ArtworkGridImage({ artwork }: ArtworkGridImageProps) {
	const [imageWidth, setImageWidth] = useState<number>(0);
	const [imageHeight, setImageHeight] = useState<number>(0);
	const router = useRouter();

	// Get the image dimensions and calculate aspect ratio
	useEffect(() => {
		Image.getSize(artwork.imageURL, (width, height) => {
			setImageWidth(width);
			setImageHeight(height);
		});
	}, [artwork.imageURL]);

	function getImageHeight() {
		const aspectRatio = imageWidth / imageHeight;
		const containerWidth = (Dimensions.get("window").width - 24) / 2;
		return containerWidth / aspectRatio;
	}

	// function to handle navigation to artwork details
	function handleImagePress() {
		router.push(`/artworkDetails/${artwork.id}`);
	}

	return (
		// was taught to use Link from expo-router here, but that failed to load the images
		// on iOs and Android (guessing because of the way ive dealt with image sizing)
		// so I´ve restorted to using pressable and handling the router through a function instead.
		<Pressable onPress={handleImagePress} style={styles.container}>
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
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 3,
		paddingHorizontal: 6,
	},
});
