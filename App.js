import React , { useEffect }from 'react';

import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/private/Home';
import addChat from './src/screens/private/profile/addChat';
import Chat from './src/screens/private/profile/chat';
const Stack = createStackNavigator();
import { LogBox } from 'react-native';
export default function App() {
	/**
	 * Creamos en App.js un enrutador de las pantallas navegables
	 * de la app por medio d eun Screen
	 *
	 */
	useEffect(() => {
		/**
		 * Inidicamos los tipos de arning que queremos  dejar de visualizar
		 */
		//TODOS
		//LogBox.ignoreAllLogs();
		//Solo algunos warning (Arreglo de los warnings a dejar de mostrar)
		LogBox.ignoreLogs([
			'Animated: `useNativeDriver`',
			'Setting a timer for a long period of time',
		]);
	}, []);
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Inicio'>
				{/** 3.- Indicamos todas las Screens relacionadas */}

				<Stack.Screen
					name='Login'
					component={Login}
				/>
				<Stack.Screen
					name='Registro'
					component={Registro}
				/>

				<Stack.Screen
					name='Home'
					component={Home}
				/>
				<Stack.Screen
					name='addChat'
					component={addChat}
				/>
				<Stack.Screen
					name='Chat'
					component={Chat}
					options={{title:'Chat'
				}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
