import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "blue",
				headerShown: false,
				tabBarHideOnKeyboard: true,
				// had to add this because for some reason on android the tabs moved up when keybaord appeared.
			}}
		>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => (
						<Feather name="user" size={24} color={focused ? "blue" : "black"} />
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
							color={focused ? "blue" : "black"}
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
							color={focused ? "blue" : "black"}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
