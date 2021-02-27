import { useFocusEffect } from '@react-navigation/core';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import Usuario from '../../components/Usuario';

const Catalogo = (props) => {
	useFocusEffect(() => {
		//Modificamos las opciones del HEader del Stack (padre)
		props.navigation.dangerouslyGetParent().setOptions({
			title: 'Catálogo',
		});
	});

	const usuarios = [
		{
			id: 1,
			email: 'raul.zavaletazea@gmail.com',
			first_name: 'Raúl',
			last_name: 'Zavaleta Zea',
			avatar:
				'https://scontent.fqro1-1.fna.fbcdn.net/v/t1.0-9/43951376_10215470951461401_3298900960570507264_n.jpg?_nc_cat=104&ccb=3&_nc_sid=174925&_nc_eui2=AeFWPO2UHwcVmmRqyHWcRVbp0H0Ziktzsc_QfRmKS3Oxz0fwW0JRn5af1jCPOBlLUGA&_nc_ohc=6DFf0P_q0yUAX8vxbTg&_nc_oc=AQmqX5V6-TYt8eKmCFE32qJeKwFFiTpXbMNRqMavhpaBLzDbbyUdZ0D7_VcElXSzPoaMIWwkSSHOUHhUqp_AiatR&_nc_ht=scontent.fqro1-1.fna&oh=2dccb299d033c03fc65436aef0120337&oe=604F5288',
		},
		{
			id: 2,
			email: 'anai.jua@gmail.com ',
			first_name: 'Anai',
			last_name: 'Juez Reyes',
			avatar:
				'https://hipertextual.com/files/2019/01/hipertextual-wonder-woman-1984-steve-trevor-regreso-2019873442.jpg',
		},
		{
			id: 3,
			email: 'raul.zavaletazea@gmail.com',
			first_name: 'Jaime',
			last_name: 'Duende',
			avatar:
				'https://scontent.fqro1-1.fna.fbcdn.net/v/t1.0-9/43951376_10215470951461401_3298900960570507264_n.jpg?_nc_cat=104&ccb=3&_nc_sid=174925&_nc_eui2=AeFWPO2UHwcVmmRqyHWcRVbp0H0Ziktzsc_QfRmKS3Oxz0fwW0JRn5af1jCPOBlLUGA&_nc_ohc=6DFf0P_q0yUAX8vxbTg&_nc_oc=AQmqX5V6-TYt8eKmCFE32qJeKwFFiTpXbMNRqMavhpaBLzDbbyUdZ0D7_VcElXSzPoaMIWwkSSHOUHhUqp_AiatR&_nc_ht=scontent.fqro1-1.fna&oh=2dccb299d033c03fc65436aef0120337&oe=604F5288',
		},
		{
			id: 4,
			email: 'anai.jua@gmail.com ',
			first_name: 'Juan',
			last_name: 'Gabriel',
			avatar:
				'https://hipertextual.com/files/2019/01/hipertextual-wonder-woman-1984-steve-trevor-regreso-2019873442.jpg',
		},
		{
			id: 5,
			email: 'raul.zavaletazea@gmail.com',
			first_name: 'José',
			last_name: 'José',
			avatar:
				'https://scontent.fqro1-1.fna.fbcdn.net/v/t1.0-9/43951376_10215470951461401_3298900960570507264_n.jpg?_nc_cat=104&ccb=3&_nc_sid=174925&_nc_eui2=AeFWPO2UHwcVmmRqyHWcRVbp0H0Ziktzsc_QfRmKS3Oxz0fwW0JRn5af1jCPOBlLUGA&_nc_ohc=6DFf0P_q0yUAX8vxbTg&_nc_oc=AQmqX5V6-TYt8eKmCFE32qJeKwFFiTpXbMNRqMavhpaBLzDbbyUdZ0D7_VcElXSzPoaMIWwkSSHOUHhUqp_AiatR&_nc_ht=scontent.fqro1-1.fna&oh=2dccb299d033c03fc65436aef0120337&oe=604F5288',
		},
		{
			id: 6,
			email: 'anai.jua@gmail.com ',
			first_name: 'Pedro',
			last_name: 'Páramo',
			avatar:
				'https://hipertextual.com/files/2019/01/hipertextual-wonder-woman-1984-steve-trevor-regreso-2019873442.jpg',
		},
	];

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				style={{
					marginVertical: 15,
					marginHorizontal: 20,
				}}
				/** El origen de la información a mostrar en la lista */
				data={usuarios}
				/** El diseño de la presentación de los datos de la lista por cada elemento  */

				renderItem={(item) => (
					<Usuario datosUsuario={item.item} />
				)}
				/** Indicamos el elemento que identifica a
				 * cada elemento de la colección de datos
				 */
				keyExtractor={(item) => item.id.toString()}
			/>
		</View>
	);
};

export default Catalogo;
