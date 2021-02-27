import React from 'react';
import {
	ImageBackground,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Usuario = ({ datosUsuario }) => {
	//console.log(datosUsuario);

	/** Object Destructuring */
	/*
    De convertir en variables/constantes las claves de un objeto
    */
	const {
		first_name,
		last_name,
		email,
		avatar,
	} = datosUsuario;

	return (
		<TouchableOpacity>
			<View
				style={{
					backgroundColor: '#fff',
					padding: 20,
					borderRadius: 10,
					marginBottom: 15,
					flex: 1,
					shadowColor: '#535353',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.5,
					shadowRadius: 2,
					elevation: 2,
				}}
			>
				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							flex: 3,
							alignItems: 'flex-start',
							justifyContent: 'center',
						}}
					>
						<ImageBackground
							source={{ uri: avatar }}
							style={{
								width: 50,
								height: 50,
								borderRadius: 25,
								overflow: 'hidden',
							}}
						/>
					</View>

					<View
						style={{
							flex: 7,
							justifyContent: 'center',
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: '500',
							}}
						>
							{first_name}
							{'  '}
							{last_name}
						</Text>
						<Text
							style={{
								marginTop: 5,
								color: '#535353',
							}}
						>
							{email}
						</Text>
					</View>

					<View
						style={{
							flex: 3,
							alignItems: 'flex-end',
							justifyContent: 'space-between',
						}}
					>
						<TouchableOpacity
							style={{
								backgroundColor: '#000',
								padding: 10,
								margin: 5,
								borderRadius: 20,
							}}
						>
							<FontAwesome5
								name='envelope'
								size={15}
								color='#fff'
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={{
								backgroundColor: '#000',
								padding: 10,
								margin: 5,
								borderRadius: 20,
							}}
						>
							<FontAwesome5
								name='phone'
								size={15}
								color='#fff'
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default Usuario;
