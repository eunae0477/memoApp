import React, { useEffect, useState, useRef } from "react";
import {
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import axios from "axios";
import CONFIG from "@config";

export default function BookmarkList({
                                         bookmarkType,
                                         navigation,
                                         data,
                                         setData,
                                         hasLoaded,
                                         setHasLoaded,
                                     }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const activeDragRef = useRef(false);

    const fetchData = async () => {
        try {
            const params = {
                usrId: CONFIG.LOGIN_ID,
                bookmarkType,
            };
            const response = await axios.get(CONFIG.API_BASE_URL + "/bookmark-list", { params });
            const updatedData = response.data.map((item, index) => ({
                ...item,
                key: `${item.id || index}`,
            }));
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

    const onDragEnd = ({ data: newData }) => {
        setData(newData);

        // 순서 저장
        if (bookmarkType === "bookmark") {
            const contentsIdArr = newData.map((item) => item.id);
            axios.post(CONFIG.API_BASE_URL + "/bookmark-seq", {
                usrId: CONFIG.LOGIN_ID,
                contentsIdArr: contentsIdArr,
            },{
                headers: {
                    "Content-Type": "application/json",
                },
            }).catch(err => {
                console.error("순서 저장 실패", err);
            });
        }
    };

    const renderItem = ({ item, drag, isActive }) => (
        <TouchableOpacity
            style={[styles.itemContainer, isActive && styles.activeItem]}
            onPress={() => navigation.navigate("상세화면", { item })}
            disabled={isActive}
        >
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.itemMeta}>#{item.categoryCode} / {item.author}</Text>
            </View>

            {/* ✅ 드래그 핸들 버튼 (bookmark일 때만 동작) */}
            {bookmarkType === "bookmark" && (
                <TouchableOpacity
                    style={styles.dragHandle}
                    onPressIn={() => {
                        activeDragRef.current = true;
                        drag();
                    }}
                    onPressOut={() => (activeDragRef.current = false)}
                >
                    <Text style={{ fontSize: 18 }}>≡</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (
        <DraggableFlatList
            data={data}
            onDragEnd={onDragEnd}
            keyExtractor={(item, index) => `draggable-${bookmarkType}-${index}`}
            renderItem={renderItem}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            scrollEnabled={!activeDragRef.current}
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
