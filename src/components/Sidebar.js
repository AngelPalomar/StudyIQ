import React,{ useEffect, useState } from 'react';
import { ImageBackground, Text, View,Image } from 'react-native';
import firebase from './../database/firebase';
import {DrawerContentScrollView,DrawerItem,} from '@react-navigation/drawer';

const Sidebar = (props) => {

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
				style={{
					width: '100%',
					paddingBottom: 50,
					backgroundColor:'#273469'
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
							source={typeof docUsuario.avatar !== 'undefined' ? { uri: docUsuario.avatar } :null}
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
							Humedad:{  tem.humedad} %
							
							</Text>
							<Text 
							style={{
								fontSize: 13,
								marginBottom: 5,
								color: '#fff',
								fontWeight: 'bold'
							}}>
							Temperatura:{ tem.temperatura}°C
							
							</Text>
						</View>
					</View>
				</View>
			</ImageBackground>
			<DrawerContentScrollView {...props}>
				<DrawerItem
					icon={() => (
						<Image
							source={require('../../assets/images/house1.png')}
							style={{
								width: 30,
								height: 30,
								alignSelf: 'center',
								marginVertical: 15,
								overflow: 'hidden',
							}}
						></Image>
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
						<Image
							source={require('../../assets/images/user.png')}
							style={{
								width: 30,
								height: 30,
								alignSelf: 'center',
								marginVertical: 15,
								overflow: 'hidden',
							}}
						></Image>
					)}
					label='Perfíl'
				/>
				<DrawerItem
					icon={() => (
						<Image
							source={require('../../assets/images/user.png')}
							style={{
								width: 30,
								height: 30,
								alignSelf: 'center',
								marginVertical: 15,
								overflow: 'hidden',
							}}
						></Image>
					)}
					label='Subir publicaciones '
				/>
			</DrawerContentScrollView>
		</View>
	);
};

export default Sidebar;
