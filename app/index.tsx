import { useEffect } from "react";
import { Text, View ,StyleSheet, Linking, Alert, BackHandler } from "react-native";
import WebView from "react-native-webview";

export default function Index() {
 
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Exit App", 
        "Are you sure you want to close this app?", 
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Yes", 
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
      return true; // Prevent default back action
    };

    // Add event listener for back press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []); // Dependency array ensures this runs once on mount

  return (
    <View
      style={styles.container}>
      <WebView source={{ uri: "https://alam198.github.io/app_dev/" }} 
       
       onShouldStartLoadWithRequest={(event) => {
        if (event.url !== "https://example.com") {
          Linking.openURL(event.url);
          return false;
        }
        return true;
      }}

      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    paddingTop:1
  }
});
