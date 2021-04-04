import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import firebase from './../database/firebase';

// Recibe los datos que se enviaron por el la navegacion 
const Listchat = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([])
    useEffect(() => {

        //query que obtine los chats 
        const unsubscribe =
            firebase.db.collection('chats').doc(id).collection('messages').orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => setChatMessages(snapshot.docs.map((doc) => doc.data())))
        return unsubscribe;
    })
    return (
        <ListItem
            key={id}
            key={id}
            bottomDivider
            onPress={() => enterChat(id, chatName)}>

            {/*Es el logo de messenger*/}
            <Avatar
                rounded
                source={{ uri: 'https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Messenger_colored_svg-512.png' }} />
            {/*Listado de los chats */}

            <ListItem.Content>
                {/*Muestra el el nombre del chat*/}
                <ListItem.Title style={{ fontWeight: '800' }}>
                    {chatName}
                </ListItem.Title>

                {/*Muestra el ultimo mensaje del chat */}
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
                    { }{chatMessages?.[0]?.message}
                </ListItem.Subtitle >
            </ListItem.Content>
        </ListItem>
    );
};

export default Listchat;
const styles = StyleSheet.create({});
