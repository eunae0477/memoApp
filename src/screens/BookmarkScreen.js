import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import BookmarkList from "../components/BookmarkList";

const initialLayout = { width: Dimensions.get("window").width };

export default function BookmarkScreen({ navigation }) {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "bookmark", title: "볼거임" },
        { key: "likeIt", title: "좋더라" },
        { key: "seen", title: "봤어" },
    ]);

    // 각 탭에 대한 렌더링 함수
    const renderScene = SceneMap({
        bookmark: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>볼 작품</Text>
                <BookmarkList bookmarkType="bookmark" navigation={navigation} />
            </View>
        ),
        likeIt: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>좋게 본 작품</Text>
                <BookmarkList bookmarkType="likeIt" navigation={navigation} />
            </View>
        ),
        seen: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>본 작품</Text>
                <BookmarkList bookmarkType="seen" navigation={navigation} />
            </View>
        ),
    });



    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    style={styles.tabBar}
                    indicatorStyle={styles.indicator}
                    activeColor="white"
                    inactiveColor="lightgray"
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
    tabBar: { backgroundColor: "#31a851" }, // 탭 배경 색상
    indicator: { backgroundColor: "white" }, // 선택된 탭 하단 강조선
});

