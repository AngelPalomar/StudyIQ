import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export default StyleSheet.create({

    wrapper: {
        backgroundColor	: '#FAFAFA',
		width			: '100%',
		marginVertical  :  8,
		
    },
	mensajes__header: {
		flexDirection 	: 'row',
		justifyContent	: 'space-between',
		width			: '90%',
		alignSelf		: 'center',
		paddingVertical	:  8,
	},
	msg__wrapper:{
		width			: '90%',
		alignSelf		: 'center',
		paddingVertical : 16,
		flexDirection	: 'row',
		overflow		:'hidden',
		borderBottomWidth: 1,
		borderColor		: '#dcdfff',

	},
	txt__wrapper: {
		width			: '100%',
		
	},
	msg__image_s:{
		width			: 50,
		height			: 50,
		borderRadius	: 100,
		marginRight		: 16,
	},
	msg__image_t:{
		width			: 50,
		height			: 50,
		marginRight		: 16,
	},
	msg__name:{
		fontWeight		: "700",
	},
	msg__description:{
		fontSize		: 12,
		width			: '80%',
		color			: '#9a9ebc',
	},
	header__title:{
		fontWeight		: "700",
	},
	header__link:{
		color			: "#3183BA",
		fontSize		: 12,
	}


});