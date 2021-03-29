import React, { useEffect, useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView, StatusBar } from 'react-native'
import { Platform } from 'react-native'
import { Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import firebase from './../../../database/firebase';
import * as firebaseG from 'firebase'
import { query } from '../../../helpers/query/usuarios';

const chat = ({ navigation, route }) => {
    const [input, setInput] = useState('')
    const [userData, setUserData] = useState([])
    const [messages, setMessages] = useState([])
    useEffect(() => {
        query('usuarios', 'email', '==', firebase.auth?.currentUser.email).then(list => {
            setUserData(list[0].avatar)
        });
    }, []);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitle: () => {
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Avatar rounded source={{ uri: 'https://cdn1.iconfinder.com/data/icons/feather-2/24/edit-3-256.png' }} />
                    <Text style={{ color: '#000', marginLeft: '10', fontWeight: '700' }}>
                        {route.params.chatName}
                    </Text>
                </View>
            }
        })
    }, [navigation])

    const sendMensajes = async () => {
        Keyboard.dismiss();
        try {
            firebase.db.collection('chats').doc(route.params.id)
                .collection('messages').add({
                    timestamp: firebaseG.firestore.FieldValue.serverTimestamp(),
                    message: input,
                    email: firebase.auth.currentUser.email,
                });
        } catch (error) {
            console.log(error)
        }

        setInput('');
    }
    useLayoutEffect(() => {
        const unsubscribe =
            firebase.db
                .collection('chats')
                .doc(route.params.id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => setMessages(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))
                ))
        console.log(messages)
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
                <ScrollView contentContainerStyle={{padding:15}}>
                    {messages.map(({ id, data }) =>
                        data.email === firebase.auth.currentUser.email ?
                            (
                                <View key={id} style={styles.recive}>
                                    <Avatar rounded
                                        containerStyle={{
                                            position:'absolute',
                                            bottom:-15,
                                            right:-5,
                                        }}
                                        position='absolute'
                                        rounded
                                        bottom={-15}
                                        right={-5}
                                        size={30}
                                        source={{ uri: `${userData}` }} />
                                    <Text style={styles.reciveText}>
                                        {data.message}
                                    </Text>
                                </View>
                            ) :
                            (<View key={id} style={styles.sender}>
                                <Avatar
                                containerStyle={{
                                    position:'absolute',
                                    bottom:-15,
                                    right:-5,
                                }}
                                position='absolute'
                                rounded
                                bottom={-15}
                                right={-5}
                                size={30}
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
        backgroundColor: '#2E8BC0',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        color: 'white'

    },
    sender: {
        padding: 15,
        backgroundColor: '#cE8BC0',
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin:15,
        maxWidth: '80%',
       position:'relative'

    },
    senderText: {
        color:'white',
        fontWeight:'500',
        marginLeft:10,
        marginBottom:15,
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
