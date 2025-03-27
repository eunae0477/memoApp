import React, {useEffect, useState} from "react";
import {
    Alert,
    Image,
    Keyboard,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import CONFIG from "../../Config";

export default function ContentInfo({ item, scoreAvg, savedMyScore, setSavedMyScore, getScoreAvg }) {
    const navigation = useNavigation();

    const [viewCnt, setViewCnt] = useState(0);
    const [likeIt, setLikeIt] = useState(false);
    const [seen, setSeen] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // 평가 입력 modal 창을 열고 닫는 변수 선언
    const [score, setScore] = useState(""); // 평가점수 입력 input 변수

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

    const myScoreSave = async () => {
        // 평가 입력 input 에 값이 없을 경우 alert 호출 함수
        if (!score) {
            Alert.alert("입력 오류", "숫자를 입력해주세요.");
            return;
        } else {
            await axios.post(CONFIG.API_BASE_URL+"/my-score", {
                data: { contentsId: item.id,
                        usrId: CONFIG.LOGIN_ID,
                        score: score}
            });
            setSavedMyScore(score);
            getScoreAvg();

            // 평가 입력 input 에 값이 있을 경우 modal 닫힘
            setModalVisible(false);
        }
    };

    useEffect(() => {
        getBookmarkData();
        totalView();
    }, []);

    useEffect(() => {
        if (!modalVisible) {
            setScore(savedMyScore > 0 ? savedMyScore : score);
        }
    }, [modalVisible]);

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

            {/* 점수 입력 */}
            <View>
                <Pressable style={styles.response} onPress={() => setModalVisible(true)}>
                    {savedMyScore > 0 ? (<Text>나의 평가 점수 : {savedMyScore}</Text>) : (<Text>평가하기</Text>)}
                </Pressable>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss(); setModalVisible(false);
                    }}
                >
                    <View style={styles.modalWrap}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>이번 작품은 어땠나요?</Text>
                            <TextInput
                                placeholder="숫자만 입력 가능합니다"
                                placeholderTextColor="#ccc"
                                style={styles.modalInput}
                                value={score}
                                onChangeText={(text) => {
                                    const numericText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
                                    if (numericText === '' || (parseInt(numericText, 10) <= 10 && parseInt(numericText, 10) >= 0)) {
                                        setScore(numericText);
                                    }
                                }}
                                keyboardType="numeric"
                            ></TextInput>
                            <Pressable
                                style={styles.modalSubmit}
                                onPress={myScoreSave}
                            >
                                <Text style={styles.submitText}>평가하기</Text>
                            </Pressable>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>
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
