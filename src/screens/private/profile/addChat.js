import React, { useLayoutEffect, useState } from 'react';
import { Button,Input } from 'react-native-elements';
import { Image, StyleSheet, Text, View } from 'react-native';
const addChat = (props) => {
    const [input, setInput] = useState('');
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title:'Crecion de chat',
            headerBackTitle:'Chats'
        })
    }, [props.navigation])
    const createChat=async()=>{
        console.log('xxx')
    }
    return (
        <View style={styles.contenedor}>
           <Input placeholder='ingresa el nombre del usuario'
           value={input} onChangeText={(text=>setInput(text))}
           leftIcon={
            <Image
            source={require('../../../../assets/images/messenger.png')}
            style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
                marginVertical: 15,
                overflow: 'hidden',
            }}
        ></Image>
        
           }
          >
           </Input>
           <Button onPress={createChat} title='create chat'>

              </Button>
        </View>
    )
}

export default addChat

const styles = StyleSheet.create({
    contenedor:{

    },
})
