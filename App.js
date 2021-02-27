import React from 'react';

import Login from './src/screens/Login';
import Inicio from './src/screens/Inicio';
import Registro from './src/screens/Registro';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/private/Home';
const Stack = createStackNavigator();

export default function App() {
	/**
	 * Creamos en App.js un enrutador de las pantallas navegables
	 * de la app por medio d eun Screen
	 *
	 */
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Inicio'>
				{/** 3.- Indicamos todas las Screens relacionadas */}

				<Stack.Screen
					name='Login'
					component={Login}
				/>

				<Stack.Screen
					name='Inicio'
					component={Inicio}
				/>

				<Stack.Screen
					name='Registro'
					component={Registro}
				/>

				<Stack.Screen
					name='Home'
					component={Home}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
