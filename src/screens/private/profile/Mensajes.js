import React, { useLayoutEffect, useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from './../../../database/firebase';
import Listchat from '../../../components/Listchat';
import { Avatar } from 'react-native-elements'
import { query } from '../../../helpers/query/usuarios';
import header from '../../../styles/estilos_header';
import estilos_header from '../../../styles/estilos_header';
import estilos_mesnajes from '../../../styles/estilos_mesnajes';
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
                backgroundColor: '#FFFFFF',
                paddingBottom:10,
                marginBottom: 1,
                //Esto da un estilo como sombra
            }}>
                {/*Retorna la imagen del usuario*/}

                <View style={{ flex: 1 }}>
                    <View style={{ marginLeft: 20, marginTop:8 }}>
                        <Avatar rounded source={{ uri: firebase.auth?.currentUser.photoURL }} />
                    </View>
                </View>

                {/* header de la pantalla */}

                {/*Titulo*/}

                <View style = {estilos_header.wrapper}>
                    <View style = {estilos_header.bg}>
                        <TouchableOpacity activeOpacity={0.5}>
                            <Text style = {estilos_header.text} >
                                Chat StudyIQ
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*Icono que manda a la nagacion para agregar chat */}

                <View style={{ flex: 1 }}>
                    <View style={{ marginLeft: 20, marginTop: 8 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => props.navigation.navigate('addChat')}>
                            <Avatar source={{ uri: 'https://cdn3.iconfinder.com/data/icons/glypho-free/64/pen-checkbox-512.png' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Mandamos a llamar al componente listchat, para mostrar el listado de los chats */}

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
        height: '100%',
        
    }
    
})
export default Mensajes;
