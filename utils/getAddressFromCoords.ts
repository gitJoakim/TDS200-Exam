import * as Location from "expo-location";

// util function to grab the address info from coords
export const getAddressFromCoords = async (
	coords: Location.LocationObjectCoords | null
): Promise<Location.LocationGeocodedAddress[] | null> => {
	if (!coords) return null;
	try {
		const result = await Location.reverseGeocodeAsync({
			latitude: coords.latitude,
			longitude: coords.longitude,
		});
		if (result.length > 0) {
			return result;
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error fetching address:", error);
		return null;
	}
};
