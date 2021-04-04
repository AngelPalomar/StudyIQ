import React, { useLayoutEffect, useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { Image, StyleSheet, Text, View } from 'react-native';
import firebase from './../../../database/firebase';
const addChat = (props) => {

    const [input, setInput] = useState('');
    const [destino, setDestino] = useState('');

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: 'Crecion de chat',
            headerBackTitle: 'Chats'
        })
    }, [props.navigation])

    //Funcion para la creacion de chats 
    const createChat = async () => {

        await firebase.db.collection('chats')
            .add({ chatName: input, datos: [firebase.auth.currentUser.email, destino], })
            .then(() => { props.navigation.goBack(); })
            .catch((error) => alert(error));
    }
    return (
        <View style={styles.contenedor}>
            {/*Input del nombre del chat */}
            <Input placeholder='Escribe el tema de este chat ejem.(React Native)' value={input} onChangeText={(text => setInput(text))}
                //Icono del input 
                leftIcon={
                    <Image source={require('../../../../assets/images/messenger.png')}
                        style={{ width: 30, height: 30, alignSelf: 'center', marginVertical: 15, overflow: 'hidden', }}></Image>}>
            </Input>
            {/*Usuario de destino */}
            <Input placeholder='ingresa email del destino' value={destino} onChangeText={(text => setDestino(text))}
                leftIcon={
                    <Image source={require('../../../../assets/images/messenger.png')}
                        style={{ width: 30, height: 30, alignSelf: 'center', marginVertical: 15, overflow: 'hidden', }}></Image>}>
            </Input>
            <Button onPress={createChat} title='create chat' />
        </View>
    )
}

export default addChat

const styles = StyleSheet.create({
    contenedor: {

    },
})
