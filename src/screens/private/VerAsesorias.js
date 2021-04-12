import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, RefreshControl } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import firebase from '../../database/firebase'

/**Componentes */
import AsesoriaTarjeta from '../../components/AsesoriaTarjeta'

const VerAsesorias = () => {
    const [docMiUsuario, setdocMiUsuario] = useState({})
    const [docsAsesoria, setDocsAsesoria] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        console.log("================================")
        //Trae mi usuario para después traer mis asesorías con mi tipo de usuario
        getMiUsuario()
    }, [])

    useEffect(() => {
        if (Object.keys(docMiUsuario).length !== 0) {
            getDocsAsesorias()
        }
    }, [docMiUsuario])

    const getMiUsuario = async () => {
        try {
            const miusuario = await firebase.db
                .collection('usuarios')
                .where('authId', '==', firebase.auth.currentUser.uid)
                .get()

            if (!miusuario.empty) {
                const doc = miusuario.docs[0]

                setdocMiUsuario({
                    ...doc.data(),
                    id: doc.id
                })
            }
        } catch (error) {
            console.warn(error)
        }
    }

    const getDocsAsesorias = async () => {
        //limpia el arreglo
        setDocsAsesoria([])

        try {
            //Trae mi usuario
            //Verifica el tipo de usuario
            const asesorias = await firebase.db
                .collection('asesorias')
                .where(docMiUsuario.tipoUsuario.toLowerCase(), '==', docMiUsuario.email)
                .orderBy('fecha', 'desc')
                .get()

            if (!asesorias.empty) {
                const docs = asesorias.docs
                let asesoList = []

                docs.forEach(doc => {
                    asesoList.push({ ...doc.data(), id: doc.id })
                })

                //guarda en el estado las asesorias
                setDocsAsesoria(asesoList)
            }
        } catch (error) {
            console.warn(error)
        }

        //Para la carga
        setIsLoading(false)
    }

    return (
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={isLoading}
                onRefresh={getDocsAsesorias} />
        }>
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 25, marginBottom: 15 }}>
                    Solicitudes de asesoría
                </Text>
                {
                    docsAsesoria.map((value, index) => (
                        <AsesoriaTarjeta
                            tipoUsuario={docMiUsuario.tipoUsuario}
                            datosAsesoria={value}
                            key={index} />
                    ))
                }
            </View>
        </ScrollView>
    )
}

export default VerAsesorias

const styles = StyleSheet.create({})

