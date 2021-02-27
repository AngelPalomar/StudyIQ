import React, { useState, useEffect } from 'react';
import firebase from './../database/firebase';
import {
	ActivityIndicator, Alert, Button, Image, Text, TextInput, View, FlatList, RefreshControl, Platform, Picker
} from 'react-native';
import estilos from '../styles/estilos';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import get_error from '../helpers/errores_es_mx';

const Registro = (props) => {

	//Creamos un componente que permita crear un documento usuario en la colección usuarios

	const [inputs, setInputs] = useState({
		nombres: '',
		apellidoP: '',
		apellidoM: '',
		email: '',
		pin: '',
		pais: '',
		tipoUsuario: '',
		gradoEscolar: ''

	});

	const [btnVisible, setBtnVisible] = useState(true);
	const [aiVisible, setAiVisible] = useState(false);
	const [tiHab, setTiHab] = useState(true);
	const [paises, setPaises] = useState([]);
	const [rcVisible, setRcVisible] = useState(true);

	//La palabra reservada await indica que el contenido de una variable/constante está en espera de ser recibido
	const getPaisessAsync = async () => {
		try {
			const response = await fetch(
				//peticion para conseguir los nombres de los paises
				'https://restcountries.eu/rest/v2/all'
			);
			const json = await response.json();
			setPaises(json);
			setRcVisible(false);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		//Invocar al servicio getPaisessAsync();
		setTimeout(() => { getPaisessAsync(); }, 1000);
	}, []);

	//Funcion async para validar los compos 

	const validaDatos = async () => {
		//Validamos nombres
		if (inputs.nombres.length == null || (inputs.nombres.length >= 50)) {
			Alert.alert(
				'ERROR',
				'El nombre(s) es un campo obligatorio',
				[
					{
						text: 'Agregar',
						onPress: () => {
							setInputs({ ...inputs, ['nombres']: '' });
						},
					},
				],
				{ cancelable: false }
			);
			return;
		}
		//Validamos apellidoP 

		if (inputs.apellidoP.length == null || inputs.apellidoP.length >= 35) {
			Alert.alert(
				'ERROR', 'El apellido paterno es un campo obligatorio',
				[
					{
						text: 'Agregar',
						onPress: () => { setInputs({ ...inputs, ['apellidoP']: '' }); },
					},
				],
				{ cancelable: false }); return;
		}
		//Validamos apellidoM

		if (inputs.apellidoM.length == null || inputs.apellidoM.length >= 35) {
			Alert.alert(
				'ERROR', 'El apellido materno es un campo obligatorio',
				[
					{
						text: 'Agregar',
						onPress: () => { setInputs({ ...inputs, ['apellidoM']: '' }); },
					},
				], { cancelable: false });
			return;
		}
		//Validamos pin que sea de 8 

		if (inputs.pin.length !== 8) {
			Alert.alert(
				'ERROR', 'Asegúrese que su PIN sea de 6 valores',
				[
					{
						text: 'Corregir',
						onPress: () => { setInputs({ ...inputs, ['pin']: '' }); },
					},
				],
				{ cancelable: false }); return;
		}
		//Validamos email

		if (inputs.email.length == 0 || inputs.email.length > 2) {
			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if (reg.test(inputs.email) == false) {
				Alert.alert(
					'ERROR', 'El email no cumple con el formato',
					[
						{
							text: 'Corregir',
							onPress: () => { setInputs({ ...inputs, ['email']: '' }); },
						},
					], { cancelable: false }
				); return;
			}
		}
		//Si la validación es correcta llegamos aqui
		setAiVisible(true);
		setBtnVisible(false);
		setTiHab(false);

		try {
			//Creamos un usuario desde el servicio de auth de Firebase
			const usuarioFirebase = await firebase.auth.createUserWithEmailAndPassword(inputs.email, inputs.pin);
			//Enviamos un correo electrónico para validar la existencia de la cuenta
			await usuarioFirebase.user.sendEmailVerification().then(() => {
				Alert.alert(
					'Usuario registrado', `${usuarioFirebase.user.uid}\nTe enviamos un correo para validar tu cuenta`,
					[
						{
							text: 'Continuar',
							onPress: () => {
								setAiVisible(true);
								setBtnVisible(false);
							},
						},
					]
				);
			});
			//Agregamos el usuario en la colecion usuarios
			const usuarioFS = await firebase.db.collection('usuarios').add(inputs);
			Alert.alert(
				'Se registro correctamente a ', `${inputs.nombres},¿Desea ir al login?`,
				[{ text: 'Si', onPress: () => { props.navigation.navigate('Login') } },
				{ text: 'No', onPress: () => { props.navigation.navigate('Registro') } }], { cancelable: false });
		} catch (e) {
			Alert.alert('ERROR', get_error(e.code), [
				{
					text: 'Corregir',
					onPress: () => {
						setAiVisible(false);
						setBtnVisible(true);
					},
				},
			]);
		}

		//Despues de 3 segundos, habilitar todo
		setTimeout(() => {
			setAiVisible(false);
			setBtnVisible(true);
			setTiHab(true);
			setSwtch(false);
		}, 5000);
	};
	//Funcion para select de paises
	function getPaisesList() {
		let p = []
		paises.map((value, index) => {
			p.push({ label: value.name, value: value.name, hidden: false })
		})
		return p
	}
	return (
		//vista del app
		<View style={{ flex: 1, }}>
			<Image
				source={require('./../../assets/images/registro.png')}
				style={estilos.imgLogin}
			/>
			<Text style={estilos.titulo}>Registro</Text>

			<Text style={estilos.mensaje2}>* Campos requeridos </Text>

			<TextInput
				placeholder='Nombre(s)*'
				keyboardType='default'
				maxLength={60}
				style={estilos.input}
				onChangeText={value => { setInputs({ ...inputs, nombres: value }) }}
				value={inputs.nombres}
				editable={tiHab}
			/>

			<View style={estilos.row}>
				<View style={estilos.col}>
					<TextInput
						placeholder='Apellido paterno*'
						keyboardType='default'
						maxLength={23}
						style={estilos.input}
						onChangeText={value => { setInputs({ ...inputs, apellidoP: value }) }}
						value={inputs.apellidoP}
						editable={tiHab}
					/>
				</View>
				<View style={estilos.col}>
					<TextInput
						placeholder='Apellido materno'
						keyboardType='default'
						maxLength={23}
						style={estilos.input}
						onChangeText={value => { setInputs({ ...inputs, apellidoM: value }) }}
						value={inputs.apellidoM}
						editable={tiHab}
					/>
				</View>
			</View>

			<TextInput
				placeholder='Email*'
				keyboardType='email-address'
				maxLength={55}
				style={estilos.input}
				onChangeText={value => { setInputs({ ...inputs, email: value }) }}
				value={inputs.email}
				editable={tiHab}
			/>

			<TextInput
				placeholder='Pin (8 dígitos)*'
				keyboardType='number-pad'
				secureTextEntry
				maxLength={8}
				style={estilos.input}
				onChangeText={value => { setInputs({ ...inputs, pin: value }) }}
				value={inputs.pin}
				editable={tiHab}
			/>

			<View
				style={{
					...(Platform.OS !== 'android' && {
						zIndex: 1001, overflow: 'hidden',
					})
				}}>

				<DropDownPicker
					zIndex={1001}
					items={getPaisesList()}
					containerStyle={{ height: 40 }}
					style={{ backgroundColor: '#fafafa' }}
					itemStyle={{
						justifyContent: 'flex-end',
					}}
					dropDownStyle={{ backgroundColor: '#fafafa' }}
					onChangeItem={item => setInputs({ ...inputs, pais: item.value })}
					placeholder="Selecciona un país"
					margin='10'
				/>
				<DropDownPicker
					zIndex={1001}
					items={[{ label: 'Maestro', value: 'Maestro' }, { label: 'Estudiante', value: 'Estudiante' }]}
					containerStyle={{ height: 40 }}
					style={{
						backgroundColor: '#fafafa',
						paddingHorizontal: 10,
						paddingVertical: 5,
					}}
					itemStyle={{
						justifyContent: 'flex-end',
					}}
					dropDownStyle={{ backgroundColor: '#fafafa' }}
					onChangeItem={item => setInputs({ ...inputs, tipoUsuario: item.value })}
					placeholder="Selecciona una opcion"

				/>
				<DropDownPicker
					zIndex={1001}
					items={[{ label: 'Universidad', value: 'Universidad' },
					{ label: 'Preparatoria', value: 'Preparatoria' },
					{ label: 'Primaria', value: 'Primaria' },
					{ label: 'Otro', value: 'Otro' }]
					}
					containerStyle={{ height: 40 }}
					style={{ backgroundColor: '#fafafa' }}
					itemStyle={{
						justifyContent: 'flex-end',
					}}
					dropDownStyle={{ backgroundColor: '#fafafa' }}
					onChangeItem={item => setInputs({ ...inputs, gradoEscolar: item.value })}
					placeholder="Selecciona el grado de estudios escolares"
				/>
			</View>

			<View style={{ zIndex: 100, overflow: 'hidden', }}>
				<ActivityIndicator
					color='#000'
					size='large'
					style={{ display: aiVisible ? 'flex' : 'none' }}
				/>

				<View style={{ margin: 15, display: btnVisible ? 'flex' : 'none' }}>
					<Button title='Registrarse' onPress={validaDatos} />
				</View>
				<Button
					title='¿Ya tienes una cuenta?, inicia sesión aquí'
					onPress={() => {
						props.navigation.navigate('Login');
					}}/>
			</View>

		</View>
	);
};

export default Registro;
