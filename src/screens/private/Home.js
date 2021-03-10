import React, { useEffect, useLayoutEffect } from 'react';
import { Alert, BackHandler, TouchableOpacity, Image,View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/core';
import Inicio from './Inicio';
import Perfil from './Perfil';
import Catalogo from './Catalogo';
import Sidebar from './../../components/Sidebar';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { HeaderBackground } from '@react-navigation/stack';
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
			headerStyle: {
				backgroundColor: '#fff'
			  },
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
				>
					<Image
						source={require('../../../assets/images/save.png')}
						style={{
							width: 20,
							height: 20,
							alignSelf: 'center',
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
