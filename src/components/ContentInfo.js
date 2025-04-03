import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import CONFIG from "../../Config";
import ContentMyScore from "./ContentMyScore";

export default function ContentInfo({item}) {
    const navigation = useNavigation();

    const [viewCnt, setViewCnt] = useState(0);
    const [likeIt, setLikeIt] = useState(false);
    const [seen, setSeen] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const [scoreAvg, setScoreAvg] = useState(0.0);

    const getBookmarkData = async () => {
        try {
            // 내가 봤는지, 북마크했는지, 좋아요했는지 선택 여부
            const bookmarkResponse = await axios.get(CONFIG.API_BASE_URL+"/contents-bookmark", {
                params: {
                    contentsId: item.id,
                    usrId: CONFIG.LOGIN_ID
                },
            });

            setBookmark(bookmarkResponse.data.bookmark);
            setLikeIt(bookmarkResponse.data.likeIt);
            setSeen(bookmarkResponse.data.seen);
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    };

    const totalView = async () => {
        try {
            // 컨텐츠 본 유저의 수
            const totalViewResponse = await axios.get(CONFIG.API_BASE_URL+"/bookmark-view-cnt", {
                params: {
                    contentsId: item.id
                },
            });

            setViewCnt(totalViewResponse.data);
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    }

    const getScoreAvg = async () => {
        try {
            // 평균 점수 가져오기
            const scoreResponse = await axios.get(CONFIG.API_BASE_URL+"/review-score-avg", {
                params: { contentsId: item.id },
            });
            if (scoreResponse.data && scoreResponse.data > 0){
                setScoreAvg(scoreResponse.data);
            } else {
                setScoreAvg(0.0);
            }
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    }

    const editBookmark = async () => {
        try {
            await axios.get(CONFIG.API_BASE_URL+"/bookmark", {
                params: {
                    contentsId: item.id,
                    usrId: CONFIG.LOGIN_ID,
                    bookmarkType: 'bookmark',
                    bookmark: !bookmark
                },
            });

            setBookmark(!bookmark);
        } catch (error) {
            console.log(error);
        }
    }

    const editLikeIt = async () => {
        try {
            await axios.get(CONFIG.API_BASE_URL+"/bookmark", {
                params: {
                    contentsId: item.id,
                    usrId: CONFIG.LOGIN_ID,
                    bookmarkType: 'likeIt',
                    bookmark: !likeIt
                },
            });

            setLikeIt(!likeIt);
        } catch (error) {
            console.log(error);
        }
    }

    const editSeen = async () => {
        try {
            await axios.get(CONFIG.API_BASE_URL+"/bookmark", {
                params: {
                    contentsId: item.id,
                    usrId: CONFIG.LOGIN_ID,
                    bookmarkType: 'seen',
                    bookmark: !seen
                },
            });

            setSeen(!seen);
            totalView();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBookmarkData();
        totalView();
        getScoreAvg();
    }, []);

    return (
        <View style={styles.container}>
            {/* ✅ 상단 뒤로가기 & 북마크/좋아요 버튼 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton} onPress={editBookmark}>
                        {bookmark ? (
                            <FontAwesome name="bookmark" size={24} color="#ffcc13" />
                        ):(
                            <FontAwesome name="bookmark-o" size={24} color="black" />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={editLikeIt}>
                        {likeIt ? (
                            <FontAwesome name="heart" size={24} color="red" />
                        ):(
                            <FontAwesome name="heart-o" size={24} color="black" />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={editSeen}>
                        {seen ? (
                            <Ionicons name="eye" size={24} color="black" />
                        ):(
                            <Ionicons name="eye-outline" size={24} color="black" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* ✅ 메인 이미지 */}
            <Image source={{ uri: item.img }} style={styles.image} />

            {/* ✅ 작품 정보 */}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <View style={styles.categoryWrap}>
                <Text style={styles.categoryCode}>{item.categoryCode?.trim()}</Text>
            </View>

            {/* ✅ 조회수 & 평점 */}
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Ionicons name="eye" size={16} color="gray" />
                    <Text style={styles.statText}>{viewCnt}</Text>
                </View>
                <View style={styles.stat}>
                    <FontAwesome name="star" size={16} color="gold" />
                    <Text style={styles.statText}>{scoreAvg}</Text>
                </View>
            </View>

            {/* 내 평가 점수 */}
            <ContentMyScore item={item} getScoreAvg={getScoreAvg}></ContentMyScore>
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
    categoryWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        columnGap: 5,
        marginBottom: 10,
        width: '100%'
    },
    categoryCode: {
        display: 'flex',
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ccc",
        borderRadius: 30,
        color: "gray",
        paddingHorizontal: 5,
        paddingVertical: 3
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
    response: {
        justifyContent: "center",
        alignItems: "center",
        width: 250,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#eedd33",
    },
    modalWrap: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalView: {
        width: "90%",
        padding: 40,
        marginHorizontal: "5%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
    },
    modalText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 20
    },
    modalInput: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ccc",
        borderRadius: 3,
        color: "#333",
    },
    modalSubmit: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#eedd33",
        width: 250,
        height: 40,
        borderRadius: 20,
    }
});
