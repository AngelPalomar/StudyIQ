import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import Snackbar from 'react-native-snackbar-component';
import firebase from './../../database/firebase';
import MisDatos from './profile/MisDatos';
import MisRentas from './profile/MisRentas';
import Terminos from './profile/Terminos';
import Catalogo from './../private/Catalogo';
import { SIZES, COLORS, FONTS } from '../../../styles/constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	FontAwesome5,
	MaterialCommunityIcons,
	Entypo,
} from '@expo/vector-icons';

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
					activeBackgroundColor: '#282828',
					style: { backgroundColor: '#000' },
				}}
			>
				<Tab.Screen
					name='Catalogo'
					component={Catalogo}
					options={{
						tabBarIcon: () => (
							<FontAwesome5
								name='user-edit'
								size={30}
								color='#fff'
							/>
						),
					}}
				/>
				<Tab.Screen
					name='MisDatos'
					component={MisDatos}
					options={{
						tabBarIcon: () => (
							<FontAwesome5
								name='user-edit'
								size={30}
								color='#fff'
							/>
						),
					}}
				/>

				<Tab.Screen
					name='MisRentas'
					component={MisRentas}
					options={{
						tabBarIcon: () => (
							<MaterialCommunityIcons
								name='movie-search'
								size={35}
								color='#fff'
							/>
						),
					}}
				/>

				<Tab.Screen
					name='Terminos'
					component={Terminos}
					options={{
						tabBarIcon: () => (
							<Entypo
								name='text'
								size={30}
								color='#fff'
							/>
						),
					}}
				/>
			</Tab.Navigator>
		</SafeAreaView>

	);
};

export default Inicio;
