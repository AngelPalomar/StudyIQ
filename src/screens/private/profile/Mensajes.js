import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { StyleSheet, TextInput,Text, View, Button, SafeAreaView } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from './../../../database/firebase';
import Listchat from '../../../components/Listchat';
import { ListItem, Avatar } from 'react-native-elements'
import {query } from '../../../helpers/query/usuarios';
const Mensajes = (props) => {
    const xd = firebase.auth?.currentUser.email;
    const user = query('usuarios', 'email', '==', firebase.auth?.currentUser.email);

    const [userData, setUserData] = useState([])

    //console.log(user)
    useEffect(() => {
        const xd = firebase.auth?.currentUser.email;

        query('usuarios', 'email', '==', firebase.auth?.currentUser.email).then(list => {
            setUserData(list[0].avatar)
        });
    }, []);

    useEffect(() => {
        if (userData.length > 0) {
            console.log(userData)
        }
    }, [userData])
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

            <ScrollView>
                <Listchat>

                </Listchat>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({})
export default Mensajes;
