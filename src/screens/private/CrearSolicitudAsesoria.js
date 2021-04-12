import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, Button, Linking, Alert } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import DropdownPicker from 'react-native-dropdown-picker'
import firebase from '../../database/firebase'
import styles from '../../../styles/registro.scss'
import { google } from "calendar-link";
import Snack from 'react-native-snackbar-component'

const CrearSolicitudAsesoria = (props) => {
    const [asesoria, setAsesoria] = useState({
        titulo: "",
        descripcion: "",
        inicia: {
            anio: "",
            mes: "",
            dia: "",
            hora: "",
            minuto: ""
        },
        duracion: 1,
        alumno: firebase.auth.currentUser.email,
        maestro: props.route.params.maestro
    })
    const [openSnack, setOpenSnack] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const [eventoGenerado, setEventoGenerado] = useState(false)
    const [linkEvento, setLinkEvento] = useState("")

    /**Arreglo para las fechas y días */
    let anios = [
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
        { value: "2026", label: "2026" }
    ]
    let meses = [
        { value: "0", label: "Enero" },
        { value: "01", label: "Febrero" },
        { value: "02", label: "Marzo" },
        { value: "03", label: "Abril" },
        { value: "04", label: "Mayo" },
        { value: "05", label: "Junio" },
        { value: "06", label: "Julio" },
        { value: "07", label: "Agosto" },
        { value: "08", label: "Septiembre" },
        { value: "09", label: "Octubre" },
        { value: "10", label: "Noviembre" },
        { value: "11", label: "Diciembre" }
    ]
    let dias = []

    for (let i = 1; i < 31; i++) {
        dias.push({ value: i.toString(), label: i.toString() })
    }

    let horas = []

    for (let i = 0; i < 25; i++) {
        horas.push({ value: i.toString(), label: i.toString() })
    }

    let minutos = []

    for (let i = 0; i < 6; i++) {
        minutos.push({ value: `${i * 10}`, label: `${i * 10}` })
    }

    const generarAsesoria = async () => {
        /**
         * Validaciones
         */

        if (asesoria.titulo === "" || asesoria.descripcion === "" || asesoria.duracion === "" ||
            asesoria.inicia.anio === "" ||
            asesoria.inicia.mes === "" ||
            asesoria.inicia.dia === "" ||
            asesoria.inicia.hora === "" ||
            asesoria.inicia.minuto === "") {
            setOpenSnack(true)
            setMensaje("Todos los campos son requeridos")
            return
        }

        //Genera la info del evento
        let evento = {
            title: asesoria.titulo,
            description: asesoria.descripcion,
            start: new Date(
                asesoria.inicia.anio,
                asesoria.inicia.mes,
                asesoria.inicia.dia,
                asesoria.inicia.hora,
                asesoria.inicia.minuto,
            ).toString(),
            duration: [asesoria.duracion, "hour"],
            guests: [
                asesoria.alumno,
                asesoria.maestro
            ],
            meet: true
        }

        //Asigna el link del evento
        setLinkEvento(google(evento))
        setEventoGenerado(true)

        try {
            //guarda la asesoria en la bd
            const guardarAsesoria = await firebase.db
                .collection('asesorias')
                .add({
                    ...asesoria,
                    estado: 'solicitada'
                })

            //Muestra mensaje
            setOpenSnack(true)
            setMensaje('Asesoría solicitada.')
        } catch (error) {
            //Muestra mensaje
            setOpenSnack(true)
            setMensaje(error.toString())
        }
    }

    //Función para reedirigir al calendario
    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url])

        return <Button title={children} onPress={handlePress} />;
    }

    //Volver
    const volverAPerfil = () => {
        //Vuelve atrás
        props.navigation.goBack()
    }

    return (
        <ScrollView>
            <Snack
                textMessage={mensaje}
                actionText='Aceptar'
                position="top"
                actionHandler={() => {
                    setOpenSnack(false)
                }}
                visible={openSnack} />
            <View style={{ margin: 10 }}>
                <Text style={{ marginBottom: 10, fontSize: 22 }}>
                    Datos del evento
            </Text>
                <TextInput
                    style={localStyles.input}
                    placeholder="Título"
                    maxLength={100}
                    keyboardType="default"
                    editable={!linkEvento}
                    onChangeText={(value) => setAsesoria({ ...asesoria, titulo: value })} />
                <TextInput
                    style={localStyles.input}
                    placeholder="Descripción de la asesoría"
                    maxLength={200}
                    keyboardType="default"
                    editable={!linkEvento}
                    onChangeText={(value) => setAsesoria({ ...asesoria, descripcion: value })} />
                <TextInput
                    style={localStyles.input}
                    placeholder="Duración (horas)"
                    maxLength={2}
                    keyboardType="numeric"
                    editable={!linkEvento}
                    onChangeText={(value) => setAsesoria({ ...asesoria, duracion: value })} />

                <Text style={{ marginVertical: 10, fontSize: 22 }}>
                    Inicio del evento
            </Text>
                <View style={{
                    ...(Platform.OS !== 'android' && {
                        zIndex: 1001,
                        overflow: 'hidden'
                    })
                }}>
                    <DropdownPicker
                        zIndex={1001}
                        items={dias}
                        containerStyle={styles.dropdown}
                        style={styles.dropdown__style}
                        itemStyle={styles.itemstyle}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        disabled={linkEvento}
                        onChangeItem={(item) => {
                            setAsesoria({
                                ...asesoria,
                                inicia: {
                                    ...asesoria.inicia,
                                    dia: item.value
                                }
                            })
                        }}
                        placeholder="Selecciona un día"
                    />

                    <DropdownPicker
                        zIndex={1001}
                        items={meses}
                        containerStyle={styles.dropdown}
                        style={styles.dropdown__style}
                        itemStyle={styles.itemstyle}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        disabled={linkEvento}
                        onChangeItem={(item) => {
                            setAsesoria({
                                ...asesoria,
                                inicia: {
                                    ...asesoria.inicia,
                                    mes: item.value
                                }
                            })
                        }}
                        placeholder="Selecciona un mes"
                    />

                    <DropdownPicker
                        zIndex={1001}
                        items={anios}
                        containerStyle={styles.dropdown}
                        style={styles.dropdown__style}
                        itemStyle={styles.itemstyle}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        disabled={linkEvento}
                        onChangeItem={(item) => {
                            setAsesoria({
                                ...asesoria,
                                inicia: {
                                    ...asesoria.inicia,
                                    anio: item.value
                                }
                            })
                        }}
                        placeholder="Selecciona un año"
                    />

                    <DropdownPicker
                        zIndex={1001}
                        items={horas}
                        containerStyle={styles.dropdown}
                        style={styles.dropdown__style}
                        itemStyle={styles.itemstyle}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        disabled={linkEvento}
                        onChangeItem={(item) => {
                            setAsesoria({
                                ...asesoria,
                                inicia: {
                                    ...asesoria.inicia,
                                    hora: item.value
                                }
                            })
                        }}
                        placeholder="Selecciona una hora"
                    />

                    <DropdownPicker
                        zIndex={1001}
                        items={minutos}
                        containerStyle={styles.dropdown}
                        style={styles.dropdown__style}
                        itemStyle={styles.itemstyle}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        disabled={linkEvento}
                        onChangeItem={(item) => {
                            setAsesoria({
                                ...asesoria,
                                inicia: {
                                    ...asesoria.inicia,
                                    minuto: item.value
                                },
                                fecha: new Date()
                            })
                        }}
                        placeholder="Selecciona un minuto"
                    />

                </View>
            </View>

            {
                eventoGenerado ?
                    <OpenURLButton url={linkEvento}>
                        Generar evento en el calendario
                    </OpenURLButton> :
                    <Button
                        onPress={generarAsesoria}
                        title="Solicitar asesoría" />
            }
        </ScrollView>
    )
}

export default CrearSolicitudAsesoria

const localStyles = StyleSheet.create({
    input: {
        backgroundColor: "#FFF",
        height: 50,
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 5
    }
})


