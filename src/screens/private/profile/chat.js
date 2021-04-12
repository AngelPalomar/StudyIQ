import React, { useEffect, useLayoutEffect, useState } from 'react'
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
import { query } from '../../../helpers/query/usuarios';

const chat = ({ route }) => {
    const [input, setInput] = useState('')
    const [userData, setUserData] = useState([])
    const [messages, setMessages] = useState([])
    //Query que retorna el usuario
    useEffect(() => {
        query('usuarios', 'email', '==', firebase.auth?.currentUser.email).then(list => {
            setUserData(list[0].avatar)
        });
    }, []);

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
                                        source={{ uri: `${data.putoxd}`|| 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male-256.png' }} />
                                        
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
                                    source={{ uri: `${data.putoxd}`|| 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male-256.png' }}
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
