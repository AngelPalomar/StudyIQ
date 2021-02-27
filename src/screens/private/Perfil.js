import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	FontAwesome5,
	MaterialCommunityIcons,
	Entypo,
} from '@expo/vector-icons';

import MisDatos from './profile/MisDatos';
import MisRentas from './profile/MisRentas';
import Terminos from './profile/Terminos';

/**
 * Para crear un Tabavigator necesitamos un contenedor para indicar
 * dentro,cada item dle menu
 */
const Tab = createBottomTabNavigator();

const Perfil = (props) => {
	return (
		<Tab.Navigator
			initialRouteName='MisDatos'
			tabBarOptions={{
				showLabel: false,
				activeBackgroundColor: '#282828',
				style: { backgroundColor: '#000' },
			}}
		>
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
	);
};

export default Perfil;
