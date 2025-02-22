import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.center}>
      <Text>검색</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
