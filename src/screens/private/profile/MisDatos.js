import React, { useEffect, useState } from 'react';
import {
	ImageBackground,
	SafeAreaView,
	ScrollView,
	Text,
	View,
	TextInput,
	Button,
	Image,
} from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from './../../../database/firebase';
import estilos from './../../../styles/estilos';
import ProgressDialog from '../../../components/ProgressDialog';
import Snack from 'react-native-snackbar-component';
import AppModal from '../../../components/AppModal';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
const MisDatos = (props) => {
	const [usuarioFirebase, setUsuarioFirebase] = useState({});
	const [docUsuario, setDocUsuario] = useState({});
	const [loading, setLoading] = useState(true);
	const [snackUpdate, setSnackUpdate] = useState(false);
	const [snackError, setSnackError] = useState(false);
	const [modalImg, setModalImg] = useState(false);
	const [fondo, setFondo] = useState(false);

	//Creacion de un hook
	useEffect(() => {
		setUsuarioFirebase(firebase.auth.currentUser);
		//invocamos la consulta
		getDocUsuario(firebase.auth.currentUser.uid);
	}, []);
	//query de user
	const getDocUsuario = async (uid) => {
		try {
			const query = await firebase.db.collection('usuarios').where('authId', '==', uid).get();
			//en caso de existir
			if (!query.empty) {
				const snapshot = query.docs[0];
				setDocUsuario({ ...snapshot.data(), id: snapshot.id });
				setLoading(false);
			}

		} catch (e) {
			console.warn(e.toString());
		}
	};
	const getImagenGaleria = async () => {
		//se obtine los permisos
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status === 'granted') {
			const imgGaleria = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 4],
				quality: 1,
			});
			//se agrega la url
			setDocUsuario({ ...docUsuario, ['avatar']: imgGaleria.uri });
			setModalImg(false);
			setLoading(true);

			const blob = await (await fetch(imgGaleria.uri)).blob();
			const file = new File([blob], `${docUsuario.id}.jpg`, { type: 'image/jpeg', });
			blob.close();

			try {
				//subida a firebase
				const subida = await firebase.storage.ref().child('avatars').child(file.name).put(file, { contentType: file.type });
				//si la subida es exitosa 
				if (subida.state === 'success') {

					// Solicitar la url de la imagen 
					const urlAvatar = await subida.ref.getDownloadURL();

					// agregamos en la colecion la url
					await firebase.db.collection('usuarios').doc(docUsuario.id).update({ avatar: urlAvatar });
					// Snack que indique los cambios 
					setLoading(false);
					setSnackUpdate(true);
				}
			} catch (e) {
				setLoading(false);
				setSnackError(true);
				console.log(e.toString());
			}
		}
	};

	//funcion de camara
	const getFotoCamara = async () => {

		//Obtenemos los permisos
		const permisoCamara = await Permissions.askAsync(Permissions.CAMERA);
		const permisoGaleria = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

		// Si obtenemos los permisos
		if (permisoCamara.status === 'granted' && permisoGaleria.status === 'granted') {

			//parametros de la img 
			const imgCamara = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 4],
				quality: 1,
			});

			// Mostrar la imagen seleccionada en el perfil
			setDocUsuario({ ...docUsuario, ['avatar']: imgCamara.uri, });

			setModalImg(false);
			setLoading(true);

			const blob = await (await fetch(imgCamara.uri)).blob();
			const file = new File([blob], `${docUsuario.id}.jpg`, { type: 'image/jpeg', });
			blob.close();

			try {
				//subida de img a firebase
				const subida = await firebase.storage.ref().child('avatars').child(file.name).put(file, { contentType: file.type });
				// si la subida es exitosa 
				if (subida.state === 'success') {
					// Solicitar la url de la imagen 
					const urlAvatar = await subida.ref.getDownloadURL();
					// se actualiza la colecion del user
					await firebase.db.collection('usuarios').doc(docUsuario.id).update({ avatar: urlAvatar });

					setLoading(false);
					setSnackUpdate(true);
				}
			} catch (e) {
				setLoading(false);
				setSnackError(true);
				console.log(e.toString());
			}
		} else {
			// si nos dieron permiso 
			Alert.alert(
				'ERROR', 'para continuar permite el uso de la camara y tu galería',
				[{ text: 'Continuar', onPress: () => setModalImg(false), },]
			);
		}
	};
	return (
		// SafeAreaView calcula el espacio donde el texto no se visualiza y lo recorre
		<SafeAreaView style={{ flex: 1 }}>
			<Snack
				textMessage='Datos actualizados'
				messageColor='#fff'
				backgroundColor='#376e37'
				actionText='Entendido'
				accentColor='#5cb85c'
				actionHandler={() => setSnackUpdate(false)}
				visible={snackUpdate}
			/>
			<Snack
				textMessage='Ocurrió un error'
				messageColor='#fff'
				backgroundColor='red'
				actionText='Entendido'
				accentColor='#fff'
				actionHandler={() => setSnackError(false)}
				visible={snackError}
			/>
			{modalImg ? (
				<AppModal
					show={modalImg}
					layerBgColor='#333'
					layerBgOpacity={0.5}
					modalBgColor='#fff'
					modalOpacity={1}
					modalContent={
						<View>
							<Text
								style={{ alignSelf: 'center', marginBottom: 20, fontSize: 20, fontWeight: '500', }}>
								Actualizar foto de perfíl
            				</Text>
							<Button title='Tomar foto' onPress={getFotoCamara} />

							{Platform.OS === 'android' ? (<View style={{ marginVertical: 10, }} />) : null}

							<Button title='Galería' onPress={getImagenGaleria} />

							{Platform.OS === 'android' ? (<View style={{ marginVertical: 10, }} />) : null}

							<Button
								title='Cancelar'
								color='red'
								onPress={() => setModalImg(false)} />
						</View>
					}
				/>
			) : null
			}
			{ loading ? <ProgressDialog /> : null}
			<ScrollView>
				<TouchableOpacity onPress={() => setModalImg(true)}>
					<ImageBackground
						source={
							typeof docUsuario.avatar !==
								'undefined'
								? { uri: docUsuario.avatar }
								: require('./../../../../assets/images/avatar.png')
						}
						style={{
							width: 200,
							height: 200,
							alignSelf: 'center',
							marginVertical: 15,
							borderRadius: 25,
							overflow: 'hidden',
						}}
					>
						<Text
							style={{
								backgroundColor: '#000',
								color: '#fff',
								width: '100%',
								paddingBottom: 20,
								paddingTop: 10,
								textAlign: 'center',
								opacity: 0.6,
								position: 'absolute',
								bottom: 0,
							}}
						>
							Cambiar imagen
					</Text>
					</ImageBackground>
				</TouchableOpacity>

				<View style={{ margin: 10, flex: 1 }}>
					<TextInput
						style={estilos.input}
						placeholder='Nombre'
						keyboardType='default'
						value={docUsuario.nombres}
						onChangeText={(val) =>
							setDocUsuario({
								...docUsuario,
								['nombres']: val,
							})
						}
					/>

					<TextInput
						style={estilos.input}
						placeholder='Apellido 1'
						keyboardType='default'
						value={docUsuario.apellidos}
						onChangeText={(val) =>
							setDocUsuario({
								...docUsuario,
								['apellidos']: val,
							})
						}
					/>

					<TextInput
						style={estilos.input}
						placeholder='Correo electrónico'
						keyboardType='email-address'
						value={usuarioFirebase.email}
						editable={false}
					/>

					<Button
						title='Guardar cambios'
						onPress={async () => {
							setLoading(true);

							/**
							 * Existen dos tipos de edicion de datos en
							 * FireStore
							 *
							 * 1.- update (constructivo)
							 *      Solo se editan los campos indicados
							 *      y los demás se respetan
							 * 2.- set (destructivo)
							 *      Solo se editan los campos indicados
							 *      y los demás se eliminan
							 */
							try {
								//Seleccionamos de toda la coleccion
								//solo el elemento del id de ese
								//documento
								await firebase.db
									.collection('usuarios')
									.doc(docUsuario.id)
									.update({
										nombres:
											docUsuario.nombres,
										apellidos:
											docUsuario.apellidos,
									});
								setLoading(false);
								setSnackUpdate(true);
							} catch (e) {
								setLoading(false);
								setSnackError(true);
							}
						}}
					/>
				</View>
			</ScrollView>
		</ SafeAreaView>
	);
};

export default MisDatos;
