import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	View,
	Text
} from 'react-native';
import firebase from '../../database/firebase'
import firebase2 from 'firebase'
import 'firebase/firestore'

/**Componentes */
import Usuario from '../../components/Usuario';
import CrearPublicacion from '../../components/CrearPublicacion'
import { ScrollView } from 'react-native-gesture-handler';

const Catalogo = (props) => {
	//Estado que guarde el arreglo de objetos de laista de usuarios
	const [postsList, setPostsList] = useState([])
	const [rcVisible, setRcVisible] = useState(true);

	/**
	 * Creamos un efecto que no esté enganchado a ningún componente
	 * (Solo se ejecute al inicio de la Screen)
	 * 
	 * Busca mi usuario
	 */
	useEffect(() => {
		//Guarda el usuario
		getPublicacionesPorUsuario()
	}, []);

	/**
	 * Creamos una función asíncrona para tomar la lista de publicaciones
	 */
	const getPublicacionesPorUsuario = async () => {

		//limpia el arreglo
		setPostsList([])

		//Variable para guardar la lista de seguidos
		let listaSeguiendo = []

		/**
		 * Trae la lista de seguidores
		 */
		const miUser = await firebase.db
			.collection('usuarios')
			.where('authId', '==', firebase.auth.currentUser.uid)
			.get()

		if (!miUser.empty) {
			//Datos de mi usuario usuario
			const miUserDoc = miUser.docs[0].data()

			//Verifica que exista gente siguiendi
			if (typeof miUserDoc.siguiendo !== "undefined") {
				listaSeguiendo = miUserDoc.siguiendo

				//Recorre a los seguidos
				listaSeguiendo.forEach(async email => {
					/**
					 * busca al usuario para traer sus datos para armar el post
					 */
					const usuario = await firebase.db.collection('usuarios')
						.where('email', '==', email)
						.get()

					if (!usuario.empty) {
						const docUsuario = usuario.docs[0].data()

						/**
							 * Una vez buscado el usuario, trae sus publicaciones y lo pone todo en
							 * un arreglo
							 */
						const publicaciones = await firebase.db.collection('publicaciones')
							.where('autor', '==', docUsuario.email)
							.get()

						if (!publicaciones.empty) {
							const docPublicaciones = publicaciones.docs

							docPublicaciones.forEach(pub => {
								//Destructura la fecha
								const { anio, mes, dia, hora, minuto, segundo } = pub.data().fecha

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
									id: pub.id,
									avatar: docUsuario.avatar,
									nombres: docUsuario.nombres,
									apellidos: docUsuario.apellidos,
									fechaSubida: fecha,
									...pub.data()
								}

								//setPostsList(postsList.concat(post))
								setPostsList(prevState => [...prevState, post]);
							})
						}
					}
				})
			} else {

			}
		}
		//Para la carga
		setRcVisible(false)
	};

	//Efecto que reordena a las publicaciones por fecha
	useEffect(() => {
		if (postsList.length > 0) {

			//Duplica el arreglo y lo ordena por fecha descendiente
			let pubsPorOrdenar = postsList
			pubsPorOrdenar.sort(function (a, b) {
				return new Date(b.fechaSubida) - new Date(a.fechaSubida);
			});
		}
	}, [postsList])

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={rcVisible}
					onRefresh={() => getPublicacionesPorUsuario()} />
			}>
			<View style={{ flex: 1 }}>
				<CrearPublicacion />
				{
					postsList.length > 0 ?
						postsList.map((value, index) => (
							<Usuario datosUsuario={value} key={index} />
						)) : null
				}
			</View>
		</ScrollView >
	);
};

export default Catalogo;
