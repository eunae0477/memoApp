import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, TextInput, Button } from 'react-native';
import axios from "axios";
import CONFIG from "../../Config";
import ReviewInput from "../components/ReviewInput";

export default function DetailScreen({ route }) {
    const { item } = route.params;

    /*const [myReview, setMyReview] = useState([]);*/
    const [reviewData, setReviewData] = useState([]);
    const [scoreAvg, setScoreAvg] = useState(0.0);

    const fetchData = async () => {
        try {
            // 후기 리스트 가져오기
            const reviewListResponse = await axios.get(CONFIG.API_BASE_URL+"/review-list", {
                params: { contentsId: item.id },
            });
            setReviewData(reviewListResponse.data);

            // 나의 후기 가져오기
            /*const myReviewResponse = await axios.get(CONFIG.API_BASE_URL+"/review-list", {
                params: { contentsId: item.id, usrId: CONFIG.LOGIN_ID },
            });
            setMyReview(myReviewResponse.data);*/

            // 평균 점수 가져오기
            const scoreResponse = await axios.get(CONFIG.API_BASE_URL+"/review-score", {
                params: { contentsId: item.id },
            });
            if (scoreResponse.data && scoreResponse.data > 0){
                setScoreAvg(scoreResponse.data);
            }
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>

            {/* 평균 점수 */}
            <Text style={styles.score}>평균 점수: {scoreAvg}</Text>

            {/* 나의 후기 */}
            {/*{myReview && myReview.length > 0 ? (
                <View style={styles.myReview}>
                    <Text style={styles.sectionTitle}>나의 후기</Text>
                    <Text>점수: {myReview[0].score}</Text>
                    <Text>날짜: {myReview[0].reviewDate}</Text>
                    <Text>후기: {myReview[0].comment}</Text>
                </View>
            ) : (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="후기를 입력하세요..."
                        value={myReview}

                    />
                    <Button title="저장" onPress={reviewSave}/>
                </View>
            )}*/}

            {/* 후기 등록 */}
            <ReviewInput
                contentsId={item.id}
                onReviewSaved={() => fetchData()}
            />

            {/* 전체 리뷰 리스트 */}
            <Text style={styles.sectionTitle}>전체 리뷰</Text>
            {reviewData && reviewData.length > 0 ? (
                <FlatList
                    data={reviewData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.reviewItem}>
                            <Text style={styles.userName}>{item.usrName}</Text>
                            <Text>점수: {item.score}</Text>
                            <Text>날짜: {item.reviewDate}</Text>
                            <Text>후기: {item.comment}</Text>
                        </View>
                    )}
                    scrollEnabled={false} // ✅ `ScrollView`가 있으므로 `FlatList` 자체 스크롤 비활성화
                />
            ) : (
                <Text style={styles.noReview}>등록된 후기가 없습니다.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    contentContainer: { padding: 20 }, // ✅ 내부 요소 정렬을 위한 스타일 추가
    image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold' },
    author: { fontSize: 18, color: 'gray', marginBottom: 10 },
    score: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
    myReview: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5, marginBottom: 10 },
    noReview: { fontSize: 16, color: 'gray', marginBottom: 10 },
    reviewItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    userName: { fontWeight: 'bold' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
});
