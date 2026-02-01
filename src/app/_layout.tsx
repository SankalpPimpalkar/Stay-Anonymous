import { Stack } from "expo-router";
import { COLORS } from "../constants/styles";
import { AuthContextProvider } from "../context/AuthContextProvider";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack screenOptions={{
        headerShown: false, contentStyle: {
          backgroundColor: COLORS.BACKGROUND,
        },
      }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="create" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthContextProvider>
  )
}
