import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function DetailScreen({ route }) {
    const { item } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 20 },
    image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold' },
    author: { fontSize: 18, color: 'gray', marginBottom: 10 },
    description: { fontSize: 16, textAlign: 'center' },
});
