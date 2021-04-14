import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, View, Image, TouchableHighlight } from 'react-native';
import firebase from './../database/firebase';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import * as Location from "expo-location";
import styles from '../../styles/login.scss';
import estilos from '../styles/estilos';
const Sidebar = (props) => {
	const [position, setPosition] = useState('');
	const [locationStatus, setLocationStatus] = useState(null);
	const [usuarioFirebase, setUsuarioFirebase] = useState(
		{}
	);
	const [docUsuario, setDocUsuario] = useState({});
	const [tem, setTem] = useState([]);
	useEffect(() => {
		/* tomamos los datos del usuario que ha iniciado sesión */
		setUsuarioFirebase(firebase.auth.currentUser);

		/* invocamos la consulta */
		getDocUsuario(firebase.auth.currentUser.uid);
	}, []);
	useEffect(() => {
		const reference = firebase.xd.ref('/Sensores').on('value', querySnapShot => {
			setTem(querySnapShot.val() ? querySnapShot.val() : {})
		});
	}, [setTem])

	useEffect(() => {
		entryPoint();
	}, []);

	const getDocUsuario = async (uid) => {
		try {

			const query = await firebase.db.collection('usuarios').where('authId', '==', uid).get();
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
	};
	const getPosition = async () => {
		try {
			const { coords } = await Location.getCurrentPositionAsync({});
			setPosition(coords);
		} catch (error) {
			console.log("getPosition -> error", error);
			setPosition(null);
		}
	};
	const entryPoint = async () => {
		try {
			const isEnabled = await Location.enableNetworkProviderAsync();
			Location.enableNetworkProviderAsync()
				.then(() => {
					setLocationStatus('accepted');
				})
				.catch(() => {
					setLocationStatus('rejected');
				});
			const { status } = await Location.requestPermissionsAsync();
			if (status === "granted") {
				getPosition();
			}
		} catch (error) {
			console.log("getPermissionAndPosition -> error", error);
		}
	};
	console.log(position);
	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<ImageBackground
				style={{
					width: '100%',
					height: '40%',
					paddingBottom: 30,
					backgroundColor: '#273469'
				}}
			>
				<Text
					style={{
						marginTop: 20,
						width: '100%',
						textAlign: 'center',
						fontSize: 18,
						fontWeight: '500',
						textDecorationLine: 'underline',
						color: '#fff',
						fontWeight: 'bold'
					}}
				>
					StudyIQ
				</Text>

				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							flex: 1,
							alignItems: 'center',
						}}
					>
						<ImageBackground
							source={typeof docUsuario.avatar !== 'undefined' ? { uri: docUsuario.avatar } : null}
							style={{
								width: 60,
								height: 60,
								overflow: 'hidden',
								marginTop: 20,
								borderRadius: 30,
								backgroundColor: '#666',
							}}
						/>
					</View>

					<View style={{ flex: 2 }}>
						<View
							style={{
								flex: 1,
								marginLeft: 10,
								marginTop: 20,
							}}
						>
							<Text
								style={{
									fontSize: 16,
									marginBottom: 5,
									color: '#fff',
									fontWeight: 'bold'
								}}
							>
								{docUsuario.nombres}{' '}{docUsuario.apellidos}
							</Text>
							<Text
								style={{
									fontSize: 13,
									marginBottom: 5,
									color: '#fff',
									fontWeight: 'bold'
								}}>
								{docUsuario.email}
							</Text>
							<Text
								style={{
									fontSize: 13,
									marginBottom: 5,
									color: '#fff',
									fontWeight: 'bold'
								}}>
								Humedad:{tem.humedad} %

							</Text>
							<Text
								style={{
									fontSize: 13,
									marginBottom: 5,
									color: '#fff',
									fontWeight: 'bold'
								}}>
								Temperatura:{tem.temperatura}°C

							</Text>
							<Text
								style={{
									fontSize: 13,
									marginBottom: 5,
									color: '#fff',
									fontWeight: 'bold'
								}}>
								Tu ubicación actual
						</Text>
							<Text
								style={{
									fontSize: 13,
									marginBottom: 5,
									color: '#fff',
									fontWeight: 'bold'
								}}>
								Latitude: {position.latitude}
							</Text>
							<Text
								style={{
									fontSize: 13,
									marginBottom: 5,
									color: '#fff',
									fontWeight: 'bold'
								}}>
								Longitude: {position.longitude}
							</Text>

						</View>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

export default Sidebar;