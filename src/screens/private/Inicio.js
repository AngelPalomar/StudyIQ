import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import Snackbar from 'react-native-snackbar-component';
import firebase from './../../database/firebase';
import { SIZES, COLORS, FONTS } from '../../../styles/constants';
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
		</SafeAreaView>
	);
};

export default Inicio;
