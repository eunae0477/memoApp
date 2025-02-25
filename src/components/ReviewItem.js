import React from "react";
import {View, Text, Button, StyleSheet, Alert} from "react-native";
import axios from "axios";
import CONFIG from "../../Config";

export default function ReviewItem({ item, fetchData }) {
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

    const reviewUdt = (item) => {
        console.log("수정");
        console.log(item.comment);
        console.log(item.score);
        console.log(item.id);
        console.log(item.reviewDate);
    }

    return (
        <View style={styles.reviewItem}>
            <Text style={styles.userName}>{item.usrName}</Text>
            <Text>점수: {item.score}</Text>
            <Text>날짜: {item.reviewDate}</Text>
            <Text>후기: {item.comment}</Text>
            {String(item.usrId).trim() === String(CONFIG.LOGIN_ID).trim() && (
                <View style={styles.buttonContainer}>
                    <Button title="수정" onPress={() => reviewUdt(item)} />
                    <Button title="삭제" onPress={reviewDel} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    reviewItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    userName: { fontWeight: "bold" },
});
