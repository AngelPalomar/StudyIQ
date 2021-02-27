import React from 'react';
import { Alert, Button, Text, View } from 'react-native';
import firebase from './../database/firebase';

/** props es una referencia a las variables, const, obj, componentes, etc
 * que comparte el componente padre conmigo
 */
const Inicio = (props) => {
	/*
    Creamos una funcion flecha anonima que permita 
    crear un documento usuario en la colección usuarios
    */
	const crearUsuarioFS = async () => {
		try {
			//Usamos el metodo asincrono colleccion.add
			const usuario = {
				nombre: 'Raul',
				apellido: 'Zavaleta',
			};

			const usuarioFS = await firebase.db
				.collection('usuarios')
				.add(usuario);

			Alert.alert(
				'Practica 4',
				`ID instertado:\n\n${usuarioFS.id}\n\nINSERTAR DESDE EL FORMULARIO DE REGISTRO`,
				[{ text: 'Pues ya que', onPress: null }],
				{ cancelable: false }
			);
		} catch (e) {
			console.warn(e);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Button
				title='Login'
				onPress={() => {
					/** PAra navegar entre ventanas
					 * usamos la propiedad navigation y la funcion
					 * navigate('_SOBRENOMBRE_');
					 */
					props.navigation.navigate('Login');
				}}
			/>

			<Button
				title='Registro'
				onPress={() => {
					props.navigation.navigate('Registro');
				}}
			/>

			<Button
				title='Insertar en firestore'
				onPress={crearUsuarioFS}
			/>
		</View>
	);
};

export default Inicio;
