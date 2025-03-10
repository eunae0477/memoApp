import React from "react";
import { FlatList, Text, View } from "react-native";
import ReviewItem from "./ReviewItem";

export default function ReviewList({ reviewData, fetchData, setReviewForEdit }) {
    return (
        <>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>전체 리뷰</Text>
            {reviewData && reviewData.length > 0 ? (
                <FlatList
                    data={reviewData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <ReviewItem
                                                    item={item}
                                                    fetchData={fetchData}
                                                    setReviewForEdit={setReviewForEdit}/>
                                }
                    scrollEnabled={false}
                />
            ) : (
                <Text style={{ fontSize: 16, color: "gray", marginBottom: 10 }}>등록된 후기가 없습니다.</Text>
            )}
        </>
    );
}
