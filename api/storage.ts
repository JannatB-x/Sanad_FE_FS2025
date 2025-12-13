import AsyncStorage from "@react-native-async-storage/async-storage";

const storeToken = async (value: string) => {
  try {
    // Remove "Bearer" prefix if it exists, and trim whitespace
    let cleanToken = value.trim();
    if (cleanToken.startsWith("Bearer ")) {
      cleanToken = cleanToken.substring(7).trim();
    }
    await AsyncStorage.setItem("token", cleanToken);
    console.log("Token stored successfully");
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      // Ensure token doesn't have Bearer prefix and is trimmed
      let cleanToken = token.trim();
      if (cleanToken.startsWith("Bearer ")) {
        cleanToken = cleanToken.substring(7).trim();
      }
      return cleanToken;
    }
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
};

export { getToken, removeToken, storeToken };
