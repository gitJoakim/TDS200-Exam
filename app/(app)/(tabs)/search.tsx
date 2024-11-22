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

	// fetch users by search username input
	async function searchUsernames() {
		setUserData(null);
		const usersResultFromDb = await getUsersBySearch(searchText);
		const artworksFromDb = await artworkAPI.getAllArtworks();
		setUserData(usersResultFromDb);
		setArtworksToCount(artworksFromDb);
		setIsSearching(false);
	}

	// fetches artworks based on hashtag search input
	async function searchHashtags() {
		const resultFromDb = await artworkAPI.getArtworkByHashtagSearch(
			searchText.toLowerCase()
		);

		setArtworks(resultFromDb);
		setIsSearching(false);
	}

	// get all artworks and filter locally (shows that I can do it both through api and locally)
	async function getAllArtworksAndFilter() {
		// fetching all artworks
		const artworks = await artworkAPI.getAllArtworks();

		// Filter artworks by title or description matching the search term
		const filteredArtworks = artworks.filter((artwork) => {
			const searchTerm = searchText.toLowerCase();

			// Check if title or description contains the search term
			const matchesTitle = artwork.title.toLowerCase().includes(searchTerm);
			const matchesDescription = artwork.description
				.toLowerCase()
				.includes(searchTerm);

			return matchesTitle || matchesDescription;
		});

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
				getAllArtworksAndFilter();
				break;
			default:
				break;
		}
	}

	// renders users for username search results
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
	// ** inspired by stack overflow: https://stackoverflow.com/questions/12142829/val-replace-a-za-z-0-9-g-produce-syntaxerror-invalid-range-in-charact
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

	// executes search when search text changes
	useEffect(() => {
		// Delay search execution by 0.8 sec after user stops typing
		const delayDebounce = setTimeout(() => {
			if (searchText.trim() !== "") {
				handleSearch();
			}
		}, 800);
		// clean up
		return () => clearTimeout(delayDebounce);
	}, [searchText]);

	// reset search when user changes type
	useEffect(() => {
		setArtworks(null);
		setUserData(null);
		setSearchText("");
	}, [searchType]);

	// setup header on first launch
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
					accessible={true}
					accessibilityLabel="Search Icon"
				/>
				<TextInput
					style={[
						styles.searchInput,
						searchType === "hashtags" && { color: "blue" },
					]}
					value={searchText}
					onChangeText={handleTextChange}
					placeholder={`Search by ${searchType}...`}
					placeholderTextColor="#888"
					autoCapitalize="none"
					accessible={true}
					accessibilityLabel="Search Input"
					accessibilityHint={`Enter a search query to find ${searchType}...`}
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
					accessible={true}
					accessibilityLabel="Search by title or description"
					accessibilityRole="button"
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
					accessible={true}
					accessibilityLabel="Search by hashtag"
					accessibilityRole="button"
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
					accessible={true}
					accessibilityLabel="Search by username"
					accessibilityRole="button"
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

			{/* Loading spinner */}
			{isSearching && (
				<View style={styles.loadingIndicator}>
					<Text>Searching...</Text>
					{isSearching && <ActivityIndicator />}
				</View>
			)}

			{/* flatlist of profile pictures, usernames and amount of artworks */}
			{searchType === "usernames" && (
				<View>
					{userData && userData.length > 0 ? (
						<FlatList
							data={userData}
							renderItem={renderUsernameSearchResults}
							keyExtractor={(item) => item.userId}
							accessible={true}
						/>
					) : (
						userData !== null && ( // only show "No results" if userData has been set
							<Text
								style={styles.noResultsText}
								accessible={true}
								accessibilityLabel={`No results found for ${searchQuery.trim()}`}
							>
								No results found for "{searchQuery.trim()}".
							</Text>
						)
					)}
				</View>
			)}

			{/* MasonryList for search by Title/Description and Hashtags */}
			<View style={styles.masonryContainer}>
				{artworks && artworks.length > 0 ? (
					<MasonryList
						style={styles.masonryList}
						numColumns={2}
						data={artworks}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<ArtworkImage artwork={item as ArtworkData} />
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
		...(Platform.OS === "web" && {
			marginHorizontal: "25%",
		}),
	},
	searchIcon: {
		marginRight: 8,
	},
	searchTypeContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 10,
		...(Platform.OS === "web" && {
			marginHorizontal: "25%",
		}),
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
