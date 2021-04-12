import React, { useState } from 'react';
import {
	ImageBackground,
	Text,
	TouchableOpacity,
	View,
	Image
} from 'react-native';
import AppModal from './AppModal'
import firebase from '../database/firebase'

const Usuario = (props) => {
	//console.log(datosUsuario);

	/** Object Destructuring */
	/*
	De convertir en variables/constantes las claves de un objeto
	*/
	const {
		id,
		apellidos,
		nombres,
		autor,
		avatar,
		imagenUrl,
		texto,
		fechaSubida
	} = props.datosUsuario;

	const [opciones, setOpciones] = useState(false)
	const [pregunta, setPregunta] = useState(false)

	//función para eliminar una publicacion
	const eliminarPublicacion = async () => {
		try {
			const eliminar = await firebase.db
				.collection('publicaciones')
				.doc(id)
				.delete().then(() => {
					console.log("Borrado")
				})

			//Recarga los post
			props.recargar()
		} catch (error) {
			console.warn(error.toString())
		}
	}

	return (
		<View
			style={{
				backgroundColor: '#FAFAFF',
				padding: 20,
				borderRadius: 10,
				marginBottom: 15,
				marginHorizontal: 15,
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 1.5,
				},
				shadowOpacity: 0.5,
				shadowRadius: 3,

				elevation: 3,
			}}>
			<View style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<ImageBackground
						source={{ uri: avatar }}
						style={{
							width: 50,
							height: 50,
							borderRadius: 5,
							overflow: 'hidden',
						}}
					/>
					<View
						style={{
							marginLeft: 10,
							justifyContent: 'center',
						}} >
						<Text
							style={{
								fontSize: 14,
								fontWeight: '900',
							}}>
							{`${nombres} ${apellidos}`}
						</Text>
						<Text
							style={{
								marginTop: 1,
								color: '#535353',
								fontSize: 10
							}}>
							{fechaSubida.toString()}
						</Text>

					</View>
				</View>

				{
					autor === firebase.auth.currentUser.email && (
						<View
							style={{
								alignItems: 'flex-end',
								justifyContent: 'space-between',
							}}>
							<TouchableOpacity
								onPress={() => {
									setOpciones(!opciones)
									setPregunta(false)
								}}
								style={{
									backgroundColor: '#fff',
									padding: 5,
									margin: 5,
									borderRadius: 20,
								}}>
								<Image
									source={require('../../assets/images/more-512.png')}
									style={{
										width: 15,
										height: 15,
									}}
								>
								</Image>
							</TouchableOpacity>
						</View>
					)
				}
			</View>
			<View style={{ flexDirection: 'row' }}>
				<Text style={{
					marginTop: 10,
					marginBottom: imagenUrl ? 10 : 0,
					fontSize: 15
				}}>
					{texto}
				</Text>
			</View>
			{imagenUrl ?
				<View style={{
					flexDirection: 'row',
					justifyContent: 'center',
				}}>
					<TouchableOpacity
						style={{
							backgroundColor: '#fff',
							padding: 10,
							borderRadius: 20,
						}}>
						<Image
							source={{ uri: imagenUrl }}
							style={{
								width: 200,
								height: 200,
								alignSelf: 'center',
							}}>
						</Image>
					</TouchableOpacity>
				</View> : null
			}
			{
				opciones && (
					<View style={{
						alignItems: 'center',
						marginTop: 20
					}}>
						<TouchableOpacity
							onPress={() =>
								props.cambiarAEditar()}>
							<Text style={{ color: '#273469' }}>Editar publicación</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setPregunta(true)}>
							<Text style={{ color: '#FF0033' }}>Eliminar publicación</Text>
						</TouchableOpacity>
					</View>
				)
			}
			{
				pregunta && (
					<View style={{
						alignItems: 'center',
						marginTop: 20
					}}>
						<Text>¿Estas seguro?</Text>
						<View style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: 20
						}}>
							<TouchableOpacity
								onPress={eliminarPublicacion}
								style={{
									marginRight: 20
								}}>
								<Text style={{ color: '#273469' }}>SI</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => setPregunta(true)}>
								<Text style={{ color: '#FF0033' }}>NO</Text>
							</TouchableOpacity>
						</View>
					</View>
				)
			}
		</View>
	);
};

export default Usuario;
