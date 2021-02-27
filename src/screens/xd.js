import React, { Component } from 'react';
import {
	ActivityIndicator,
	Alert,
	Button,
	Image,
	Text,
	View,
	TextInput,
} from 'react-native';
import firebase from './../database/firebase';
import estilos from '../styles/estilos';
import get_error from '../helpers/errores_es_mx';

export default class Registro extends Component {
	constructor(props) {
		super(props);
		/*Para llamar a las props utilizamos 
        this.props*/

		/*
        Las clases tiene un atributo tipo objeto reservado que se llama state
        y aqui debmos guardar todas las variables de estado que sean necesarias
        */
		this.state = {
            nombres: '',
            apellidoP: '',
            apellidoM: '',
            email: '',
            pin: '',
            pais: '',
            tipoUsuario: '',
            gradoEscolar: '',
			aiVisible: false,
			btnVisible: true,
		};
	} // /Constructor

	/**
	 * Para crear un metodo en una clase, solo agregas el nombre seguido de los parámetros
	 * (Como crear una función sin la palabra function)
	 */
	metodoValidaRegistro(state) {
		if (this.state.nombre.length < 3) {
			Alert.alert('ERROR', 'Nombre incorrecto', [
				{
					text: 'Corregir',
					onPress: () =>
						this.setState({ nombre: '' }),
				},
			]);

			return;
		}
	}

	/**
	 * RENDER
	 */
	render() {
		const validaRegistro = async () => {
			

			//Si las validaciones son coreectas
			// this.setState({ aiVisible: true });
			// this.setState({ btnVisible: false });
			this.setState({
				aiVisible: true,
				btnVisible: false,
			});

			/*
            Crear un nuevo documento
            en la colección usuarios
            */
			try {
				/**
				 * Creamos un usuario desde el servicio de auth de Firebase
				 */
				const usuarioFirebase = await firebase.auth.createUserWithEmailAndPassword(
					this.state.email,
					this.state.pin
				);

				/**
				 * Enviamos un correo electrónico
				 * para validar la existencia de la cuenta
				 */
				await usuarioFirebase.user
					.sendEmailVerification()
					.then(() => {
						Alert.alert(
							'Usuario registrado',
							`${usuarioFirebase.user.uid}\nTe enviamos un correo para validar tu cuenta`,
							[
								{
									text: 'Continuar',
									onPress: () => {
										this.setState({
											aiVisible: false,
											btnVisible: true,
										});
									},
								},
							]
						);
					});

				//console.log(usuarioFirebase.user);

				const docUsuario = await firebase.db
					.collection('usuarios')
					.add({
						authId: usuarioFirebase.user.uid,
						nombre: this.state.nombre,
						apellido1: this.state.apellido1,
						apellido2: this.state.apellido2,
					});
			} catch (e) {
				console.log(e.toString());
				Alert.alert('ERROR', get_error(e.code), [
					{
						text: 'Corregir',
						onPress: () => {
							this.setState({
								aiVisible: false,
								btnVisible: true,
							});
						},
					},
				]);
			}
		};

		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View style={estilos.contenedorImgCircular}>
					<Image
						source={require('./../../assets/images/registro.png')}
						style={{
							...estilos.imgLogin,
							backgroundColor: '#000',
							borderRadius: 0,
						}}
					/>
				</View>

				<Text style={estilos.titulo}>Registro</Text>

				<TextInput
					style={estilos.input}
					placeholder='Nombre'
					keyboardType='default'
					value={this.state.nombre}
					onChangeText={(val) => {
						this.setState({ nombre: val });
					}}
				/>

				<View style={estilos.row}>
					<View style={estilos.col}>
						<TextInput
							style={{
								...estilos.input,
							}}
							placeholder='Apellido 1'
							keyboardType='default'
							value={this.state.apellido1}
							onChangeText={(val) => {
								this.setState({
									apellido1: val,
								});
							}}
						/>
					</View>

					<View style={estilos.col}>
						<TextInput
							style={{
								...estilos.input,
								alignSelf: 'flex-end',
							}}
							placeholder='Apellido 2'
							keyboardType='default'
							value={this.state.apellido2}
							onChangeText={(val) => {
								this.setState({
									apellido2: val,
								});
							}}
						/>
					</View>
				</View>

				<TextInput
					style={estilos.input}
					placeholder='Correo electrónico'
					keyboardType='email-address'
					value={this.state.email}
					autoCapitalize='none'
					onChangeText={(val) => {
						this.setState({ email: val });
					}}
				/>

				<TextInput
					style={estilos.input}
					placeholder='Pin (6 dígitos)'
					keyboardType='numeric'
					maxLength={6}
					value={this.state.pin}
					onChangeText={(val) => {
						this.setState({ pin: val });
					}}
				/>

				<ActivityIndicator
					size='large'
					color='#000'
					style={{
						marginVertical: 10,
						display: this.state.aiVisible
							? 'flex'
							: 'none',
					}}
				/>

				<View
					style={{
						display: this.state.btnVisible
							? 'flex'
							: 'none',
					}}
				>
					<Button
						title='Registrarse'
						onPress={validaRegistro}
					/>
				</View>

				<Button
					title='¿Ya tienes una cuenta?, inicia sesión aquí'
					onPress={() => {
						this.props.navigation.navigate(
							'Login'
						);
					}}
				/>

				<Text> {'\n\n\n'}</Text>

				<Text>* Nombre</Text>
				<Text>* Apellido 1</Text>
				<Text>Apellido 2</Text>
				<Text>* Fecha de nacimiento</Text>
				<Text>* Teléfono</Text>
				<Text>* Email</Text>
				<Text>*Pin (6 dígitos)</Text>
				<Text>*Aceptar términos (Switch)</Text>
				<Text>Registrarse (Btn)</Text>
				<Text>Ir al Login (Btn)</Text>
			</View>
		);
	}
}
  