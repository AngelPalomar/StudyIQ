import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, View, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import firebase from './../../../database/firebase';
const Tab = createBottomTabNavigator();

const Buscador = (props) => {
	const [usuarioFirebase, setUsuarioFirebase] = useState(
		{}
	);
	const [docUsuario, setDocUsuario] = useState({});
	useEffect(() => {
		/* tomamos los datos del usuario que ha iniciado sesión */
		setUsuarioFirebase(firebase.auth.currentUser);

		/* invocamos la consulta */
		getDocUsuario(firebase.auth.currentUser.uid);
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

	return (
		<View style={{ flex: 1 }}>
			<View style={{
				flex: 1,
				alignItems: 'center',
			}}>
				<ImageBackground
					source={require('./../../../../assets/images/cf.jpeg')}
					style={{
						width: '100%',
						paddingBottom: 155,
						alignItems: 'center',
					}}
				>
				</ImageBackground>
				<Image
						source={require('./../../../../assets/images/profile.png')}
						style={{
							width: 100,
							height: 100,
							overflow: 'hidden',
							marginTop: -55,
							borderRadius: 55,
							backgroundColor: '#000',
						}}
					/>
					<Text
						style={{
							fontSize: 18,
							marginBottom: 5,
							color: '#000',
						}}
					>
						{docUsuario.nombres}{' '}{docUsuario.apellidos}
					</Text>
					<Text
						style={{
							fontSize: 11,
							marginBottom: 5,
							color: '#000',
						}}>
						{docUsuario.email}
					</Text>
			</View>
			{// xd
			}
		</View>
	);
};

export default Buscador;
