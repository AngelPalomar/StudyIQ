import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import Snackbar from 'react-native-snackbar-component';
import firebase from './../../database/firebase';
import MisDatos from './profile/MisDatos';
import Buscador from './profile/Buscador';
import Mensajes from './profile/Mensajes';
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
						source={require('../../../assets/images/house1.png')}
						style={{
							width: 40,
							height: 40,
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
								source={require('../../../assets/images/user.png')}
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
							source={require('../../../assets/images/messenger.png')}
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
