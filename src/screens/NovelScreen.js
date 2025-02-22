import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function NovelScreen() {
    return (
        <View style={styles.center}>
            <Text>웹소설 화면</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
