/**
 * Función que muestre el error en español/méxico
 */
export default function get_error(tipo) {
	switch (tipo) {
		case 'auth/email-already-in-use':
			return 'Usuario no disponible';
		case 'auth/invalid-email':
			return 'Correo electrónico inválido';
		case 'auth/user-not-found':
			return 'Usuario no encontrado';
		case 'auth/wrong-password':
			return 'contraseña incorrecta';
	}
}
