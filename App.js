import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import estilosSass from './styles/Start.scss';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Study IQ xd</Text>
      <StatusBar style="auto" />
      <Text style={estilosSass.xd}> si funciona los estilos de sass</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
