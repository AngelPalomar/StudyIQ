import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebase from '../database/firebase'

const AsesoriaTarjeta = (props) => {
    const { datosAsesoria, tipoUsuario } = props

    const [docAlumno, setDocAlumno] = useState({})
    const [asesoria, setAsesoria] = useState(datosAsesoria)

    useEffect(() => {
        getDocsAlumno()
    }, [])

    const getDocsAlumno = async () => {
        const alumno = await firebase.db
            .collection('usuarios')
            .where('email', '==', datosAsesoria.alumno)
            .get()

        if (!alumno.empty) {
            const alumnoDocs = alumno.docs[0]

            //guarda la info del alumno
            setDocAlumno({ ...alumnoDocs.data(), id: alumnoDocs.id })
        }
    }

    //función para aceptar, rechazar 
    const editarAsesoria = async (estado) => {
        try {

            //Actualiza en la BD
            const actualizarAsesoria = await firebase.db
                .collection('asesorias')
                .doc(datosAsesoria.id)
                .update({
                    estado: estado
                })

            //Actualiza local
            setAsesoria({ ...asesoria, estado: estado })
        } catch (error) {

        }
    }

    return (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#273469' }}>Título: </Text>
                <Text>{asesoria.titulo}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#273469' }}>Descripción: </Text>
                <Text>{asesoria.descripcion}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#273469' }}>Estudiante: </Text>
                <Text>{docAlumno.nombres}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#273469' }}>Estado: </Text>
                <Text>{asesoria.estado}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#273469' }}>Fecha: </Text>
                <Text>
                    {new Date(
                        datosAsesoria.inicia.anio,
                        datosAsesoria.inicia.mes,
                        datosAsesoria.inicia.dia,
                        datosAsesoria.inicia.hora,
                        datosAsesoria.inicia.minuto
                    ).toString()}
                </Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10
            }}>
                {
                    tipoUsuario === "Maestro" ?
                        <>
                            {
                                asesoria.estado !== "aceptada" && (
                                    <TouchableOpacity
                                        onPress={() => editarAsesoria("aceptada")}
                                        style={{ marginRight: 15 }}>
                                        <Text>Aceptar</Text>
                                    </TouchableOpacity>
                                )
                            }
                            {
                                asesoria.estado !== "rechazada" && (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => editarAsesoria("rechazada")}
                                            style={{ marginRight: 15 }}>
                                            <Text>Rechazar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => editarAsesoria("terminada")}>
                                            <Text>Marcar como terminada</Text>
                                        </TouchableOpacity>
                                    </>
                                )
                            }
                        </> :
                        <>
                            {
                                asesoria.estado === "cancelada" ?
                                    <TouchableOpacity
                                        onPress={() => editarAsesoria("solicitada")}>
                                        <Text>Solicitar de nuevo</Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity
                                        onPress={() => editarAsesoria("cancelada")}>
                                        <Text>Cancelar asesoria</Text>
                                    </TouchableOpacity>
                            }
                        </>
                }
            </View>
        </View>
    )
}

export default AsesoriaTarjeta

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    }
})
