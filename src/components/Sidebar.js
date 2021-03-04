import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import {
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';

import {
	AntDesign,
	MaterialIcons,
} from '@expo/vector-icons';

const Sidebar = (props) => {
	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<ImageBackground
				source={require('./../../assets/images/sidebar4.jpg')}
				style={{
					width: '100%',
					paddingBottom: 30,
				}}
			>
				<Text
					style={{
						marginTop: 20,
						width: '100%',
						textAlign: 'center',
						fontSize: 18,
						fontWeight: '500',
						textDecorationLine: 'underline',
						color: '#fff',
					}}
				>
					Hola de nuevo
				</Text>

				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							flex: 1,
							alignItems: 'center',
						}}
					>
						<ImageBackground
							source={require('./../../assets/images/avatar.png')}
							style={{
								width: 60,
								height: 60,
								overflow: 'hidden',
								marginTop: 20,
								borderRadius: 30,
								backgroundColor: '#666',
							}}
						/>
					</View>

					<View style={{ flex: 2 }}>
						<View
							style={{
								flex: 1,
								marginLeft: 10,
								marginTop: 20,
							}}
						>
							<Text
								style={{
									fontSize: 16,
									marginBottom: 5,
									color: '#fff',
								}}
							>
								Raúl Zavaleta
							</Text>
							<Text style={{ color: '#ccc' }}>
								0 Rentas
							</Text>
						</View>
					</View>
				</View>
			</ImageBackground>

			<DrawerContentScrollView {...props}>
				<DrawerItem
					icon={() => (
						<AntDesign
							name='home'
							size={20}
							color='#000'
						/>
					)}
					label='Inicio'
					onPress={() => {
						props.navigation.navigate(
							'InicioUser'
						);
					}}
				/>

				<DrawerItem
					icon={() => (
						<AntDesign
							name='user'
							size={20}
							color='#000'
						/>
					)}
					label='Perfíl'
					onPress={() => {
						props.navigation.navigate('Perfil');
					}}
				/>

				<DrawerItem
					icon={() => (
						<MaterialIcons
							name='local-movies'
							size={20}
							color='#000'
						/>
					)}
					label='Catálogo'
					onPress={() => {
						props.navigation.navigate(
							'Catalogo'
						);
					}}
				/>
			</DrawerContentScrollView>
		</View>
	);
};

export default Sidebar;
