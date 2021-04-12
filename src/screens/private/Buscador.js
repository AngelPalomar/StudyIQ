import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/core';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    ImageBackground,
    RefreshControl
} from 'react-native'
import firebase from '../../database/firebase'

/**Componentes */
import TarjetaUsuario from '../../components/TarjetaUsuario'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Buscador = (props) => {
    const [buscar, setBuscar] = useState("")
    const [listaUsuarios, setListaUsuarios] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useFocusEffect(() => {
        //Modificamos las opciones del Header del Stack (padre)
        props.navigation.dangerouslyGetParent().setOptions({
            title: 'Buscar',
        });
    });

    const buscarUsuario = async () => {
        try {
            const busqueda = await firebase.db
                .collection('usuarios')
                .orderBy('nombres')
                .startAt(buscar)
                .endAt(buscar + '\uf8ff')
                .get().then(query => {
                    let lista = []
                    query.forEach(doc => {
                        lista.push({
                            ...doc.data(),
                            id: doc.id
                        })
                    })

                    //Guarda en el estado
                    setListaUsuarios(lista)
                })
        } catch (error) {
            console.warn(error)
        }

        //para la carga
        setIsLoading(false)
    }

    //Efecto que ejecuta la búsqueda al reaccionar a lo escrito
    useEffect(() => {
        buscarUsuario()
    }, [buscar])

    return (
        <View>
            <View style={styles.card}>
                <TextInput
                    maxLength={50}
                    style={styles.input}
                    placeholder="Buscar"
                    onChangeText={val => setBuscar(val)}
                />
            </View>
            <FlatList
                style={{ marginHorizontal: 15, marginTop: 10 }}
                data={listaUsuarios}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => buscarUsuario()}
                    />
                }
                renderItem={(item) => (
                    <TouchableOpacity onPress={() =>
                        props.navigation.navigate('VerPerfil', { authId: item.item.authId })}>
                        <TarjetaUsuario data={item.item} />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()} />
        </View>
    )
}

export default Buscador

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        padding: 10,
    },
    input: {
        backgroundColor: "#EAEAEA",
        height: 50,
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10
    }
})
