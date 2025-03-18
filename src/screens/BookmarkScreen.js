import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import BookmarkList from "../components/BookmarkList";

const initialLayout = { width: Dimensions.get("window").width };

export default function BookmarkScreen({ navigation }) {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "bookmark", title: "앞으로 볼 작품" },
        { key: "likeIt", title: "좋았던 작품" },
        { key: "seen", title: "이미 본 작품" },
    ]);

    const [bookmarkData, setBookmarkData] = useState([]);
    const [likeItData, setLikeItData] = useState([]);
    const [seenData, setSeenData] = useState([]);
    const [hasLoadedBookmark, setHasLoadedBookmark] = useState(false);
    const [hasLoadedLikeIt, setHasLoadedLikeIt] = useState(false);
    const [hasLoadedSeen, setHasLoadedSeen] = useState(false);

    // 각 탭에 대한 렌더링 함수
    const renderScene = SceneMap({
        bookmark: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>앞으로 볼 작품</Text>
                <BookmarkList bookmarkType="bookmark" navigation={navigation}
                              data={bookmarkData} setData={setBookmarkData}
                              hasLoaded={hasLoadedBookmark} setHasLoaded={setHasLoadedBookmark} />
            </View>
        ),
        likeIt: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>좋았던 작품</Text>
                <BookmarkList bookmarkType="likeIt" navigation={navigation}
                              data={likeItData} setData={setLikeItData}
                              hasLoaded={hasLoadedLikeIt} setHasLoaded={setHasLoadedLikeIt} />
            </View>
        ),
        seen: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>이미 본 작품</Text>
                <BookmarkList bookmarkType="seen" navigation={navigation}
                              data={seenData} setData={setSeenData}
                              hasLoaded={hasLoadedSeen} setHasLoaded={setHasLoadedSeen} />
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

