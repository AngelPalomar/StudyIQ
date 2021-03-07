import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, Text, TextInput, View, TouchableHighlight } from 'react-native';
import firebase from './../database/firebase';
//Errores traducidos MY_CORE
import get_error from '../helpers/errores_es_mx';
import styles from '../../styles/login.scss';
import estilos from '../styles/estilos';
const Login = (props) => {
	const [docUsuario, setDocUsuario] = useState({});
	const [email, setEmail] = useState('2020367017@uteq.edu.mx');
	const [pin, setPin] = useState('12345678')
	// States para mostrar/ociultar spinner
	const [btnVisible, setBtnVisible] = useState(true);
	const [aiVisible, setAiVisible] = useState(false);
	// State para habilitar/deshabilitar textInput's
	const [tiHab, setTiHab] = useState(true);
	// Funcion que valida el formulario de tipo async para las peticiones 

	useEffect(() => {
		/* invocamos la consulta */
		getDocUsuario();
	}, 
	[]);
	const getDocUsuario = async () => {
		try {
			const query = await firebase.db.collection('usuarios').where('email', '==', email).get();
			if (!query.empty) {
				const snapshot = query.docs[0];
				setDocUsuario({
					...snapshot.data(),
					id: snapshot.id,
				});
			}
		} catch (e) {
			console.warn(e.toString());
		}
	}


	const validaLogin = async () => {

		//Validamos email
		if (email.length == 0 || email.length > 2) {
			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if (reg.test(email) == false) {
				Alert.alert(
					'ERROR',
					'Correo incorrecto',
					[
						{
							text: 'Corregir',
							onPress: () => { setEmail(''); },
						},
					],
					{ cancelable: false }
				);
				return;
			}
		}
		//validamos que su pin sea de 8
		if (pin.length !== 8) {
			Alert.alert('ERROR', 'Pin incorrecto',
				[
					{
						text: 'Corregir',
						onPress: () => { setPin(''); }
					},
				],
				{ cancelable: false }
			);
			return;
		}
		//Si la validación es correcta llegamos aqui
		setAiVisible(true);
		setBtnVisible(false);
		setTiHab(false);
		let mensaje = '';
		if (docUsuario.activo == false) {
			Alert.alert('Tu correo ah sido baneado', mensaje, [
				{
					text: '!OK! ',
					onPress: () => {
						setAiVisible(false);
						setBtnVisible(true);
						setTiHab(true);
					},
				},
			]);
			return;
		}
		//Interacion con firebase 
		try {
			const usuarioFirebase = await firebase.auth.signInWithEmailAndPassword(email, pin);
			mensaje += usuarioFirebase.user.emailVerified ? '...' : ',Su correo sigue sin verificarse ';

			//validacion para comprobar si valido su cuenta 

			console.log(docUsuario.activo);
			if (usuarioFirebase.user.emailVerified == true) {

				Alert.alert('Bienvenido a StudyIQ', mensaje, [
					{
						text: 'Ingresar',
						onPress: () => {
							setAiVisible(false);
							setBtnVisible(true);
							setTiHab(true);
							props.navigation.navigate('Home');
						},
					},
				]);
			}
			if (usuarioFirebase.user.emailVerified == false) {
				Alert.alert('Bienvenido a StudyIQ', mensaje, [
					{
						text: 'Continuar ',
						onPress: () => {
							setAiVisible(false);
							setBtnVisible(true);
							setTiHab(true);
							props.navigation.navigate('Home');
						},
					},
				]);
			}


		} catch (e) {
			Alert.alert('ERROR', get_error(e.code), [
				{
					text: 'Corregir',
					onPress: () => {
						setAiVisible(false);
						setBtnVisible(true);
						setTiHab(true);
					},
				},
			]);
		}
	};
	return (
		<View
			style={styles.bg}
		>
			<Text style = {styles.title}>Inicia sesión a StudyIQ</Text>
			<TextInput
				style = {estilos.input}
				placeholder='Correo electronico'
				keyboardType='default'
				maxLength={150}
				onChangeText={(val) => setEmail(val)}
				value={email}
				editable={tiHab}
			/>
			<TextInput
				style = {estilos.input}
				placeholder='Pin (8 dígitos)'
				keyboardType='default'
				secureTextEntry
				maxLength={8}
				onChangeText={(val) => setPin(val)}
				value={pin}
				editable={tiHab}
			/>
			<ActivityIndicator
				color='#000'
				size='large'
				style={{ display: aiVisible ? 'flex' : 'none', }} />
			<View
				style={{ display: btnVisible ? 'flex' : 'none', }}>

				<TouchableHighlight onPress={validaLogin} style = {styles.button__main}>
					<Text style = {styles.text__color}>
						Continuar
					</Text>
				</TouchableHighlight>
			</View>

			
			<View style = {estilos.bottom2 }>
				
				<Text> ¿No tienes cuenta?</Text>

				<TouchableHighlight style = {styles.button} onPress={() => { props.navigation.navigate('Registro'); }}>

				<Text style = {styles.text__color_two}>Registrate aquí</Text>

				</TouchableHighlight > 

			</View>
				
		</View>
	);
};

export default Login;
