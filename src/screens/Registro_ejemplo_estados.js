import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

export default class Registro extends Component {
	/* Para generar estados en una clase, debemos incializar el objeto global state 
    dentro del constructor al igual que las propiedades */
	constructor(props) {
		super(props);
		/*Para llamar a las props utilizamos 
        this.props*/

		/*
        Las clases tiene un atributo tipo objeto reservado que se llama state
        y aqui debmos guardar todas las variables de estado que sean necesarias
        */
		this.state = {
			suma: -25,
			nombre: 'Pal"Home"',
		};
	} // /Constructor

	render() {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Button
					title={this.state.nombre}
					onPress={() => {
						this.props.navigation.navigate(
							'Inicio'
						);
					}}
				/>

				<Text
					style={{
						fontSize: 120,
						fontWeight: '100',
						textAlign: 'center',
						marginVertical: 40,
					}}
				>
					{
						/**
						 * Para invocar una variable de estado utilizamos
						 * this.state._NOMBRE_VAR_
						 */
						this.state.suma
					}
				</Text>

				<Button
					title='Agregar'
					onPress={() => {
						/**
						 * Para actualizar el valor de un estado invocamos
						 * a la funcion this.setState(_OBJ(S)_ESTADO_)
						 */
						this.setState({
							suma: this.state.suma + 1,
						});
					}}
				/>
			</View>
		);
	}
}
