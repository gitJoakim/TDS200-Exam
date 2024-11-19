import * as artworkAPI from "@/api/artworkApi";
import { Colors } from "@/constants/Colors";
import { useAuthSession } from "@/providers/AuthContextProvider";
import { Comment, CommentData } from "@/utils/artworkData";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	ScrollView,
	Pressable,
	Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { getUserInfoById } from "@/api/userApi";
import { Link } from "expo-router";
import AlertModal from "./Modals/AlertModal";

type CommentSectionProps = {
	artworkId: string;
};

export default function CommentSection({ artworkId }: CommentSectionProps) {
	const [commentsData, setCommentsData] = useState<CommentData | null>(null);
	const [commentText, setCommentText] = useState("");
	const [usersData, setUsersData] = useState<{ [key: string]: string }>({});
	const { user } = useAuthSession();
	const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const fetchUsersData = async (userIds: string[]) => {
		const usersDataMap: { [key: string]: string } = {};
		for (const userId of userIds) {
			const userInfo = await getUserInfoById(userId);
			usersDataMap[userId] = userInfo!.username;
		}
		setUsersData(usersDataMap);
	};

	function handleDeleteComment() {
		console.log("DELETE!!!");
	}

	async function fetchCommentsData() {
		const commentsDataFromDb = await artworkAPI.getCommentsByArtworkId(
			artworkId
		);
		const comments = commentsDataFromDb?.commentData?.comments || [];
		const userIds = [
			...new Set(comments.map((comment) => comment.commentAuthor)),
		];
		await fetchUsersData(userIds);

		setCommentsData(commentsDataFromDb?.commentData || null);
	}

	async function handlePostComment() {
		if (!commentText.trim()) return; // Prevent posting if comment is empty or only spaces

		setIsSubmitting(true); // Set submitting to true to disable the button
		const comment: Comment = {
			commentId: "",
			commentAuthor: user!.uid,
			comment: commentText,
		};
		await artworkAPI.addComment(artworkId, comment);
		setCommentText(""); // Clear input after posting
		fetchCommentsData(); // Refresh comments

		// Re-enable button after 1 second
		setTimeout(() => {
			setIsSubmitting(false); // Reset isSubmitting after 1 second
		}, 1000);
	}

	useEffect(() => {
		fetchCommentsData();
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
				{commentsData?.comments.length! > 0 ? (
					commentsData?.comments.map((comment) => {
						const username = usersData[comment.commentAuthor];
						return (
							<View key={comment.commentId} style={styles.commentContainer}>
								<View style={styles.comment}>
									<Link
										href={{
											pathname: "/userProfile/[id]",
											params: { id: comment.commentAuthor },
										}}
									>
										<Text style={styles.commentAuthor}>
											{username ? username : comment.commentAuthor}
										</Text>
									</Link>
									<View style={styles.commentContent}>
										<Text style={styles.commentText}>{comment.comment}</Text>
									</View>
									{/* Trash icon positioned at the bottom right */}
									{user!.uid === comment.commentAuthor && (
										<Pressable
											style={styles.deleteButton}
											onPress={() => {
												setIsDeleteModalOpen(true);
											}}
										>
											<Feather
												name="trash-2"
												size={24}
												color={Colors.ArtVistaRed}
											/>
										</Pressable>
									)}
								</View>
							</View>
						);
					})
				) : (
					<View style={styles.commentContent}>
						<Text style={[styles.commentText, { textAlign: "center" }]}>
							Couldn't find any comments...
						</Text>
					</View>
				)}
			</ScrollView>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.textInput}
					value={commentText}
					onChangeText={setCommentText}
					placeholder="Write a comment..."
					maxLength={200}
				/>
				<Pressable
					style={[styles.addButton]} // Apply disabled style if submitting or text is empty
					onPress={handlePostComment}
					disabled={isSubmitting || !commentText.trim()} // Disable button if submitting or text is empty
				>
					<Text style={styles.addButtonText}>Post</Text>
				</Pressable>
			</View>
			<Modal visible={isDeleteModalOpen}>
				<AlertModal
					prompt="Are you sure you want to delete your comment?"
					optionYes="Delete"
					optionNo="Cancel"
					onConfirm={handleDeleteComment}
					onCancel={() => {
						setIsDeleteModalOpen(false);
					}}
				/>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	scrollContainer: {
		width: "100%",
		height: "auto",
		minHeight: 100,
		maxHeight: 200,
		borderWidth: 1,
		borderColor: Colors.ArtVistaRed,
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
		marginVertical: 12,
		backgroundColor: "white",
	},
	commentContainer: {
		width: "100%",
	},
	comment: {
		marginBottom: 12,
		backgroundColor: "#ccc",
		borderRadius: 6,
		padding: 12,
		width: "100%",
		position: "relative", // Set position relative so the trash icon can be positioned absolutely
	},
	commentAuthor: {
		fontWeight: "bold",
		marginBottom: 2,
	},
	commentContent: {
		flexDirection: "column", // Stack the text vertically
		justifyContent: "flex-start",
	},
	commentText: {
		fontSize: 14,
		marginRight: 28,
	},
	deleteButton: {
		position: "absolute", // Position it absolutely within the comment container
		bottom: 14, // 6 units from the bottom
		right: 6, // 6 units from the right
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		width: "100%",
	},
	textInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: Colors.ArtVistaRed,
		borderRadius: 8,
		padding: 8,
		marginRight: 8,
		backgroundColor: "white",
	},
	addButton: {
		backgroundColor: Colors.ArtVistaRed,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 14,
	},
	addButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});
