import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.ArtVistaRed,
				headerShown: true,
				tabBarHideOnKeyboard: true,
				headerTitleAlign: "center",
			}}
		>
			<Tabs.Screen
				name="personalProfile"
				options={{
					title: "Your Profile",
					tabBarIcon: ({ focused }) => (
						<Feather
							name="user"
							size={24}
							color={focused ? Colors.ArtVistaRed : "#707070"}
							accessibilityLabel="Profile"
							accessibilityHint="Go to your profile"
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="artworkMap"
				options={{
					title: "Map of Artworks",
					tabBarIcon: ({ focused }) => (
						<FontAwesome6
							name="map-location-dot"
							size={24}
							color={focused ? Colors.ArtVistaRed : "#707070"}
							accessibilityLabel="Map of artworks"
							accessibilityHint="View the map of artworks"
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							name={focused ? "home" : "home-outline"}
							color={focused ? Colors.ArtVistaRed : "#707070"}
							accessibilityLabel="Home"
							accessibilityHint="Navigate to the home screen"
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ focused }) => (
						<Feather
							name="search"
							size={24}
							color={focused ? Colors.ArtVistaRed : "#707070"}
							accessibilityLabel="Search"
							accessibilityHint="Search for artworks or usersnames"
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="upload"
				options={{
					title: "Upload",
					tabBarIcon: ({ focused }) => (
						<Feather
							name="plus-square"
							size={24}
							color={focused ? Colors.ArtVistaRed : "#707070"}
							accessibilityLabel="Upload"
							accessibilityHint="Upload a new artwork"
						/>
					),
				}}
			/>
		</Tabs>
	);
}
