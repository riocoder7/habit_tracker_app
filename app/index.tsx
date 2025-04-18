import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Alert,
  BackHandler,
  Text,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import WebView from "react-native-webview";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Set how notifications behave when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Default sound
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const [showWebView, setShowWebView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const names = ["Stay focused!", "Build your habits!", "Track your progress!", "Achieve greatness!"];

  const messages = [
    "Rise and grind! 💪 Your future self is counting on you!",
    "Small steps today, big success tomorrow! 🚀 Keep going!",
    "You are unstoppable! 💥 Crush your tasks now!",
    "Success is built daily! 📅 Stay focused and win!",
    "Great things take time! ⏳ Keep pushing forward!",
    "Your effort today shapes your future! Keep hustling! 🔥",
    "One step at a time, you're getting closer to your goal! 💯",
  ];

  useEffect(() => {
    const getRandomMessage = () => messages[Math.floor(Math.random() * messages.length)];

    const registerForPushNotificationsAsync = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          Alert.alert("Permission required", "Please enable notifications in settings.");
          return;
        }

        // Required for Android: ensure the notification channel is set
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.HIGH,
            sound: true,
          });
        }
      } else {
        Alert.alert("Real device required", "Push notifications don't work on emulators.");
      }
    };

    const scheduleNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (__DEV__) {
        // Dev mode: show 5 notifications every 10 seconds
        let count = 0;
        const interval = setInterval(() => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Dev Reminder 💡",
              body: getRandomMessage(),
            },
            trigger: null,
          });
          count++;
          if (count >= 5) clearInterval(interval);
        }, 10000); // 10 sec interval in dev
      } else {
        // Production: send every 20 secound
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Reminder ✨",
            body: getRandomMessage(),
            data: { screen: "Index" },
          },
          trigger: {
            seconds: 20, // 20 secound
            repeats: true,
          },
        });
      }
    };

    registerForPushNotificationsAsync();
    scheduleNotifications();

    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to close this app?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "Yes", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  // Typing effect logic
  useEffect(() => {
    const currentName = names[currentNameIndex];
    if (charIndex < currentName.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + currentName.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const delay = setTimeout(() => {
        setTypedText("");
        setCharIndex(0);
        setCurrentNameIndex((prev) => (prev + 1) % names.length);
      }, 1000);
      return () => clearTimeout(delay);
    }
  }, [charIndex, currentNameIndex]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setShowWebView(true);
    }, 3000); // 3-second splash delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.welcomeScreen}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Habits Tracker</Text>
          <ActivityIndicator size="large" color="skyblue" style={{ marginTop: 20 }} />
        </View>
      ) : (
        <WebView
          source={{ uri: "https://alam198.github.io/app_dev/" }}
          onShouldStartLoadWithRequest={(event) => {
            if (event.url !== "https://example.com") {
              Linking.openURL(event.url);
              return false;
            }
            return true;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  welcomeScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 28,
    color: "skyblue",
    fontWeight: "600",
  },
  typingText: {
    fontSize: 20,
    color: "#333",
    marginTop: 10,
    minHeight: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "skyblue",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
