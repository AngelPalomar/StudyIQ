import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import Inicio from './Inicio';

/** Todos los componentes de React reciben como parámetro de inicio
 * las porpiedades indicadas por la instancia anterior
 */
const Login = (props) => {
	/* Las variables comunes (let,const,obj,etc) no son modificables dentro del render */
	/* Si necesitas modificar algun valor de la UI es necesario que utilices ESTADOS */

	/* 
    Los estados son variable enganchadas al VDOM que permiten su modificación por medio
    de una función (ya que los estados son de solo lectura).

    Para usar un estado utilizamo la libreria useState de React
    const [valor, setValor] = useState(_VALOR_INCIAL_);
    */
	const [suma, setSuma] = useState(-50);
	const [nombre, setNombre] = useState(null);

	let contador = 0;
	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Text>En Login.js</Text>
			<Button
				title='Al Inicio'
				onPress={() => {
					/**
					 * Dado que este componente se encuentra dentro del
					 * NavigationContainer, dentro del parámetro de props
					 * contamos con un elemento llamado navigation, que nos permite
					 * movernos entre screens
					 *
					 * Usamos el sobrenombre que le damos al componente
					 * para iniciarla navegación
					 */
					props.navigation.navigate('Inicio');
				}}
			/>
			<Text
				style={{
					fontSize: 120,
					textAlign: 'center',
					fontWeight: '100',
					marginVertical: 40,
				}}
			>
				{suma}
			</Text>

			<Button
				title='Agregar'
				onPress={() => {
					/*
                    Dado que suma es una constante, no podemos modificar su 
                    valor directamente, para ello utilizamos su función setSuma()
                    */
					setSuma(suma + 1);
					console.log(suma);
				}}
			/>
		</View>
	);
};

export default Login;
