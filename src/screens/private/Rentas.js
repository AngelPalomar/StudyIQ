import { useFocusEffect } from '@react-navigation/core';
import React from 'react';
import { Text, View } from 'react-native';

const Rentas = (props) => {
	useFocusEffect(() => {
		//Modificamos las opciones del HEader del Stack (padre)
		props.navigation.dangerouslyGetParent().setOptions({
			title: 'Rentas',
		});
	});

	return (
		<View>
			<Text>Rentas.js</Text>
		</View>
	);
};

export default Rentas;
