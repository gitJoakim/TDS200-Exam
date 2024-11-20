import React, { useEffect, useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	Text,
	TouchableOpacity,
	Pressable,
	FlatList,
	Platform,
	ActivityIndicator,
} from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import { Colors } from "@/constants/Colors";
import ArtworkImage from "@/components/ArtworkGridImage";
import Feather from "@expo/vector-icons/Feather";
import { ArtworkData } from "@/utils/artworkData";
import UsernameSearchItem from "@/components/search/usernameSearchItem";
import { UserData } from "@/utils/userData";
import { getUsersBySearch } from "@/api/userApi";
import * as artworkAPI from "@/api/artworkApi";
import { useNavigation } from "expo-router";

export default function Search() {
	const [searchText, setSearchText] = useState("");
	const [searchType, setSearchType] = useState("title or description");
	const [searchQuery, setSearchQuery] = useState("");
	const [artworks, setArtworks] = useState<ArtworkData[] | null>(null);
	const [artworksToCount, setArtworksToCount] = useState<ArtworkData[] | null>(
		null
	);
	const [isSearching, setIsSearching] = useState(false);
	const [userData, setUserData] = useState<UserData[] | null>(null);
	const handleSearchTypeChange = (type: string) => {
		setSearchType(type);
	};
	const navigation = useNavigation();

	async function searchUsernames() {
		setUserData(null);
		// Fetch users based on search text
		const usersResultFromDb = await getUsersBySearch(searchText);

		// Fetch all artworks from the database
		const artworksFromDb = await artworkAPI.getAllArtworks();

		setUserData(usersResultFromDb); // Set users without artworksCount for now
		setArtworksToCount(artworksFromDb); // Set all artworks
		setIsSearching(false);
	}

	async function searchHashtags() {
		const resultFromDb = await artworkAPI.getArtworkByHashtagSearch(
			searchText.toLowerCase()
		);
		setArtworks(resultFromDb);
		setIsSearching(false);
	}

	async function searchTitleOrDescription() {
		await getAllArtworksAndFilter();
	}

	async function getAllArtworksAndFilter() {
		const artworks = await artworkAPI.getAllArtworks();
		// Filter artworks by title or description matching the search term
		const filteredArtworks = artworks.filter((artwork) => {
			const searchTerm = searchText.toLowerCase(); // Assuming searchText is your search input

			// Check if title or description contains the search term
			const matchesTitle = artwork.title.toLowerCase().includes(searchTerm);
			const matchesDescription = artwork.description
				? artwork.description.toLowerCase().includes(searchTerm)
				: false; // Ensure description exists before checking

			return matchesTitle || matchesDescription; // Return artwork if either matches
		});

		// Set the filtered artworks state
		setArtworks(filteredArtworks);
		setIsSearching(false);
	}

	// Handle search based on search type
	function handleSearch() {
		setIsSearching(true);
		setSearchQuery(searchText);
		switch (searchType) {
			case "usernames":
				searchUsernames();
				break;
			case "hashtags":
				searchHashtags();
				break;
			case "title or description":
				searchTitleOrDescription();
				break;
			default:
				break;
		}
	}

	const renderUsernameSearchResults = ({ item }: { item: UserData }) => {
		// Dynamically calculate artworksCount
		const numberOfArtworks =
			artworksToCount?.filter((artwork) => artwork.userId === item.userId)
				.length ?? 0;

		return (
			<UsernameSearchItem userData={item} numberOfArtworks={numberOfArtworks} />
		);
	};

	// makes sure inputfield starts with hashtag and only valid input is english alphabet or numbers
	// ** not mine, taken from stack overflow **
	const handleTextChange = (text: string) => {
		if (searchType === "hashtags") {
			const filteredText = text.replace(/[^a-zA-Z#]/g, "");
			if (filteredText[0] !== "#") {
				setSearchText("#" + filteredText);
			} else {
				setSearchText(filteredText);
			}
		} else {
			setSearchText(text);
		}
	};

	useEffect(() => {
		// Delay search execution by 0.8 sec after user stops typing
		const delayDebounce = setTimeout(() => {
			if (searchText.trim() !== "") {
				handleSearch();
			}
		}, 800);

		return () => clearTimeout(delayDebounce);
	}, [searchText]);

	useEffect(() => {
		setArtworks(null);
		setUserData(null);
		setSearchText("");
	}, [searchType]);

	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				borderBottomWidth: 1,
				borderBottomColor: Colors.ArtVistaRed,
			},
		});
	}, []);

	return (
		<View style={styles.container}>
			{/* Search Field */}
			<View style={styles.searchContainer}>
				<Feather
					name="search"
					size={20}
					color={Colors.ArtVistaRed}
					style={styles.searchIcon}
				/>
				<TextInput
					style={[
						styles.searchInput,
						searchType === "hashtags" && { color: "blue" },
					]}
					value={searchText}
					onChangeText={handleTextChange} // Update based on searchType
					placeholder={`Search by ${searchType}...`}
					placeholderTextColor="#888"
					autoCapitalize="none"
				/>
			</View>

			{/* Search Type Selector */}
			<View style={styles.searchTypeContainer}>
				<TouchableOpacity
					style={[
						styles.searchTypeButton,
						searchType === "title or description" && styles.activeButton,
					]}
					onPress={() => handleSearchTypeChange("title or description")}
				>
					<Text
						style={[
							styles.searchTypeText,
							searchType === "title or description" && styles.activeText,
						]}
					>
						Title / Description
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.searchTypeButton,
						searchType === "hashtags" && styles.activeButton,
					]}
					onPress={() => handleSearchTypeChange("hashtags")}
				>
					<Text
						style={[
							styles.searchTypeText,
							searchType === "hashtags" && styles.activeText,
						]}
					>
						Hashtag
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.searchTypeButton,
						searchType === "usernames" && styles.activeButton,
					]}
					onPress={() => handleSearchTypeChange("usernames")}
				>
					<Text
						style={[
							styles.searchTypeText,
							searchType === "usernames" && styles.activeText,
						]}
					>
						Username
					</Text>
				</TouchableOpacity>
			</View>

			{isSearching && (
				<View style={styles.loadingIndicator}>
					<Text>Searching...</Text>
					{isSearching && <ActivityIndicator />}
				</View>
			)}

			{searchType === "usernames" && (
				<View>
					{userData && userData.length > 0 ? (
						<FlatList
							data={userData} // Array of UserData objects
							renderItem={renderUsernameSearchResults} // For each item, render UsernameSearchItem
							keyExtractor={(item) => item.userId} // Assuming userId is unique
						/>
					) : (
						userData !== null && ( // Only show "No results" if userData has been set
							<Text style={styles.noResultsText}>
								No results found for "{searchQuery.trim()}".
							</Text>
						)
					)}
				</View>
			)}
			<View style={styles.masonryContainer}>
				{/* Masonry List */}
				{artworks && artworks.length > 0 ? (
					<MasonryList
						style={styles.masonryList}
						numColumns={2}
						data={artworks}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<ArtworkImage artwork={item as ArtworkData} /> // Replace with your artwork display component
						)}
					/>
				) : (
					artworks !== null && (
						<Text style={styles.noResultsText}>
							No results found for "{searchQuery.trim()}".
						</Text>
					)
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		paddingVertical: 16,
		paddingHorizontal: 16,
		...(Platform.OS === "web" && {
			marginHorizontal: "25%",
		}),
	},
	masonryContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	searchInput: {
		height: 40,
		paddingHorizontal: 10,
		backgroundColor: "white",
		flex: 1,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: Colors.ArtVistaRed,
		borderWidth: 2,
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: "white",
		marginBottom: 10,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchTypeContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 10,
	},
	searchTypeButton: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	activeButton: {
		backgroundColor: Colors.ArtVistaRed,
	},
	searchTypeText: {
		fontSize: 14,
		color: Colors.ArtVistaRed,
	},
	activeText: {
		color: "white",
	},
	masonryList: {
		marginVertical: 6,
	},
	noResultsText: {
		fontSize: 16,
		color: "#888",
		textAlign: "center",
		marginTop: 20,
	},
	loadingIndicator: {
		marginTop: 24,
		flex: 1,
		alignItems: "center",
	},
});
