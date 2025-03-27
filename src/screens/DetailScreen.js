import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import axios from "axios";
import CONFIG from "../../Config";
import ContentInfo from "../components/ContentInfo";
import ReviewInput from "../components/ReviewInput";
import ReviewList from "../components/ReviewList";

export default function DetailScreen({ route }) {
    const { item } = route.params;

    const [reviewData, setReviewData] = useState([]);
    const [scoreAvg, setScoreAvg] = useState(0.0);
    const [reviewForEdit, setReviewForEdit] = useState(null);   // 수정할 리뷰의 데이터
    const [myScore, setMyScore] = useState(0);

    const getReviewList = async () => {
        try {
            // 후기 리스트 가져오기
            const reviewListResponse = await axios.get(CONFIG.API_BASE_URL+"/review-list", {
                params: {
                    contentsId: item.id,
                    usrId: CONFIG.LOGIN_ID},
            });
            setReviewData(reviewListResponse.data);
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

    const getMyScore = async () => {
        try {
            // 나의 평가 점수 가져오기
            const myScoreData = await axios.get(CONFIG.API_BASE_URL+"/my-score", {
                params: {
                    contentsId: item.id,
                    usrId: CONFIG.LOGIN_ID},
            });

            if (myScoreData.data > 0) {
                setMyScore(myScoreData.data);
            } else {
                setMyScore(0.0);
            }
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    }

    useEffect(() => {
        getReviewList();
        getScoreAvg();
        getMyScore();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >

            {/* 컨텐츠 정보*/}
            <ContentInfo item={item} scoreAvg={scoreAvg} myScore={myScore} setMyScore={setMyScore} getScoreAvg={getScoreAvg}/>

            {/* 리뷰 등록 */}
            <ReviewInput
                contentsId={item.id}
                onReviewSaved={() => getReviewList()}
                reviewForEdit={reviewForEdit}
                setReviewForEdit={setReviewForEdit}
            />

            {/* 전체 리뷰 리스트 */}
            <ReviewList
                reviewData={reviewData}
                getReviewList={getReviewList}
                setReviewForEdit={setReviewForEdit}
                setReviewData={setReviewData}
            />
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
    }
});
