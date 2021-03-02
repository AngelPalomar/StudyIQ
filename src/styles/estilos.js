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
		paddingVertical: 5,
		width: '100%',
		borderBottomWidth: 1,
		borderColor: '#9a9ebc',
		fontSize: 16,
		marginVertical: 10,
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
	bottom: {
		flexDirection: 'row',
		//backgroundColor: 'blue',
		width: '80%',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center'
	},
});
