import React, { useEffect, useState } from "react";
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from 'react-native';
import axios from "axios";
import CONFIG from "../../Config";
import {useFocusEffect} from "@react-navigation/native";

export default function RankList({typeCode, navigation}) {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(CONFIG.API_BASE_URL+"/contents-list", {
                params: { typeCode: typeCode },
            });
            setData(response.data);
        } catch (error) {
            console.error("데이터 가져오기 오류:", error);
        }
    };

    useFocusEffect( // ✅ 화면이 포커스될 때마다 리뷰 목록 갱신
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.box}
                        onPress={() => navigation.navigate('상세화면', { item })}
                    >
                        <Image source={{ uri: item.img }} style={styles.image} />
                        <Text>{item.title} - {item.author}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 80,
        height: 80,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
