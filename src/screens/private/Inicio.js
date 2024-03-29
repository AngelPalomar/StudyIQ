import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import Snackbar from 'react-native-snackbar-component';
import firebase from './../../database/firebase';
import MisDatos from './profile/MisDatos';
import Buscador from '../private/Buscador'
import Mensajes from './profile/Mensajes';
import Catalogo from './../private/Catalogo';
import Asesorias from './VerAsesorias'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
const Inicio = (props) => {
	const [snack, setSnack] = useState(false);
	useFocusEffect(() => {
		props.navigation.dangerouslyGetParent().setOptions({
			title: 'Inicio',

		});
	});
	useEffect(() => {

		const usuarioFirebase = firebase.auth.currentUser;
		if (!usuarioFirebase.emailVerified) {
			setSnack(true);
		}
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>

			<Snackbar
				visible={snack}
				textMessage='Hola Snack'
				backgroundColor='#dc3545'
				textMessage='Cuenta sin verificar'
				actionText='Ok'
				actionHandler={() => {
					setSnack(false);
				}}
			/>
			<Tab.Navigator
				initialRouteName='Catalogo'
				tabBarOptions={{
					showLabel: false,
					activeBackgroundColor: '#CFD9E0',
					style: { backgroundColor: '#fff' },
				}}
			>
				<Tab.Screen
					name='Catalogo'
					component={Catalogo}
					options={{
						tabBarIcon: () => (
							<Image
								source={require('../../../assets/images/home-512.png')}
								style={{
									width: 30,
									height: 30,
									alignSelf: 'center',
									marginVertical: 15,
									overflow: 'hidden',
								}}
							></Image>
						),
					}}
				/>
				<Tab.Screen
					name='Buscador'
					component={Buscador}
					options={{
						tabBarIcon: () => (
							<Image
								source={require('../../../assets/images/search-512.png')}
								style={{
									width: 30,
									height: 30,
									alignSelf: 'center',
									marginVertical: 15,
									overflow: 'hidden',
								}}
							></Image>
						),
					}}
				/>
				<Tab.Screen
					name='Mensajes'
					component={Mensajes}
					options={{
						tabBarIcon: () => (
							<Image
								source={require('../../../assets/images/chat-512.png')}
								style={{
									width: 30,
									height: 30,
									alignSelf: 'center',
									marginVertical: 15,
									overflow: 'hidden',
								}}
							></Image>
						),
					}}
				/>

				<Tab.Screen
					name='VerAsesorias'
					component={Asesorias}
					options={{
						tabBarIcon: () => (
							<Image
								source={require('../../../assets/images/student-512.png')}
								style={{
									width: 30,
									height: 30,
									alignSelf: 'center',
									marginVertical: 15,
									overflow: 'hidden',
								}}
							></Image>
						),
					}}
				/>

				<Tab.Screen
					name='MisDatos'
					component={MisDatos}
					options={{
						tabBarIcon: () => (
							<Image
								source={require('../../../assets/images/draw.png')}
								style={{
									width: 22,
									height: 22,
									alignSelf: 'center',
									marginVertical: 15,
									overflow: 'hidden',
								}}
							></Image>
						),
					}}
				/>
			</Tab.Navigator>
		</SafeAreaView>

	);
};

export default Inicio;
