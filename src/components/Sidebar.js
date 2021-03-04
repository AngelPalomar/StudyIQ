import React,{ useEffect, useState } from 'react';
import { ImageBackground, Text, View } from 'react-native';
import firebase from './../database/firebase';
import {
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';

import {
	AntDesign,
	MaterialIcons,
} from '@expo/vector-icons';
const Sidebar = (props) => {
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
		<View
			style={{
				flex: 1,
			}}
		>
			<ImageBackground
				source={require('./../../assets/images/sidebar4.jpg')}
				style={{
					width: '100%',
					paddingBottom: 30,
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
							source={require('./../../assets/images/avatar.png')}
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
						</View>
					</View>
				</View>
			</ImageBackground>
			<DrawerContentScrollView {...props}>
				<DrawerItem
					icon={() => (
						<AntDesign
							name='home'
							size={20}
							color='#000'
						/>
					)}
					label='Inicio'
					onPress={() => {
						props.navigation.navigate(
							'InicioUser'
						);
					}}
				/>

				<DrawerItem
					icon={() => (
						<AntDesign
							name='user'
							size={20}
							color='#000'
						/>
					)}
					label='Perfíl'
					onPress={() => {
						props.navigation.navigate('Perfil');
					}}
				/>

				<DrawerItem
					icon={() => (
						<MaterialIcons
							name='local-movies'
							size={20}
							color='#000'
						/>
					)}
					label='Catálogo'
					onPress={() => {
						props.navigation.navigate(
							'Catalogo'
						);
					}}
				/>
			</DrawerContentScrollView>
		</View>
	);
};

export default Sidebar;
