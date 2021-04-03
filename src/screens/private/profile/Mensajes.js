import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { StyleSheet, TextInput,Text, View, Button, SafeAreaView } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from './../../../database/firebase';
import Listchat from '../../../components/Listchat';
import { ListItem, Avatar } from 'react-native-elements'
import {query } from '../../../helpers/query/usuarios';
import { SnapshotViewIOS } from 'react-native';
const Mensajes = (props) => {
    const [userData, setUserData] = useState([])
    const [chast, setChast] = useState([])
    //console.log(user)
    useEffect(() => {
        query('usuarios', 'email', '==', firebase.auth?.currentUser.email).then(list => {
            setUserData(list[0].avatar)
        });
    }, []);

    useEffect(() => {
        const colecionchats=firebase.db.collection('chats')
        .where('datos', 'array-contains-any',[firebase.auth?.currentUser.email,firebase.auth?.currentUser.email])
        .onSnapshot(
            onsnapshot=>
            (
                setChast(onsnapshot.docs.map(doc=>({
                  id:doc.id,
                  data:doc.data()

                })))
            ))
            console.log(firebase.auth?.currentUser.email)
            return colecionchats;
    }, [])
    const enterChat=(id,chatName)=>{
        props.navigation.navigate("Chat",{id:id,chatName:chatName,})
    }
    return (
        <SafeAreaView>
            <View style={{ flexDirection: 'row',backgroundColor:'#fff' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ marginLeft: 20 }}>
                        <Avatar rounded source={{ uri: `${userData}` }} />
                    </View>
                </View>
                <View style={{ flex: 3 }}>
                    <View style={{ marginLeft: 70 }}>
                        <TouchableOpacity activeOpacity={0.5}>
                            <Text style={{alignContent:'center'}}>
                                Chat StudyIQ
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={()=>props.navigation.navigate('addChat')}>
                             <Avatar rounded source={{ uri: 'https://cdn1.iconfinder.com/data/icons/feather-2/24/edit-3-256.png' }} />
                        </TouchableOpacity>
                    </View> 
                </View>
            </View>

            <ScrollView style={styles.contenedor}>
              {chast.map(({id,data:{chatName}})=>(
              <Listchat key={id} id={id} chatName={chatName}
              enterChat={enterChat}
              />
              ))}
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    contenedor:{
        height:'100%'
    }
})
export default Mensajes;
