import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RankList from '../components/RankList';

export default function HomeScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>웹툰 순위</Text>
            <RankList typeCode="B1" navigation={navigation}/>
            <Text style={styles.sectionTitle}>웹소설 순위</Text>
            <RankList typeCode="B2" navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16, backgroundColor: '#fff'},
    sectionTitle: {fontSize: 18, fontWeight: 'bold', marginVertical: 10},
});
