import React from 'react';
import { ImageBackground, Text, View, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	FontAwesome5,
	MaterialCommunityIcons,
	Entypo,
} from '@expo/vector-icons';

/**
 * Para crear un Tabavigator necesitamos un contenedor para indicar
 * dentro,cada item dle menu
 */
const Tab = createBottomTabNavigator();

const Perfil = (props) => {
	return (
		<TouchableOpacity>
			<View
				style={{
					backgroundColor: '#FAFAFF',
					padding: 20,
					borderRadius: 10,
					marginBottom: 15,
					flex: 1,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 5,
					},
					shadowOpacity: 0.36,
					shadowRadius: 6.68,

					elevation: 11,
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
							source={{uri:'https://instagram.fqro1-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/120664818_108077857733699_994194970376000551_n.jpg?tp=1&_nc_ht=instagram.fqro1-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=O3rh1Dbe9WsAX86RlsP&oh=8ef00908e8d13a9877aa85f383557e93&oe=60724E97' }}
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
							flex: 11,
							justifyContent: 'center',
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: '900',
							}}
						>
							xd
						</Text>
						<Text
							style={{
								marginTop: 1,
								color: '#535353',
							}}>
							xxxxxxx
						</Text>

					</View>

					<View
						style={{
							flex: 3,
							alignItems: 'flex-end',
							justifyContent: 'space-between',
						}}>
						<TouchableOpacity
							style={{
								backgroundColor: '#fff',
								padding: 10,
								margin: 5,
								borderRadius: 20,
							}}>
							<Image
								source={require('../../../assets/images/save.png')}
								style={{
									width: 15,
									height: 15,
								}}
							>
							</Image>
						</TouchableOpacity>
					</View>
				</View>
				{// xd					
				}
				<View style={{ flexDirection: 'row' }}>
				<Text style={{
								marginTop: 1,
							}}>
					Hola mundo en diferentes lenguajes
				</Text>
				</View>
				<View style={{ flexDirection: 'row',
				justifyContent: 'center',
			}}>
				<TouchableOpacity
							style={{
								backgroundColor: '#fff',
								padding: 10,
								margin: 5,
								borderRadius: 20,
							}}>
							<Image
								source={{uri:'https://instagram.fqro1-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/120664818_108077857733699_994194970376000551_n.jpg?tp=1&_nc_ht=instagram.fqro1-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=O3rh1Dbe9WsAX86RlsP&oh=8ef00908e8d13a9877aa85f383557e93&oe=60724E97'}}
								style={{
									width: 200,
									height: 200,
									alignSelf: 'center',
								}}>
							</Image>
						</TouchableOpacity>
				</View>
			</View>
			{// xd
			}
			
		</TouchableOpacity>
	);
};

export default Perfil;
