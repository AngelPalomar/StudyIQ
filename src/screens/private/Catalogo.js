import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	View,
} from 'react-native';
import Usuario from '../../components/Usuario';

const Catalogo = (props) => {
	//Estado que guarde el arreglo de objetos de laista de usuarios
	const [usuarios, setUsuarios] = useState([]);
	const [rcVisible, setRcVisible] = useState(true);

	useFocusEffect(() => {
		//Modificamos las opciones del Header del Stack (padre)
		props.navigation.dangerouslyGetParent().setOptions({
			title: 'Catálogo',
		});
	});


	/**
	 * Creamos una función asíncrona para tomar la lista de usuarios
	 */
	// const getUsuariosAsync = async function () { }
	// async function getUsuariosAsync() { }
	const getUsuariosAsync = async () => {
		//La palabra reservada await indica que el contenido de
		//una variable/constante está en espera de ser recibido
		//cumple la misma función que await (Pero no es callback)
		try {
			const response = await fetch(
				'https://reqres.in/api/users?per_page=12'
			);
			const json = await response.json();

			setUsuarios(json.data);
			setRcVisible(false);
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * Creamos un efecto que no esté enganchado a ningún componente
	 * (Solo se ejecute al inicio de la Screen)
	 */
	useEffect(() => {
		//Invocar al servicio de lista de usuarios
		//getUsuariosCallBack();

		setTimeout(() => {
			getUsuariosAsync();
		}, 3000);
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				style={{ margin: 15 }}
				//Indicar el estado de carga
				refreshControl={
					<RefreshControl
						refreshing={rcVisible}
					/>
				}
				data={usuarios}
				renderItem={(item) => (
					<Usuario datosUsuario={item.item} />
				)}
				keyExtractor={(item) => item.id.toString()}
			/>
		</View>
	);
};

export default Catalogo;
