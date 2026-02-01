import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORS } from "../constants/styles";
import { AuthContextProvider } from "../context/AuthContextProvider";
import "../global.css";

// Configure foreground notification handling
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  // Ignored in Expo Go
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  )
}
