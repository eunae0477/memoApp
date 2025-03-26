import React from 'react';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
     <SafeAreaProvider style={{backgroundColor: "#eeb600"}}>
          <SafeAreaView style={{flexGrow: 1}} edges={["top"]}>
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen name="메인" component={BottomTabNavigator} options={{ headerShown: false }} />
                  <Stack.Screen name="상세화면" component={DetailScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
              </NavigationContainer>
          </SafeAreaView>
      </SafeAreaProvider>
  );
}
