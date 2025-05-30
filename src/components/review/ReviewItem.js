import React from "react";
import {View, Text, Button, StyleSheet, Alert} from "react-native";
import axios from "axios";
import CONFIG from "@config";

export default function ReviewItem({ item, getReviewList, setReviewForEdit, setReviewData }) {
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
                        getReviewList();
                    },
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    const reviewGood = async (state) => {
        setReviewData((prevData) =>
            prevData.map((review) =>
                review.id === item.id ? { ...review,
                                        reviewGoodCnt: state ? review.reviewGoodCnt + 1 : review.reviewGoodCnt - 1,
                                        reviewBadCnt: review.reviewGb == 'B' ? review.reviewBadCnt - 1 : review.reviewBadCnt,
                                        reviewGb: state ? 'G' : '' } : review
            )
        );

        const paramData = new URLSearchParams();
        paramData.append("targetReviewId", item.id);
        paramData.append("usrId", CONFIG.LOGIN_ID);
        paramData.append("gb", state ? 'G' : '');

        await axios.post(CONFIG.API_BASE_URL+"/review-gb", paramData);
    };

    const reviewBad = async (state) => {
        setReviewData((prevData) =>
            prevData.map((review) =>
                review.id === item.id ? { ...review,
                                        reviewBadCnt: state ? review.reviewBadCnt + 1 : review.reviewBadCnt - 1,
                                        reviewGoodCnt: review.reviewGb == 'G' ? review.reviewGoodCnt - 1 : review.reviewGoodCnt,
                                        reviewGb: state ? 'B' : '' } : review
            )
        );

        const paramData = new URLSearchParams();
        paramData.append("targetReviewId", item.id);
        paramData.append("usrId", CONFIG.LOGIN_ID);
        paramData.append("gb", state ? 'B' : '');

        await axios.post(CONFIG.API_BASE_URL+"/review-gb", paramData);
    };


    return (
        <View style={styles.reviewItem}>
            <Text style={styles.userName}>{item.usrName}</Text>
            <Text>날짜: {item.reviewDate}</Text>
            <Text style={styles.comment}>후기: {item.comment}</Text>
            {String(item.usrId) === String(CONFIG.LOGIN_ID) ? (
                <View style={styles.buttonContainer}>
                    <Text style={styles.reviewBtn} onPress={() => setReviewForEdit(item)}>수정</Text>
                    <Text style={styles.reviewBtn} onPress={reviewDel}>삭제</Text>
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                    {item.reviewGb == 'G' ? (
                        <Text style={[styles.reviewBtn, styles.goodReview]} onPress={() => reviewGood(false)}>조아용 {item.reviewGoodCnt}</Text>
                    ) : (
                        <Text style={[styles.reviewBtn, {backgroundColor: 'grey'}]} onPress={() => reviewGood(true)}>조아용 {item.reviewGoodCnt}</Text>
                    )}
                    {item.reviewGb == 'B' ? (
                        <Text style={[styles.reviewBtn, styles.badReview]} onPress={() => reviewBad(false)}>시러용 {item.reviewBadCnt}</Text>
                    ) : (
                        <Text style={[styles.reviewBtn, {backgroundColor: 'grey'}]} onPress={() => reviewBad(true)}>시러용 {item.reviewBadCnt}</Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    reviewItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    userName: { fontWeight: "bold" },
    comment: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#eee',
    },
    buttonContainer: {
        flexDirection: 'row',
        columnGap: 10,
    },
    reviewBtn: {
        flexGrow: 1,
        textAlign: 'center',
        backgroundColor: 'skyblue',
        maxWidth: 200,
        padding: 5,
    },
    goodReview: {
        backgroundColor: 'pink'
    },
    badReview: {
        backgroundColor: 'navy',
        color: 'white'
    }
});
