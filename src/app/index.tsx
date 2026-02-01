import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContextProvider'
import { Redirect } from 'expo-router';

export default function Index() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href={'/(tabs)/home'} />
  }

  return <Redirect href={'/(auth)/login'} />
}