import React, { useLayoutEffect, useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from './../../../database/firebase';
import Listchat from '../../../components/Listchat';
import { Avatar } from 'react-native-elements'
import { query } from '../../../helpers/query/usuarios';
const Mensajes = (props) => {

    const [userData, setUserData] = useState([])
    const [chast, setChast] = useState([])

    //Se llama la funcion query donde nos retorna el usuario 

    useEffect(() => {
        query('usuarios', 'email', '==', firebase.auth?.currentUser.email).then(list => {
            setUserData(list[0].avatar)
        });
        console.log( firebase.auth?.currentUser);
    }, []);

    //Se obtiene de los chats mediante la consulta 

    useEffect(() => {
        const colecionchats = firebase.db.collection('chats')
            .where('datos', 'array-contains-any', [firebase.auth?.currentUser.email, firebase.auth?.currentUser.email])
            .onSnapshot(onsnapshot => (setChast(onsnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))))
        return colecionchats;
    }, [])

    //Funcion que nos muestra los mensajes de ese chat

    const enterChat = (id, chatName) => {

        //En la navegacion retorna el id y nombre del chat al Chat.js
        props.navigation.navigate("Chat", { id: id, chatName: chatName, })
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 0.3}}>
            </View>
            <View style={{
                flexDirection: 'row', 
                backgroundColor: '#FAFAFF',
                paddingBottom:10,
                //Esto da un estilo como sombra
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,
                elevation: 11,
            }}>
                {/*Retorna la imagen del usuario*/}

                <View style={{ flex: 1 }}>
                    <View style={{ marginLeft: 20, marginTop:5 }}>
                        <Avatar rounded source={{ uri: firebase.auth?.currentUser.photoURL }} />
                    </View>
                </View>

                {/*Titulo*/}

                <View style={{ flex: 3 }}>
                    <View style={{ marginLeft: 70 }}>
                        <TouchableOpacity activeOpacity={0.5}>
                            <Text style={{ alignContent: 'center' }}>
                                Chat StudyIQ
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*Icono que manda a la nagacion para agregar chat */}

                <View style={{ flex: 1 }}>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => props.navigation.navigate('addChat')}>
                            <Avatar rounded source={{ uri: 'https://cdn1.iconfinder.com/data/icons/feather-2/24/edit-3-256.png' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/*Listado de los chats*/}

            <ScrollView style={styles.contenedor}>
                {chast.map(({ id, data: { chatName } }) => (
                    <Listchat key={id} id={id} chatName={chatName}
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    contenedor: {
        height: '100%'
    }
})
export default Mensajes;
