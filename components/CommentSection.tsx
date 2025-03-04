import * as artworkAPI from "@/api/artworkApi";
import { Colors } from "@/constants/Colors";
import { useAuthSession } from "@/providers/AuthContextProvider";
import { ArtworkData, Comment, CommentData } from "@/utils/artworkData";
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
	const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

	// fetch users data
	const fetchUsersData = async (userIds: string[]) => {
		const usersDataMap: { [key: string]: string } = {};
		for (const userId of userIds) {
			const userInfo = await getUserInfoById(userId);
			usersDataMap[userId] = userInfo!.username;
		}
		setUsersData(usersDataMap);
	};

	// function to delete comment
	async function handleDeleteComment() {
		await artworkAPI.deleteComment(artworkId, commentToDelete!);
		fetchCommentsData();
	}

	// fetches comment data based on artworkId
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

	// post comment function
	async function handlePostComment() {
		// Prevent posting if comment is empty or only spaces
		if (!commentText.trim()) return; 

		setIsSubmitting(true); 
		const comment: Comment = {
			commentId: "",
			commentAuthor: user!.uid,
			comment: commentText,
		};
		await artworkAPI.addComment(artworkId, comment);
		setCommentText("");
		fetchCommentsData();

		// Re-enable button after 1 second
		setTimeout(() => {
			setIsSubmitting(false);
		}, 1000);
	}

	// fetches comments on init
	useEffect(() => {
		fetchCommentsData();
	}, []);

	return (
		<View style={styles.container}>
			{ /* Comments counter */ }
			<Text style={styles.commentsCounter} accessibilityRole="text">
				Comments: {commentsData?.comments.length}
			</Text>

			{/* Comments scrollview */ }
			<ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
				{commentsData?.comments.length! > 0 ? (
					commentsData?.comments.map((comment) => {
						const username = usersData[comment.commentAuthor];
						return (
							<View key={comment.commentId} style={styles.commentContainer}>
								<View style={styles.comment}>

									{ /* Links to comment author */}
									<Link
										href={{
											pathname: "/userProfile/[id]",
											params: { id: comment.commentAuthor },
										}}
									>
										<Text
											style={styles.commentAuthor}
											accessibilityRole="link"
											accessibilityLabel={`Go to profile of ${
												username || comment.commentAuthor
											}`}
										>
											{username ? username : comment.commentAuthor}
										</Text>
									</Link>

									{/* Comment */ }
									<View style={styles.commentContent}>
										<Text style={styles.commentText}>{comment.comment}</Text>
									</View>

									{/* Trash icon if user has posted the comments */}
									{user!.uid === comment.commentAuthor && (
										<Pressable
											style={styles.deleteButton}
											onPress={() => {
												setCommentToDelete(comment.commentId);
												setIsDeleteModalOpen(true);
											}}
											accessible={true}
											accessibilityLabel="Delete this comment"
											accessibilityHint="Deletes your comment from this artwork's comment section"
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
					// no comments text
					<View style={styles.commentContent}>
						<Text style={[styles.commentText, { textAlign: "center" }]}>
							Couldn't find any comments...
						</Text>
					</View>
				)}
			</ScrollView>

{ /* Comment input and post button */ }
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.textInput}
					value={commentText}
					onChangeText={setCommentText}
					placeholder="Write a comment..."
					maxLength={200}
					autoCapitalize="none"
				/>
				<Pressable
					style={[styles.addButton]}
					onPress={handlePostComment}
					// disable button if submitting or text is empty
					disabled={isSubmitting || !commentText.trim()} 
				>
					<Text style={styles.addButtonText}>Post</Text>
				</Pressable>
			</View>

			{ /* Delete are u sure modal */ }
			<Modal visible={isDeleteModalOpen}>
				<AlertModal
					prompt="Are you sure you want to delete your comment?"
					optionYes="Delete"
					optionNo="Cancel"
					onConfirm={() => {
						if (commentToDelete) {
							handleDeleteComment();
						}
						setIsDeleteModalOpen(false);
					}}
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
		marginBottom: 24,
		marginTop: 16,
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
		marginBottom: 12,
		backgroundColor: "white",
	},
	commentContainer: {
		width: "100%",
	},
	commentsCounter: {
		color: Colors.ArtVistaRed,
		fontSize: 16,
	},
	comment: {
		marginBottom: 12,
		backgroundColor: "#D3D3D3",
		borderRadius: 6,
		padding: 12,
		width: "100%",
		position: "relative", 
	},
	commentAuthor: {
		fontWeight: "bold",
		marginBottom: 2,
	},
	commentContent: {
		flexDirection: "column", 
		justifyContent: "flex-start",
	},
	commentText: {
		fontSize: 14,
		marginRight: 28,
	},
	deleteButton: {
		position: "absolute",
		bottom: 14, 
		right: 6,
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
		paddingVertical: 10,
	},
	addButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});
