import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	contenedor: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titulo: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '500',
		marginVertical: 20,
	},
	input: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		width: '95%',
		borderWidth: 2,
		borderColor: '#585858',
		fontSize: 16,
		borderRadius: 10,
		marginVertical: 10,
	},
	imgLogin: {
		height: 100,
		width: 100,
		resizeMode: 'contain',
		backgroundColor: '#585858',
		borderRadius: 200,
	},
	contenedorImgCircular: {
		width: 200,
		height: 200,
		overflow: 'hidden',
		borderRadius: 100,
	},
	row: {
		flexDirection: 'row',
		width: '95%',
	},
	col: {
		flex: 1,
	},
});
