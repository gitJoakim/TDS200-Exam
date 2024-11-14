import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.ArtVistaRed,
				headerShown: true,
				tabBarHideOnKeyboard: true,
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
							color={focused ? Colors.ArtVistaRed : "gray"}
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
							color={focused ? Colors.ArtVistaRed : "gray"}
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
							color={focused ? Colors.ArtVistaRed : "gray"}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
