import React, {useEffect, useState} from "react";
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import RankList from "../components/RankList";
import axios from "axios";
import CONFIG from "../../Config";

const initialLayout = { width: Dimensions.get("window").width };

export default function HomeScreen({ navigation }) {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "novel", title: "웹소설" },
        { key: "webtoon", title: "웹툰" },
    ]);

    const [data, setData] = useState({
        webtoon: [],
        novel: [],
    });  // 각 탭별 데이터를 관리

    const [hasLoaded, setHasLoaded] = useState({
        webtoon: false,
        novel: false,
    });  // 각 탭별 데이터 로딩 여부

    const [categories, setCategories] = useState({
        webtoon: ["전체"],
        novel: ["전체"],
    }); // 각 탭별 카테고리 리스트

    const [selectedCategory, setSelectedCategory] = useState({
        webtoon: "전체",
        novel: "전체",
    }); // 각 탭별 선택된 카테고리

    // 카테고리 가져오기
    const fetchCategories = async (typeCode, dataType) => {
        try {
            const response = await axios.get(CONFIG.API_BASE_URL + "/category-list", {
                params: { typeCode: typeCode }
            });

            setCategories(prev => ({
                ...prev,
                [dataType]: [
                    { id: 0, code: "전체", typeCode },
                    ...response.data,                // ✅ 서버에서 받은 카테고리 리스트 추가
                ],
            }));
        } catch (error) {
            console.error("카테고리 가져오기 오류:", error);
        }
    };

    useEffect(() => {
        fetchCategories("B1", "webtoon");
        fetchCategories("B2", "novel");
    }, []);

    const renderCategoryButtons = (dataType) => {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories[dataType]?.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.categoryButton,
                            selectedCategory[dataType]?.id === cat.id && styles.categoryButtonActive,
                        ]}
                        onPress={() => setSelectedCategory(prev => ({ ...prev, [dataType]: cat }))}
                    >
                        <Text
                            style={
                                selectedCategory[dataType]?.id === cat.id
                                    ? styles.categoryButtonTextActive
                                    : styles.categoryButtonText
                            }
                        >
                            {cat.code}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    // 각 탭에 대한 렌더링 함수
    const renderScene = SceneMap({
        webtoon: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>웹툰 TOP 10</Text>
                {renderCategoryButtons("webtoon")}
                <RankList
                    typeCode="B1"
                    navigation={navigation}
                    data={data.webtoon}
                    setData={setData}
                    dataType="webtoon"
                    hasLoaded={hasLoaded.webtoon}
                    setHasLoaded={setHasLoaded}
                    selectedCategory={selectedCategory.webtoon}
                />
            </View>
        ),
        novel: () => (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>웹소설 TOP 10</Text>
                {renderCategoryButtons("novel")}
                <RankList
                    typeCode="B2"
                    navigation={navigation}
                    data={data.novel}
                    setData={setData}
                    dataType="novel"
                    hasLoaded={hasLoaded.novel}
                    setHasLoaded={setHasLoaded}
                    selectedCategory={selectedCategory.novel}
                />
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
    tabBar: { backgroundColor: "#eeb600" },
    indicator: { backgroundColor: "white" },
    categoryButton: {
        height: 36, // 버튼 높이 지정
        paddingHorizontal: 12,
        justifyContent: "center",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
        backgroundColor: "#f5f5f5",
    },
    categoryButtonActive: {
        backgroundColor: "#eeb600",
        borderColor: "#eeb600",
    },
    categoryButtonText: {
        color: "#555",
    },
    categoryButtonTextActive: {
        color: "#fff",
        fontWeight: "bold",
    },
});