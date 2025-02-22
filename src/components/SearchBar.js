import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function SearchBar() {
    return (
        <View style={styles.searchBar}>
            <TextInput placeholder="검색" style={styles.input}/>
            <Ionicons name="search" size={24} color="black"/>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        height: 40,
    },
    input: {flex: 1, fontSize: 16},
});
