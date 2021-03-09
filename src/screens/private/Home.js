import React, { useEffect, useLayoutEffect } from 'react';
import { Alert, BackHandler, TouchableOpacity, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/core';
import Inicio from './Inicio';
import Perfil from './Perfil';
import Catalogo from './Catalogo';
import Sidebar from './../../components/Sidebar';
import CerrarSesion from './CerrarSesion';
import { Entypo, AntDesign } from '@expo/vector-icons';
const Drawer = createDrawerNavigator();

const Home = (props) => {
	const backAction = () => {
		Alert.alert(
			'¡Espera!',
			'¿Realmende deseas salir?',
			[
				{
					text: 'Cancelar',
					onPress: () => null,
					style: 'cancel',
				},
				{
					text: 'Si, salir',
					onPress: () => {
						/*
							Eliminamos el historial de 
							Stack
							*/
						props.navigation.reset({
							index: 0,
							routes: [{ name: 'Login' }],
						});
						props.navigation.navigate('Login');
					},
				},
			],
			{ cancelable: false }
		);
		return true;
	}; //ALERTA SALIR
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					style={{
						paddingLeft: 10,
						paddingVertical: 10,
						paddingRight: 30,
					}}
					onPress={() => {
						props.navigation.dispatch(
							DrawerActions.toggleDrawer()
						);
					}}
				>
					<Image
						source={require('../../../assets/images/list.png')}
						style={{
							width: 15,
							height: 15,
							alignSelf: 'center',
							marginVertical: 15,
							overflow: 'hidden',
						}}
					></Image>
				</TouchableOpacity>
			),
			headerRight: () => (
				<TouchableOpacity
					style={{
						paddingVertical: 10,
						paddingLeft: 30,
						paddingRight: 10,
					}}
					onPress={backAction}
				>
					<Image
						source={require('../../../assets/images/off.png')}
						style={{
							width: 15,
							height: 15,
							alignSelf: 'center',
							marginVertical: 15,
							overflow: 'hidden',
						}}
					></Image>
				</TouchableOpacity>
			),
		});
	}, []);
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);
		return () => backHandler.remove();
	}, []);

	return (
		<Drawer.Navigator
			initialRouteName='Inicio'
			drawerType='front'
			openByDefault={false}
			drawerContent={() => <Sidebar {...props} />}
		>
			<Drawer.Screen
				name='InicioUser'
				component={Inicio}
			/>

			<Drawer.Screen
				name='Perfil'
				component={Perfil}
			/>

			<Drawer.Screen
				name='Catalogo'
				component={Catalogo}
			/>
		</Drawer.Navigator>
	);
};

export default Home;
