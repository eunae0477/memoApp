import React, {useEffect, useState} from "react";
import {Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import axios from "axios";
import CONFIG from "@config";

export default function RankList({ typeCode, navigation, data, setData, dataType, hasLoaded, setHasLoaded}) {
    const [isRefreshing, setIsRefreshing] = useState(false);  // 새로고침 상태

    const fetchData = async () => {
        try {
            const response = await axios.get(CONFIG.API_BASE_URL + "/contents-list", {
                params: { typeCode: typeCode },
            });

            setData(prev => ({ ...prev, [dataType]: response.data }));
            setHasLoaded(prev => ({ ...prev, [dataType]: true }));
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    };

    // useEffect로 처음 한 번만 데이터를 불러옵니다.
    useEffect(() => {
        if (!hasLoaded) {
            fetchData();
        }
    }, [typeCode, hasLoaded]);

    // 새로고침 기능
    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.gridContainer}>
                {data.map((item, index) => (
                    <TouchableOpacity
                        key={`${dataType}-${index}`}
                        style={styles.box}
                        onPress={() => navigation.navigate("상세화면", { item })}
                    >
                        <Image source={{ uri: item.img }} style={styles.image} />
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    box: {
        width: "45%", // ✅ 한 줄에 2개씩 정렬
        aspectRatio: 0.7, // ✅ 세로 비율 조정
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderRadius: 8,
    },
    image: {
        width: "100%",
        height: "80%", // ✅ 이미지 크기를 조정하여 텍스트 공간 확보
        resizeMode: "cover",
        borderRadius: 5,
    },
    title: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 5,
        width: "90%", // ✅ 텍스트 너비 제한 (줄바꿈 방지)
    },
});
