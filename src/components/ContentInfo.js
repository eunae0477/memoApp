import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export default function ContentInfo({ item, scoreAvg }) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* ✅ 상단 뒤로가기 & 북마크/좋아요 버튼 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <FontAwesome name="bookmark-o" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <FontAwesome name="heart-o" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="eye-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ✅ 메인 이미지 */}
            <Image source={{ uri: item.img }} style={styles.image} />

            {/* ✅ 작품 정보 */}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>

            {/* ✅ 조회수 & 평점 */}
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Ionicons name="eye" size={16} color="gray" />
                    <Text style={styles.statText}>{item.seenCnt}</Text>
                </View>
                <View style={styles.stat}>
                    <FontAwesome name="star" size={16} color="gold" />
                    <Text style={styles.statText}>{scoreAvg}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        paddingTop: 60,
        backgroundColor: "#F8F8F8",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 1
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        marginLeft: 15,
    },
    image: {
        width: 250,
        height: 350,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
    },
    author: {
        fontSize: 15,
        color: "gray",
        marginBottom: 10,
        alignSelf: "center",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    stat: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },
    statText: {
        marginLeft: 5,
        fontSize: 14,
        color: "gray",
    },
});
