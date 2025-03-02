import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import RankList from "../components/RankList"; // RankList 컴포넌트

const initialLayout = { width: Dimensions.get("window").width };

export default function HomeScreen({ navigation }) {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "webtoon", title: "웹툰" },
        { key: "novel", title: "웹소설" },
    ]);

    // 각 탭에 대한 렌더링 함수
    const renderScene = SceneMap({
        webtoon: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>웹툰 TOP 10</Text>
                <RankList typeCode="B1" navigation={navigation} />
            </View>
        ),
        novel: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>웹소설 TOP 10</Text>
                <RankList typeCode="B2" navigation={navigation} />
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
    tabBar: { backgroundColor: "#eeb600" }, // 탭 배경 색상
    indicator: { backgroundColor: "white" }, // 선택된 탭 하단 강조선
});
