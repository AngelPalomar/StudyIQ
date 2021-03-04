import React from 'react';
import {
	ActivityIndicator,
	Text,
	View,
} from 'react-native';

const ProgressDialog = (props) => {
	return (
		<View
			style={{
				position: 'absolute',
				alignContent: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				zIndex: 1001,
			}}
		>
			<View
				style={{
					position: 'absolute',
					alignContent: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '100%',
					zIndex: 1,
					backgroundColor: '#000',
					opacity: 0.3,
				}}
			/>

			<View
				style={{
					backgroundColor: '#000',
					position: 'relative',
					zIndex: 2,
					padding: 50,
					overflow: 'hidden',
					borderRadius: 25,
					opacity: 0.7,
					alignItems: 'center',
					alignContent: 'center',
					justifyContent: 'center',
				}}
			>
				<ActivityIndicator
					size='large'
					color='#fff'
				/>
				<Text
					style={{
						color: '#fff',
						marginTop: 10,
					}}
				>
					Por favor espera...
				</Text>
			</View>
		</View>
	);
};

export default ProgressDialog;
