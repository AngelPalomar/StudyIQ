import React from 'react';
import { Alert, Button, Text, View, TouchableHighlight,} from 'react-native';
import firebase from './../database/firebase';
import styles from '../../styles/start.scss';

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
			style  = {styles.bg}
		>
			
			<TouchableHighlight title='Login'
			style = {styles.button}
				onPress={() => {
					props.navigation.navigate('Login');
				}}>
				<Text style = {styles.text__color}>Login touch</Text>
			</TouchableHighlight>

			<TouchableHighlight title='Registro'
			style = {styles.button}
				onPress={() => {
					props.navigation.navigate('Registro');
				}}>
				<Text style = {styles.text__color}>Registro touch</Text>
			</TouchableHighlight>

			<TouchableHighlight title='Firestore'
			style = {styles.button}
				onPress={crearUsuarioFS}>
				<Text style = {styles.text__color}>Insertar firestore</Text>
			</TouchableHighlight>

			
		</View>
	);
};

export default Inicio;
