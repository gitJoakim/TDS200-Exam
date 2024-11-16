const { getDefaultConfig } = require("expo/metro-config");

const ALIASES = {
	"react-native": "react-native-web", // Alias react-native to react-native-web for web builds
	"react-native-maps": "@teovilla/react-native-web-maps", // Alias react-native-maps to web-compatible library
};

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// If you need to add additional extensions like cjs (CommonJS modules), keep this
config.resolver.sourceExts.push("cjs");

config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (platform === "web") {
		// The alias will only be used when bundling for the web.
		return context.resolveRequest(
			context,
			ALIASES[moduleName] ?? moduleName, // Use alias for web
			platform
		);
	}

	// For mobile platforms (iOS/Android), fallback to the default resolution
	return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
