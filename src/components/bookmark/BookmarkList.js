import React, { useEffect, useState } from "react";
import { Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import axios from "axios";
import CONFIG from "../../../Config";

export default function BookmarkList({ bookmarkType, navigation, data, setData, hasLoaded, setHasLoaded }) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const params = {
                usrId: CONFIG.LOGIN_ID,
                bookmarkType,
            };
            const response = await axios.get(CONFIG.API_BASE_URL + "/bookmark-list", { params });
            const updatedData = response.data.map((item, index) => ({ ...item, key: `${item.id || index}` }));
            setData(updatedData);
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

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    };

    const renderItem = ({ item, drag, isActive }) => (
        <TouchableOpacity
            style={[styles.itemContainer, isActive && styles.activeItem]}
            onLongPress={drag}
            onPress={() => navigation.navigate("상세화면", { item })}
        >
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.itemMeta}>작가명 등 기타 정보</Text>
            </View>
            <View style={styles.dragHandle}>
                <Text style={{ fontSize: 18 }}>≡</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item, index) => `draggable-${bookmarkType}-${index}`}
            renderItem={renderItem}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    activeItem: {
        backgroundColor: "#f0f0f0",
    },
    itemImage: {
        width: 60,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: "bold",
    },
    itemMeta: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    dragHandle: {
        paddingLeft: 10,
        justifyContent: "center",
    },
});
