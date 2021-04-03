import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import firebase from './../database/firebase';

const Listchat = ({id,chatName,enterChat}) => {
    const [chatMessages, setChatMessages] = useState([])
    useEffect(() => {
       const unsubscribe=
       firebase.db.collection('chats')
       .doc(id)
       .collection('messages')
       .orderBy('timestamp','desc')
       .onSnapshot((snapshot)=>
        setChatMessages(snapshot.docs.map((doc)=>doc.data()))
        )
        return unsubscribe;
    })
    return (
        <ListItem 
         key={id} 
         key={id} 
         bottomDivider 
         onPress={()=>enterChat(id,chatName)}>

            <Avatar 
            rounded
            source={{ uri:'https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Messenger_colored_svg-512.png'}} />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'800'}}>
                   {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1}
                ellipsizeMode='tail'
                >
                { }{chatMessages?.[0]?.message}
                </ListItem.Subtitle >
            </ListItem.Content>
        </ListItem>
    );
};

export default Listchat;
const styles=StyleSheet.create({});
