import React from 'react';
import {
	ImageBackground,
	Text,
	TouchableOpacity,
	View,
	Image,
	TouchableHighlight
} from 'react-native';


import estilos from '../../../styles/estilos_mesnajes';

const Mensajes = (props) => {
	return (
		<View style={estilos.wrapper}>

			{/* ------  header  ------ */}
			<View style = {estilos.mensajes__header}>
				<Text style = {estilos.header__title}>Mensajes</Text>
				<Text style = {estilos.header__link}>Archivado</Text>
			</View>

			{/* ------ mensajes ------ */}
			<View style = {estilos.msg__wrapper}>
			<Image
				source={{uri:'https://scontent.fmex32-1.fna.fbcdn.net/v/t1.0-9/44151695_1591669484311540_8944889110456172544_o.jpg?_nc_cat=111&ccb=1-3&_nc_sid=8bfeb9&_nc_ohc=VZcycyL-D5kAX8-9oq_&_nc_ht=scontent.fmex32-1.fna&oh=37c0310e4da5eb9ddba7fa1ebb5708e9&oe=606E9C62'}}
				style={estilos.msg__image_s}>
			</Image>
			<View style={estilos.txt__wrapper}>
				<Text style = {estilos.msg__name}>Josh Gonzalez</Text>
				<Text style = {estilos.msg__description}>Oye, ¿sabes de algún profesor que enseñe react native? </Text>
			</View>
			</View>

			<View style = {estilos.msg__wrapper}>
			<Image
				source={{uri:'https://scontent.fmex32-1.fna.fbcdn.net/v/t31.0-8/14853181_10209582487893492_8097202248223147480_o.jpg?_nc_cat=102&ccb=1-3&_nc_sid=174925&_nc_ohc=Lhon3gdDYvwAX8GsE33&_nc_ht=scontent.fmex32-1.fna&oh=ac639db4aa7641b771185546a9f726eb&oe=606F8C98'}}
				style={estilos.msg__image_t}>
			</Image>
			<View style={estilos.txt__wrapper}>
				<Text style = {estilos.msg__name}>Raúl zavaleta</Text>
				<Text style = {estilos.msg__description}>Te mando el enlace de la clase de React Native a alas 5:00pm </Text>
			</View>
			</View>

			<View style = {estilos.msg__wrapper}>
			<Image
				source={{uri:'https://scontent.fmex32-1.fna.fbcdn.net/v/t1.0-9/120801863_3360707520710614_2209194115200289644_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=174925&_nc_ohc=vOqoebI86eQAX8ObNLf&_nc_ht=scontent.fmex32-1.fna&oh=93a4a51782f74a78564df34fd66ddd68&oe=606ED944'}}
				style={estilos.msg__image_s}>
			</Image>
			<View style={estilos.txt__wrapper}>
				<Text style = {estilos.msg__name}>Cruz Ángel</Text>
				<Text style = {estilos.msg__description}>Oye, ¿sabes de algún profesor que enseñe react native? </Text>
			</View>
			</View>
				
		</View>
	);
};

export default Mensajes;
