import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function ContentInfo({ item, scoreAvg }) {
    return (
        <View>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.score}>평균 점수: {scoreAvg}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: "bold" },
    author: { fontSize: 18, color: "gray", marginBottom: 10 },
    score: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
});