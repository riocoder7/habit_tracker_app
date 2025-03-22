import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar
        style="dark-content"
        backgroundColor="transparent"
        translucent
      />
    </>
  );
}
