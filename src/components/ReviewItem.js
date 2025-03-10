import React from "react";
import {View, Text, Button, StyleSheet, Alert} from "react-native";
import axios from "axios";
import CONFIG from "../../Config";

export default function ReviewItem({ item, fetchData, setReviewForEdit }) {
    const reviewDel = () => {
        try {
            Alert.alert("", "선택한 리뷰를 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    onPress: async () => {
                        await axios.delete(CONFIG.API_BASE_URL + "/review", {
                            params: { id: item.id },
                        });
                        fetchData();
                    },
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.reviewItem}>
            <Text style={styles.userName}>{item.usrName}</Text>
            <Text>점수: {item.score}</Text>
            <Text>날짜: {item.reviewDate}</Text>
            <Text>후기: {item.comment}</Text>
            {String(item.usrId) === String(CONFIG.LOGIN_ID) ? (
                <View style={styles.buttonContainer}>
                    <Text style={styles.reviewBtn} onPress={() => setReviewForEdit(item)}>수정</Text>
                    <Text style={styles.reviewBtn} onPress={reviewDel}>삭제</Text>
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                    <Text style={[styles.reviewBtn, {backgroundColor: 'grey'}]}>조아용</Text>
                    <Text style={[styles.reviewBtn, {backgroundColor: 'grey'}]}>시러용</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    reviewItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    userName: { fontWeight: "bold" },
    buttonContainer: {
        flexDirection: 'row',
        columnGap: 10,
    },
    reviewBtn: {
        flexGrow: 1,
        textAlign: 'center',
        backgroundColor: 'skyblue',
        maxWidth: 200
    }
});
