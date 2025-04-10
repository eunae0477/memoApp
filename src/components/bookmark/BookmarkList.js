import React, {useEffect, useState} from "react";
import {Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import axios from "axios";
import CONFIG from "@config";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";

export default function BookmarkList({ bookmarkType, navigation, data, setData, hasLoaded, setHasLoaded }) {
    const [isRefreshing, setIsRefreshing] = useState(false);  // 새로고침 상태

    const fetchData = async () => {
        try {
            const params = {
                usrId: CONFIG.LOGIN_ID,
                bookmarkType: bookmarkType
            };

            const response = await axios.get(CONFIG.API_BASE_URL + "/bookmark-list", { params });

            // 북마크일 때만 드래그(순서변경)하기 위해서 리스트 재정렬
            const updated = response.data.map((item, index) => ({
                ...item,
                key: `${item.id || index}`, // 드래그용 키
            }));
            setData(updated);

            // setData(response.data);
            setHasLoaded(true);
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    };

    useEffect(() => {
        if (!hasLoaded) {
            fetchData();
        }
    }, [bookmarkType, hasLoaded]);

    // 새로고침 기능
    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    };

    const renderItem = ({ item, drag, isActive }) => (
        <TouchableOpacity
            onLongPress={bookmarkType === "bookmark" ? drag : undefined}
            style={[styles.box, isActive && styles.activeItem]}
            onPress={() => navigation.navigate("상세화면", { item })}
        >
            <Image source={{ uri: item.img }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: "#666" }}>#{item.categoryCode?.trim()} / {item.author}</Text>
            </View>
            {bookmarkType === "bookmark" && (
                <View style={styles.dragHandle}>
                    <Text style={{ fontSize: 18 }}>≡</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return bookmarkType === "bookmark" ? (
        <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item, index) => `draggable-${index}`}
            renderItem={renderItem}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
        />
    ) : (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.listContainer}>
                {data.map((item, index) => (
                    <TouchableOpacity
                        key={`${bookmarkType}-${index}`}
                        style={styles.box}
                        onPress={() => navigation.navigate("상세화면", { item })}
                    >
                        <Image source={{ uri: item.img }} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#666" }}>
                                작가명 등 기타 정보
                            </Text>
                        </View>
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
    listContainer: {
        padding: 10,
    },
    box: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    activeItem: {
        backgroundColor: "#f0f0f0",
    },
    image: {
        width: 60,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    dragHandle: {
        paddingLeft: 10,
        justifyContent: "center",
    },
});