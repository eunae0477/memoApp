import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import DetailScreen from './src/screens/DetailScreen'; // ✅ 상세화면 추가

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="메인" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="상세화면" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
