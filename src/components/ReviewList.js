import React from "react";
import {FlatList, Text} from "react-native";
import ReviewItem from "./ReviewItem";

export default function ReviewList({ reviewData, getReviewList, setReviewForEdit, setReviewData }) {
    return (
        <>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>전체 리뷰</Text>
            {reviewData && reviewData.length > 0 ? (
                <FlatList
                    data={reviewData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <ReviewItem
                                                    item={item}
                                                    getReviewList={getReviewList}
                                                    setReviewForEdit={setReviewForEdit}
                                                    setReviewData={setReviewData}/>
                                }
                    scrollEnabled={false}
                />
            ) : (
                <Text style={{ fontSize: 16, color: "gray", marginBottom: 10 }}>등록된 후기가 없습니다.</Text>
            )}
        </>
    );
}
