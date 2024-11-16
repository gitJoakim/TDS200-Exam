import * as Location from "expo-location";
import googleConfig from "@/googlemapsEnv";

const fetchAddressWithGoogleAPI = async (
	location: Location.LocationObjectCoords
): Promise<Location.LocationGeocodedAddress[] | null> => {
	if (location) {
		const { latitude, longitude } = location;
		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleConfig.API_KEY}`;

		try {
			// Perform the fetch request
			const response = await fetch(url);

			// Check if the response is OK (status 200)
			if (response.ok) {
				// Parse the response body into JSON
				const data = await response.json();

				// Log the parsed data to inspect the structure
				console.log("Google Places API Response:", data);

				// Ensure the status is "OK" and there are results
				if (data.status === "OK" && data.results && data.results.length > 0) {
					const addressComponents = data.results[0].address_components;

					let city: string | null = null;
					let country: string | null = null;

					// Loop through address components and find city and country
					addressComponents.forEach((component: any) => {
						if (
							component.types.includes("locality") || // City or town
							component.types.includes("postal_town") || // Postal town (common in some countries)
							component.types.includes("sublocality") // Subdivisions of cities/towns
						) {
							city = city || component.long_name; // Prioritize finer granularity but avoid overwriting
						} else if (
							component.types.includes("administrative_area_level_2")
						) {
							// Broader area if no locality or town is found
							city = city || component.long_name;
						} else if (
							component.types.includes("administrative_area_level_1")
						) {
							// State or region as a last fallback for city
							city = city || component.long_name;
						} else if (component.types.includes("country")) {
							country = component.long_name; // Always get the country
						}
					});

					// Return array with the address object
					return [
						{
							city: city,
							country: country,
							district: null,
							streetNumber: null,
							street: null,
							region: null,
							subregion: null,
							postalCode: null,
							name: null,
							isoCountryCode: null,
							timezone: null,
							formattedAddress: null,
						},
					];
				} else {
					// Handle no results or error status
					console.warn("No address found or error occurred:", data.status);
					return null;
				}
			} else {
				// Handle fetch errors (e.g., network issues)
				console.error("Failed to fetch address. HTTP Status:", response.status);
				return null;
			}
		} catch (error) {
			// Handle any errors that occurred during the fetch
			console.error("Error fetching address on web:", error);
			return null;
		}
	}

	return null; // Return null if no location is provided
};

export default fetchAddressWithGoogleAPI;
