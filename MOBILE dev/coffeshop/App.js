import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  HomeScreen,
  AddProductScreen,
  EditProductScreen,
  ProductDetailScreen,
} from "./screens";
import { colors } from "./utils/theme";

const Stack = createStackNavigator();

export default function App() {
  const screenOptions = {
    headerShown: false,
    cardStyle: { backgroundColor: colors.white },
    animationEnabled: true,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions} initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            cardStyle: { backgroundColor: colors.white },
          }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{
            cardStyle: { backgroundColor: colors.white },
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            cardStyle: { backgroundColor: colors.white },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
