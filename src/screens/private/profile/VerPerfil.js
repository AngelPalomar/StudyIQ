import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
	ImageBackground, Text, View, TouchableOpacity,
	Image, FlatList, RefreshControl
} from 'react-native';
import firebase from '../../../database/firebase';
import CrearPublicacion from '../../../components/CrearPublicacion'
import firebase2 from 'firebase'
import 'firebase/firestore';

/**Componentes */
import Usuario from '../../../components/Usuario'
import { ScrollView } from 'react-native-gesture-handler';

const Buscador = (props) => {
	const [miUsuario, setMiUsuario] = useState({});
	const [docPerfil, setDocPerfil] = useState({});
	const [publicaciones, setPublicaciones] = useState([])
	const [loSigue, setLoSigue] = useState(false)
	const [isLoading, setisLoading] = useState(true)

	useLayoutEffect(() => {
		/* Mostramos el usuario seleccionado */
		getDocPerfil(props.route.params.authId);
	}, []);

	/**Efecto que reacciona al perfil buscado */
	useEffect(() => {
		//si el objeto no está vacío
		if (Object.keys(docPerfil).length !== 0) {
			//buscamos mi usuario
			getMiUsuario()

			//Buscamos las publicaciones
			getPublicaciones()
		}
	}, [docPerfil])

	/**Función para traer la info del perfil */
	const getDocPerfil = async () => {
		try {
			const perfil = await firebase.db
				.collection('usuarios')
				.where('authId', '==', props.route.params.authId)
				.get();

			if (!perfil.empty) {
				const perfilDoc = perfil.docs[0]

				//Guardo la info del perfil buscado
				setDocPerfil({
					...perfilDoc.data(),
					id: perfilDoc.id
				})
			}
		} catch (e) {
			console.warn(e.toString());
		}
	};

	const getMiUsuario = async () => {
		try {
			//Busca mi usuario
			const myUser = await firebase.db
				.collection('usuarios')
				.where('authId', '==', firebase.auth.currentUser.uid)
				.get()

			if (!myUser.empty) {
				const myUserDoc = myUser.docs[0]

				//guardo la info de mi usuario 
				setMiUsuario({
					...myUserDoc.data(),
					id: myUserDoc.id
				})

				//Si existe la lista de seguidores
				if (typeof myUserDoc.data().siguiendo !== "undefined") {
					//Verifica si sigue al usuario
					if (myUserDoc.data().siguiendo.includes(docPerfil.email)) {
						setLoSigue(true)
					} else {
						setLoSigue(false)
					}
				}
			}
		} catch (error) {
			console.warn(error.toString());
		}
	}

	/**Función para seguir a un usuario */
	const seguirUsuario = async () => {

		//Añade el email a mis seguidos
		const actualizarUsuarioSeguir = await firebase.db
			.collection('usuarios')
			.doc(miUsuario.id)
			.update({
				"siguiendo": firebase2.firestore
					.FieldValue
					.arrayUnion(docPerfil.email)
			})

		//Cambia de botón
		setLoSigue(true)

		//Añade el correo actual a la lista de seguidores del perfik
		const añadirSeguidor = await firebase.db
			.collection('usuarios')
			.doc(docPerfil.id)
			.update({
				"seguidores": firebase2.firestore
					.FieldValue
					.arrayUnion(firebase.auth.currentUser.email)
			})
	}

	/**DFunc para dejar de seguir */
	const dejarDeSeguir = async () => {
		//Añade el email a mis seguidos
		const actualizarUsuarioDejarDeSeguir = await firebase.db
			.collection('usuarios')
			.doc(miUsuario.id)
			.update({
				"siguiendo": firebase2.firestore
					.FieldValue
					.arrayRemove(docPerfil.email)
			})

		//cambia de botón
		setLoSigue(false)

		//Elimina el correo actual a la lista de seguidores del perfik
		const eliminarSeguidor = await firebase.db
			.collection('usuarios')
			.doc(docPerfil.id)
			.update({
				"seguidores": firebase2.firestore
					.FieldValue
					.arrayRemove(firebase.auth.currentUser.email)
			})
	}

	/**Función que obtiene las publicacines */
	const getPublicaciones = async () => {
		//limpia el arreglo
		setPublicaciones([])

		try {
			const pub = await firebase.db
				.collection('publicaciones')
				.where('autor', '==', docPerfil.email)
				.get()

			if (!pub.empty) {
				const postsDoc = pub.docs

				postsDoc.forEach(doc => {
					//Destructura la fecha
					const { anio, mes, dia, hora, minuto, segundo } = doc.data().fecha

					//Crea una nueva fecha
					let fecha = new Date(
						anio,
						mes,
						dia,
						hora,
						minuto,
						segundo
					)

					const post = {
						id: doc.id,
						avatar: docPerfil.avatar,
						nombres: docPerfil.nombres,
						apellidos: docPerfil.apellidos,
						fechaSubida: fecha,
						...doc.data()
					}

					//Guarda las publicaciones en el estado
					setPublicaciones(prevState => [...prevState, post]);
				})
			}
		} catch (error) {
			console.warn(error)
		}

		//Para la carga
		setisLoading(false)
	}

	//Efecto para ordenar por fecha
	useEffect(() => {
		if (publicaciones.length > 0) {

			//Duplica el arreglo y lo ordena por fecha descendiente
			let pubsPorOrdenar = publicaciones
			pubsPorOrdenar.sort(function (a, b) {
				return new Date(b.fechaSubida) - new Date(a.fechaSubida);
			});
		}
	}, [publicaciones])

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={isLoading}
					onRefresh={getPublicaciones} />
			}>
			<View style={{ flex: 1 }}>
				<View style={{
					alignItems: 'center',
					marginTop: 10
				}}>
					<Image
						source={{ uri: docPerfil.avatar }}
						style={{
							width: 100,
							height: 100,
							overflow: 'hidden',
							borderRadius: 55,
							backgroundColor: '#000',
						}}
					/>
					<Text
						style={{
							fontSize: 18,
							marginBottom: 5,
							marginTop: 5,
							color: '#000',
						}}
					>
						{docPerfil.nombres}{' '}{docPerfil.apellidos}
					</Text>
					<Text
						style={{
							fontSize: 11,
							marginBottom: 5,
							color: '#000',
						}}>
						{docPerfil.email}
					</Text>
					<View style={{
						flexDirection: 'row',
						marginTop: 15,
						marginBottom: 10
					}}>
						{
							/**Si es el perfil del propietario, no muestra nada */
							docPerfil.email !== firebase.auth.currentUser.email ?
								<>
									{
										//Si lo sigue, muestra opción para dejar de seguirlo
										!loSigue ?
											<TouchableOpacity
												onPress={seguirUsuario}
												style={{ marginHorizontal: 10 }}>
												<Text>Seguir</Text>
											</TouchableOpacity> :
											<TouchableOpacity
												onPress={dejarDeSeguir}
												style={{ marginHorizontal: 10 }}>
												<Text>Dejar de seguir</Text>
											</TouchableOpacity>
									}
									{
										/**Si es maestro, se le puede solicitar asesoría  */
										docPerfil.tipoUsuario === 'Maestro' ?
											<TouchableOpacity
												onPress={() =>
													props.navigation.navigate('SolicitarAsesoria', { maestro: docPerfil.email })}
												style={{ marginHorizontal: 10 }}>
												<Text>Solicitar asesoría</Text>
											</TouchableOpacity> : null
									}
								</> :
								<CrearPublicacion />
						}
					</View>
					{
						publicaciones.length > 0 ?
							publicaciones.map((value, index) => (
								<View style={{ width: '100%' }} key={index}>
									<Usuario
										datosUsuario={value}
										cambiarAEditar={() => props.navigation.navigate(
											'EditarPublicacion',
											{ datos: { ...value, fechaSubida: "" } }
										)}
										regresar={() => props.navigation.goBack()}
										recargar={() => {
											setisLoading(true)
											getPublicaciones()
										}} />
								</View>
							)) : null
					}
				</View>
			</View>
		</ScrollView>
	);
};

export default Buscador;
