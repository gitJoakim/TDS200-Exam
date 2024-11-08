// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebaseConfig from "./firebaseEnv";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import {
	initializeAuth,
	browserLocalPersistence,
	getReactNativePersistence,
} from "firebase/auth";
import { Platform } from "react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// checking platform and using persistance/async storage based on platform
export const auth = initializeAuth(app, {
	persistence:
		Platform.OS === "web"
			? browserLocalPersistence
			: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

const storage = getStorage(app);

export const getStorageRef = (path) => ref(storage, path);

export const getDownloadUrl = async (path) => {
	const url = await getDownloadURL(ref(storage, path));
	return url;
};
