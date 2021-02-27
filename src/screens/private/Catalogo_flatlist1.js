import { useFocusEffect } from '@react-navigation/core';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const Catalogo = (props) => {
	useFocusEffect(() => {
		//Modificamos las opciones del HEader del Stack (padre)
		props.navigation.dangerouslyGetParent().setOptions({
			title: 'Catálogo',
		});
	});

	/*
    Arreglode valores
    */
	const arreglo = [1, 2, 3, 4, 5, 6];

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				/** El origen de la información a mostrar en la lista */
				data={arreglo}
				/** El diseño de la presentación de los datos de la lista por cada elemento  */

				// renderItem={(item) => {
				// 	return <Text> {item.item} </Text>;
				// }}

				renderItem={(item) => (
					<>
						<Text> {item.item} </Text>
						<Text> {item.index} </Text>
						<Text> {'\n'} </Text>
					</>
				)}
			/>
		</View>
	);
};

export default Catalogo;
