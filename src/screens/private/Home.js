import React, { useEffect, useLayoutEffect } from 'react';
import {
	Alert,
	BackHandler,
	TouchableOpacity,
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/core';

import Inicio from './Inicio';
import Perfil from './Perfil';
import Catalogo from './Catalogo';
import Rentas from './Rentas';
import Sidebar from './../../components/Sidebar';
import CerrarSesion from './CerrarSesion';

import { Entypo, AntDesign } from '@expo/vector-icons';

/*
Para crear un Drawer necesitamos una constante 
donde guardaremos las referencias a cada item del 
contenido de Screens
*/
const Drawer = createDrawerNavigator();

const Home = (props) => {
	//Alerta que confirma la acción de "salir"
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

	/*
    Ciclo de vida de un Componente Grágico de RN
    Antes de visualizarse
    Al modificar el VDOM
    Antes de destruirse
    En su ejecución

    Efectos ===== Realizar algún cambio en la UI en algún momento
    useEffect ======== El más común para modificar el contenido de la UI, 
    con componenentes nuevos

    useLayoutEffect ==== Cuando modificamos elementos del VDOM actual
    */

	//Cambiamos el icono de la izquiera del ancabezado del Navigator
	//Este efecto solo se ejecutará la primera vez que se carga
	//el componente Home
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
					<Entypo name='menu' size={25} />
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
					<AntDesign name='poweroff' size={20} />
				</TouchableOpacity>
			),
		});
	}, []);

	//Efecto para sobreescribir el funcionamiento del boton back
	//este código sólo se ejecutará la primera vez que cargue
	//el componente
	useEffect(() => {
		//Vincular el evento back del SO a mi alerta Back
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		//Al salir de Home eliminamos el evento del backbutton del SO
		return () => backHandler.remove();
	}, []);

	return (
		/** Creamos un contenedor de los items del Drawer */
		<Drawer.Navigator
			initialRouteName='Inicio'
			drawerType='front'
			openByDefault={false}
			drawerContent={() => <Sidebar {...props} />}
		>
			{/** Por cada item que necesite en el Drawer
			 * agrego un Screen
			 */}
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

			<Drawer.Screen
				name='Rentas'
				component={Rentas}
			/>
		</Drawer.Navigator>
	);
};

export default Home;
