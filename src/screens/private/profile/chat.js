import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, StatusBar } from 'react-native'
import { Platform } from 'react-native'
import { Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import firebase from './../../../database/firebase';
import * as firebaseG from 'firebase'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
/* 
Implementar un handler (metodo que indique que hacer [interface])
cuando existan notificaciones nuevas
*/
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});
const chat = ({ route }) => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [tokenfinal, setTokenfinal] = useState([])

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef(); //recibir
    const responseListener = useRef(); //enviar

    const [titulo, setTitulo] = useState('');
    const [token, setToken] = useState('');
    const [mensaje, setMensaje] = useState('');

    const getUsuario = async () => {
        const usermensages = await firebase.db.collection('chats')
            .doc(route.params.id)
            .collection('messages')
            .where('email', '!=', firebase.auth.currentUser.email)
            .limit(1)
            .get()
        if (!usermensages.empty) {
            const docUsuario = usermensages.docs[0].data()
            console.log('object')
            const usuario = await firebase.db.collection('usuarios')
                .where('email', '==', docUsuario.email)
                .get()

            if (!usuario.empty) {
                const docUsuario = usuario.docs[0].data()
                setTokenfinal(docUsuario);
            }
        }
    }

    const registerForPushNotificationsAsync = async () => {
        let token; //Inicializamos un token vacío

        //Solo aplicamos las notificaciones a dispositivos físicos
        if (Constants.isDevice) {
            //Pedimos permiso
            const {
                status: existingEstatus,
            } = await Notifications.getPermissionsAsync();
            let finalStatus = existingEstatus;
            if (existingEstatus !== 'granted') {
                const {
                    status,
                } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    'ERROR',
                    'Se requiere el permiso'
                );
                return;
            }

            //Tomamos el token  que nos genere el servicio
            token = (
                await Notifications.getExpoPushTokenAsync()
            ).data;
        }

        //Si no estamos en un dispositivo real
        else {
            Alert.alert(
                'ERROR',
                'Notificaciones push sólo disponibles en dispositivos físicos'
            );
        }

        //Si el dispositivo es Android, indicar que usaremos
        //el canal de distribución estandar (default)
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync(
                'default',
                {
                    name: 'default',
                    importance:
                        Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231f7c',
                }
            );
        }

        return token;
    };

    const sendPushNotification = async (token) => {
        console.log('object')
        console.log(token)
        const message = {
            to: token,
            sound: 'default',
            title: firebase.auth.currentUser.email,
            body: input,
            data: {
                autor: tokenfinal.nombres,
                autorEmail: firebase.auth.currentUser.email,
            },
        };

        /*
        Invocamos al servicio
        */
        await fetch(
            'https://exp.host/--/api/v2/push/send',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            }
        );
    };
    //Se egrega los mensajes dentro del chat 
    const sendMensajes = async () => {
        Keyboard.dismiss();
        try {
            firebase.db.collection('chats').doc(route.params.id)
                .collection('messages').add({
                    timestamp: firebaseG.firestore.FieldValue.serverTimestamp(),
                    message: input,
                    email: firebase.auth.currentUser.email,
                    putoxd: firebase.auth.currentUser.photoURL,
                });
                    sendPushNotification(tokenfinal.token)
                
        } catch (error) {
            console.log(error)
        }
        //Una vez que envio el mensaje de pone en null el input 
        setInput('');
    }

    useLayoutEffect(() => {
        //Se obtine los mensajes en tiempo real de manera desendente 
        const unsubscribe =
            firebase.db.collection('chats').doc(route.params.id).collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => setMessages(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))
                ))
        return unsubscribe;
    }, [route])
    //Query que retorna el usuario
    useEffect(() => {
        //Guarda el usuario
        getUsuario()
    }, []);

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            setExpoPushToken(token)
        );
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => setNotification(notification)
        );

        return () =>
            Notifications.removeNotificationSubscription(
                notificationListener
            );
    }, []);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar style='light' />
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={styles.contenedor}
                keyboardVerticalOffset={90}
            >
                <ScrollView contentContainerStyle={{ padding: 15 }}>
                    {messages.map(({ id, data }) =>
                        data.email === firebase.auth.currentUser.email ?
                            (
                                <View key={id} style={styles.recive}>
                                    <Avatar rounded
                                        containerStyle={{
                                            position: 'absolute',
                                            bottom: -15,
                                            right: -5,
                                        }}
                                        position='absolute'
                                        rounded
                                        bottom={-15}
                                        right={-5}
                                        size={30}
                                        source={{ uri: `${data.putoxd}` || 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male-256.png' }} />

                                    <Text style={styles.reciveText}>
                                        {data.message}
                                    </Text>
                                </View>
                            ) :
                            (<View key={id} style={styles.sender}>
                                <Avatar
                                    containerStyle={{
                                        position: 'absolute',
                                        bottom: -15,
                                        right: -5,
                                    }}
                                    position='absolute'
                                    rounded
                                    bottom={-15}
                                    right={-5}
                                    size={30}
                                    source={{ uri: `${data.putoxd}` || 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male-256.png' }}
                                />
                                <Text style={styles.senderText}>
                                    {data.message}
                                </Text>
                            </View>
                            )
                    )}
                </ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>

                        <View style={styles.footer}>
                            <TextInput placeholder="Coloca el mensaje"
                                style={styles.TextInput}
                                value={input}
                                onSubmitEditing={sendMensajes}
                                onChangeText={(text) => setInput(text)}>
                            </TextInput>
                            <TouchableOpacity onPress={sendMensajes}
                                activeOpacity={0.5}>
                                <Image
                                    source={require('../../../../assets/images/send.png')}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        alignSelf: 'center',
                                        marginTop: 5,
                                        overflow: 'hidden',
                                    }}
                                ></Image>
                            </TouchableOpacity >
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default chat

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,

    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15

    },
    recive: {
        padding: 15,
        backgroundColor: '#05197A',
        color: '#fff',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',


    },
    sender: {
        padding: 15,
        backgroundColor: '#cE8BC0',
        color: '#ffffff',
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        maxWidth: '80%',
        position: 'relative'

    },
    senderText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15,
    },
    TextInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: '#ced4da',
        padding: 10,
        color: 'grey',
        borderRadius: 38
    }
})
