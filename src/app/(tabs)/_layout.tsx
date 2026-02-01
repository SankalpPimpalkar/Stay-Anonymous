import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/styles";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.SURFACE,
                    borderTopColor: COLORS.BORDER,
                    height: 72,
                    paddingTop: 2,
                    paddingBottom: 12,
                    borderTopWidth:1
                },
                tabBarItemStyle: {
                    paddingVertical: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginTop: 4,
                },
                tabBarActiveTintColor: COLORS.ACCENT,
                tabBarInactiveTintColor: COLORS.TEXT_MUTED,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
