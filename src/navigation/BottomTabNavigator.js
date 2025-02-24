import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import WebtoonScreen from '../screens/WebtoonScreen';
import NovelScreen from '../screens/NovelScreen';
import BookmarkScreen from "../screens/BookmarkScreen";
import SearchScreen from "../screens/SearchScreen";
import MyPageScreen from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({color, size}) => {
                    let iconName;
                    if (route.name === '홈') iconName = 'home';
                    else if (route.name === '웹툰') iconName = 'book';
                    else if (route.name === '웹소설') iconName = 'reader';
                    else if (route.name === '북마크') iconName = 'bookmark';
                    else if (route.name === '검색') iconName = 'search';
                    else if (route.name === '마이페이지') iconName = 'person';

                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
            })}
        >
            <Tab.Screen name="홈" component={HomeScreen} />
            {/*<Tab.Screen name="웹툰" component={WebtoonScreen}/>
            <Tab.Screen name="웹소설" component={NovelScreen}/>*/}
            <Tab.Screen name="북마크" component={BookmarkScreen} options={{ headerShown: false }}/>
            <Tab.Screen name="검색" component={SearchScreen} options={{ headerShown: false }}/>
            <Tab.Screen name="마이페이지" component={MyPageScreen} options={{ headerShown: false }}/>
        </Tab.Navigator>
    );
}
