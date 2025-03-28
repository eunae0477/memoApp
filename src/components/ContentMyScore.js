import React, {useEffect, useState} from "react";
import {
    Alert,
    Keyboard,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import axios from "axios";
import CONFIG from "../../Config";

export default function ContentMyScore({ item, getScoreAvg }) {
    const [modalVisible, setModalVisible] = useState(false); // 평가 입력 modal 창을 열고 닫는 변수 선언
    const [myScore, setMyScore] = useState(0);    // 저장된 나의 평가 점수
    const [scoreInput, setScoreInput] = useState(""); // 평가점수 입력 input 변수

    const getMyScore = async () => {
        try {
            // 나의 평가 점수 가져오기
            const myScoreData = await axios.get(CONFIG.API_BASE_URL+"/my-score", {
                params: {
                    contentsId: item.id,
                    usrId: CONFIG.LOGIN_ID},
            });
            setMyScore(myScoreData.data);
            if (myScoreData.data > 0) {
                setScoreInput(myScoreData.data);
            }
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    }

    const myScoreSave = async () => {
        // 평가 입력 input 에 값이 없을 경우 alert 호출 함수
        if (!scoreInput) {
            Alert.alert("입력 오류", "숫자를 입력해주세요.");
            return;
        } else {
            const paramData = new URLSearchParams();
            paramData.append("contentsId", item.id);
            paramData.append("usrId", CONFIG.LOGIN_ID);
            paramData.append("score", scoreInput);

            await axios.post(CONFIG.API_BASE_URL+"/my-score", paramData);
            setMyScore(scoreInput);
            getScoreAvg();

            // 평가 입력 input 에 값이 있을 경우 modal 닫힘
            setModalVisible(false);
        }
    };

    useEffect(() => {
        getMyScore();
    }, []);

    useEffect(() => {
        if (!modalVisible) {
            setScoreInput(myScore > 0 ? myScore : scoreInput);
        }
    }, [modalVisible]);

    return (
        <>
            <View>
                <Pressable style={styles.response} onPress={() => setModalVisible(true)}>
                    {myScore > 0 ? (<Text>나의 평가 점수 : {myScore}</Text>) : (<Text>평가하기</Text>)}
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
                                value={scoreInput.toString()}
                                onChangeText={(text) => {
                                    const numericText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
                                    if (numericText === '' || (parseInt(numericText, 10) <= 10 && parseInt(numericText, 10) >= 0)) {
                                        setScoreInput(numericText);
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
        </>
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
