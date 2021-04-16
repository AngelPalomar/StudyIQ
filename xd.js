import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Button,
	Platform,
	SafeAreaView,
	Text,
	TextInput,
} from 'react-native';

/*
Importamos las librerías para acceder a las notificacionesPUSH
LAS NOTIFICACIONES POER SERVICIO DE FCM Y APNS SOLO ESTÁN DISPONIBLES 
EN DISPOSITIVOS FÍSICOS (NO FUNCIONA EN EMULADORES/SIMULADORES)
*/
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import styles from './../../styles/estilos';

/* 
Implementar un handler (metodo que indique que hacer [interface])
cuando existan notificaciones nuevas
*/
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

const Notificaciones = (props) => {
	/*
    Los hooks son funciones que me permiten
    realizar operaciones especiales y manipular el 
    ciclo de vida de mi app (cuando inicia, cuando se actualiza, 
    cuando se minimiza,cuando se cierra, etc.).
    useState, useEffect, useLayoutEffect, useFocusEffect, etc.
    Los hooks arriba mencionados permiten realizar diversas acciones 
    y generan un cambio en o los valores de estado y componentes del 
    Screen y su jerarquía
    useReff es un Hook que permite generar contenido mutable (un cambio)
    no solo en su contenido, tambien en su estructura, useReff no genera
    nuevos elementos de un estado, usa una referencia al mismo
    */

	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef(); //recibir
	const responseListener = useRef(); //enviar

	const [titulo, setTitulo] = useState('');
	const [token, setToken] = useState('');
	const [mensaje, setMensaje] = useState('');

	/*
    Metodo que pida el permiso de enviar/recibir notificaciones
    push y suscribirse a dichas notificaciones
    */
	const registerForPushNotificationsAsync = async () => {
		let token; //Inicializamos un token vacío

		//Solo aplicamos las notificaciones a dispositivos físicos
		if (Constants.isDevice) {
			//Pedimos permiso
			const {
				status: existingEstatus,
			} = await Notifications.getPermissionsAsync();
			let finalStatus = existingEstatus;
			if (existingEstatus !== 'granted') {
				const {
					status,
				} = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}

			if (finalStatus !== 'granted') {
				Alert.alert(
					'ERROR',
					'Se requiere el permiso'
				);
				return;
			}

			//Tomamos el token  que nos genere el servicio
			token = (
				await Notifications.getExpoPushTokenAsync()
			).data;
			console.log(token);
		}

		//Si no estamos en un dispositivo real
		else {
			Alert.alert(
				'ERROR',
				'Notificaciones push sólo disponibles en dispositivos físicos'
			);
		}

		//Si el dispositivo es Android, indicar que usaremos
		//el canal de distribución estandar (default)
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync(
				'default',
				{
					name: 'default',
					importance:
						Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: '#FF231f7c',
				}
			);
		}

		return token;
	};

	/*
    Creamos una AF que nos pormite enciar una notificacion push al token indicado
    */
	const sendPushNotification = async (token) => {
		/*
        Para enviar una notificacion por medio del servicio web 
        necesitamos empaquetar los datos del mensaje en una constante 
        con las siguientes claves:
        to --------- Token del receptor de la notificacion
        sound ------ Si la notificacion emitirá una alerta auditiva
        title ------ Titulo de la notificación
        body ------- Mensaje de la notificación
        data ------- Valores adicionales de la notificación
        URL del servicio: https://exp.host/--/api/v2/push/send
        */
		const message = {
			to: token,
			sound: 'default',
			title: titulo,
			body: mensaje,
			data: {
				autor: 'RZZ',
				autorEmail: 'raul.zavaletazea@gmail.com',
			},
		};

		/*
        Invocamos al servicio
        */
		await fetch(
			'https://exp.host/--/api/v2/push/send',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Accept-encoding': 'gzip, deflate',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(message),
			}
		);
	};

	/*Creamos una función que no está enganchada y solo se ejecuta 
    una vez, pero en el momento en el que esta Screen deje de ser 
    el foco principal, enviamos las notificaciones a segundo plano
    */
	useEffect(() => {
		registerForPushNotificationsAsync().then((token) =>
			setExpoPushToken(token)
		);

		notificationListener.current = Notifications.addNotificationReceivedListener(
			(notification) => setNotification(notification)
		);

		return () =>
			Notifications.removeNotificationSubscription(
				notificationListener
			);
	}, []);

	return (
		<SafeAreaView style={{ margin: 20 }}>
			<Text>Notificaciones.js</Text>
			<Text>{expoPushToken}</Text>

			<TextInput
				placeholder='Expo Token'
				keyboardType='default'
				style={styles.input}
				value={token}
				onChangeText={(val) => {
					setToken(val);
				}}
			/>

			<TextInput
				placeholder='Titulo de la notificación'
				keyboardType='default'
				style={styles.input}
				value={titulo}
				onChangeText={(val) => {
					setTitulo(val);
				}}
			/>

			<TextInput
				placeholder='Mensaje'
				keyboardType='default'
				style={styles.input}
				value={mensaje}
				onChangeText={(val) => {
					setMensaje(val);
				}}
			/>

			<Button
				title='Enviar notificación'
				onPress={() => {
					sendPushNotification(token);
				}}
				color='black'
			/>
		</SafeAreaView>
	);
};

export default Notificaciones;