import { useFocusEffect } from '@react-navigation/core';
import React from 'react';
import { Text, View } from 'react-native';

const Inicio = (props) => {
	/*
    Efecto qu actualice el título del Stack Navigator  
    desde los componentes Drawer Hijos
    Esto se tiene que actualizar cada vez aue cambiamos de Drawer.Screnn
     */
	useFocusEffect(() => {
		//Modificamos las opciones del HEader del Stack (padre)
		props.navigation.dangerouslyGetParent().setOptions({
			title: 'Inicio',
		});
	});

	return (
		<View>
			<Text>Inicio.js</Text>
		</View>
	);
};

export default Inicio;
