import React, {useEffect, useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from "axios";
import CONFIG from "../../Config";

const ReviewInput = ({contentsId, onReviewSaved, reviewForEdit, setReviewForEdit}) => {
    const [myReview, setMyReview] = useState(reviewForEdit?.comment || "");
    const [score, setScore] = useState(reviewForEdit?.score?.toString() || "");

    useEffect(() => {
        // ✅ reviewForEdit 값이 변경될 때, TextInput에 반영
        if (reviewForEdit) {
            setMyReview(reviewForEdit.comment);
            setScore(reviewForEdit.score.toString());
        }
    }, [reviewForEdit]);

    const reviewSave = async () => {
        try {
            const numericScore = Number(score);
            if (myReview.trim() === '') {
                Alert.alert('알림', '후기를 입력해주세요.');
                return;
            }
            if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
                Alert.alert('알림', '점수는 0에서 10 사이의 숫자만 입력 가능합니다.');
                return;
            }

            const paramData = new URLSearchParams();
            paramData.append("contentsId", contentsId);
            paramData.append("usrId", CONFIG.LOGIN_ID);
            paramData.append("score", numericScore);
            paramData.append("comment", myReview);

            if (!reviewForEdit?.id) {
                // 리뷰 저장
                await axios.post(CONFIG.API_BASE_URL+"/review", paramData);
            } else {
                // 리뷰 수정
                paramData.append("id", reviewForEdit?.id || null);
                await axios.put(CONFIG.API_BASE_URL+"/review", paramData);
            }
            Alert.alert('알림', '후기가 저장되었습니다.');

            // 입력 필드 초기화
            setMyReview('');
            setScore(0);

            // 수정모드 해제
            setReviewForEdit(null);

            // 부모 컴포넌트의 데이터 갱신
            onReviewSaved();
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <View style={styles.container}>
            {/* 후기 입력 필드 */}
            <TextInput
                style={styles.input}
                placeholder="후기를 입력하세요..."
                value={myReview}
                onChangeText={setMyReview}
            />

            {/* 점수 입력 필드 (0~10 사이 숫자) */}
            <TextInput
                style={styles.input}
                placeholder="점수 (0-10)"
                value={score}
                onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
                    if (numericText === '' || (parseInt(numericText, 10) <= 10 && parseInt(numericText, 10) >= 0)) {
                        setScore(numericText);
                    }
                }}
                keyboardType="numeric"
            />

            <Button title="저장" onPress={reviewSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default ReviewInput;
