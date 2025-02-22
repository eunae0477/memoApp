import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyPageScreen() {
  return (
    <View style={styles.center}>
      <Text>마이페이지</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
