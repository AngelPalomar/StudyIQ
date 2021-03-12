import React, { useEffect, useState } from 'react';
import {
	ImageBackground,
	SafeAreaView,
	ScrollView,
	Text,
	View,
	TextInput,
	Button,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from './../../../database/firebase';
import estilos from './../../../styles/estilos';
import ProgressDialog from '../../../components/ProgressDialog';
import Snack from 'react-native-snackbar-component';
import AppModal from '../../../components/AppModal';
import * as Imagepicker from 'expo-image-picker';
const MisDatos = (props) => {
	const [usuarioFirebase, setUsuarioFirebase] = useState(
		{}
	);
	const [docUsuario, setDocUsuario] = useState({});
	const [loading, setLoading] = useState(true);
	const [snackUpdate, setSnackUpdate] = useState(false);
	const [snackError, setSnackError] = useState(false);
	const [modalImg,setModalImg]=useState(false);
	useEffect(() => {
		/* tomamos los datos del usuario que ha iniciado sesión */
		setUsuarioFirebase(firebase.auth.currentUser);

		/* invocamos la consulta */
		getDocUsuario(firebase.auth.currentUser.uid);
	}, []);

	const getDocUsuario = async (uid) => {
		try {
			
			const query = await firebase.db.collection('usuarios').where('authId', '==', uid).get();
			if (!query.empty) {
				const snapshot = query.docs[0];

				setDocUsuario({
					...snapshot.data(),
					id: snapshot.id,
				});

				setLoading(false);
			}
		} catch (e) {
			console.warn(e.toString());
		}
	};

	const getImagenGaleria=async()=>{
		const {status}=await Imagepicker.requestMediaLibraryPermissionsAsync();
		if(status==='granted'){
			const imgGaleria=await Imagepicker.launchImageLibraryAsync({
				mediaTypes: Imagepicker.MediaTypeOptions.Images,
				allowsEditing:true,
				aspect:[4,3],
				quality:1
			});
			console.log(imgGaleria);
		}
	};
	return (
		/**
		 * SafeAreaView calcula el espacio donde el texto
		 * no se visualiza y lo recorre
		 */
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
			{modalImg ?(
			<AppModal
			show={modalImg}
			layerBgColor='#333'
			layerBgOpacity={0.5}
			modalBgColor='#fff'
			modalOpacity={1}
			modalContent={
				<View>
					<Text style={{
						alignSelf:'center',
						marginBottom:20,
						fontSize:30,
						fontWeight:'500',
						}}>
							Actualizar foto 
							<Button title='Tomar foto '/>
							<Button title='Galeria'
							onPress={getImagenGaleria}
							/>
							<Button title='conselar'
							color='#FC4136'
							onPress={()=>setModalImg(false)}
							/>
					</Text>
				</View>
			}

			/>):null
			
			}
			{/**
			 * Si loading es verdadero, mostramos la modal
			 */}

			{loading ? <ProgressDialog /> : null}

			<ScrollView>
				<TouchableOpacity onPress={()=>setModalImg(true)}>
					<ImageBackground
						source={require('./../../../../assets/images/sidebar1.jpg')}
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
						placeholder='Nombres'
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
						placeholder='Apellidos'
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
							try {
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
		</SafeAreaView>
	);
};

export default MisDatos;
