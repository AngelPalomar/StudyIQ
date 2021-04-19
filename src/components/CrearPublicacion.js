import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import firebase from '../database/firebase'

/**Componentes */
import Snack from 'react-native-snackbar-component';

/**Multimedia */
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { SafeAreaView } from 'react-native';

const CrearPublicacion = () => {
    const [usuarioFirebase, setUsuarioFirebase] = useState({});
    const [docUsuario, setDocUsuario] = useState({});
    const [publicacion, setPublicacion] = useState({
        autor: "",
        texto: "",
        imagenUrl: null
    })
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isUpload, setIsUpload] = useState(false)
    const [openSnack, setOpenSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState("")

    //Creacion de un hook para guardar datos del usuario
    useEffect(() => {
        setUsuarioFirebase(firebase.auth.currentUser);
        //invocamos la consulta
        setDocUsuario(firebase.auth.currentUser.uid);

        setPublicacion({ ...publicacion, autor: firebase.auth.currentUser.email })
    }, []);

    const anadirFotografiaGaleria = async () => {
        try {
            //Permisos
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status === "granted") {
                const imgGaleria = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 4],
                    quality: 1,
                });

                //Subimos la uri al estado
                if (typeof imgGaleria !== "undefined") {
                    //añadimos las url al estado
                    setPublicacion({ ...publicacion, imagenUrl: imgGaleria.uri })
                }

                //Creamos el archivo y blob
                const blob = await (await fetch(imgGaleria.uri)).blob()
                setFile(new File(
                    [blob],
                    `${docUsuario.id}-${imgGaleria.uri}`,
                    { type: 'image/jpeg', }
                ))

                blob.close()
            } else {
                //Muestra alerta de error
                Alert.alert(
                    'Error',
                    'No se pudo acceder a la galería',
                    [
                        {
                            text: 'Aceptar',
                            onPress: null
                        }
                    ])
            }
        } catch (error) { }
    }

    const tomarFotoCamara = async () => {
        try {
            //Obtenemos los permisos
            const permisoCamara = await Permissions.askAsync(Permissions.CAMERA);
            const permisoGaleria = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

            // Si obtenemos los permisos
            if (permisoCamara.status === 'granted' && permisoGaleria.status === 'granted') {

                //parametros de la img 
                const imgCamara = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 4],
                    quality: 1,
                });

                //Subimos la uri al estado
                if (typeof imgCamara !== "undefined") {
                    //añadimos las url al estado
                    setPublicacion({ ...publicacion, imagenUrl: imgCamara.uri })
                }

                //Creamos el archivo y blob
                const blob = await (await fetch(imgCamara.uri)).blob()
                setFile(new File(
                    [blob],
                    `${docUsuario.id}-${imgGaleria.uri}`,
                    { type: 'image/jpeg', }
                ))

                blob.close()
            } else {
                //Muestra alerta de error
                Alert.alert(
                    'Error',
                    'No se pudo acceder a la cámara',
                    [
                        {
                            text: 'Aceptar',
                            onPress: null
                        }
                    ])
            }
        } catch (error) { }
    }

    const subirPublicacion = async () => {
        //Variable para el documento de la public
        let publicDoc = await firebase.db.collection('publicaciones')

        //Obtiene la fecha
        let hoy = new Date()

        //Destructuro el texto para evitar espacios y lo trimeo
        let { texto } = publicacion
        texto = texto.trim()

        /**Validaciones */
        if (texto.length === 0) {
            //Mensaje
            setOpenSnack(true)
            setSnackMessage("Escribe algo")
            return
        }

        //Obejto a subir
        let postDocumento = {
            texto: publicacion.texto,
            autor: publicacion.autor,
            imagenUrl: null,
            fecha: {
                dia: String(hoy.getDate()).padStart(2, '0'),
                mes: String(hoy.getMonth() + 1).padStart(2, '0'),
                anio: hoy.getFullYear().toString(),
                hora: hoy.getHours().toString(),
                minuto: hoy.getMinutes().toString(),
                segundo: hoy.getSeconds().toString()
            }
        }

        //Sube las fotos
        try {
            //Inicia carga
            setIsLoading(true)

            //Si hay un archivo
            if (publicacion.imagenUrl !== null) {
                //Instancia de subida
                const subida = await firebase.storage
                    .ref()
                    .child('images')
                    .child('posts')
                    .child(file.name)
                    .put(file);

                //Obtiene la url
                const urlImage = await subida.ref.getDownloadURL();

                //Guarda la url en el objeto
                postDocumento.imagenUrl = urlImage

                //Sube los datos de la publicación a firebase
                publicDoc.add(postDocumento)

                //Para la carga
                setIsLoading(false)

                //Indica que ya se subió el archivo
                setIsUpload(true)

                setOpenSnack(true)
                setSnackMessage("Publicado con éxito")
            } else {
                //Sube los datos de la publicación a firebase
                publicDoc.add(postDocumento)
                    .then((doc) => {
                        setIsLoading(false)
                        setIsUpload(true)
                        setOpenSnack(true)
                        setSnackMessage("Publicado con éxito")
                    })
            }

            //Limpia el campo de texto

        } catch (error) {
            setIsLoading(false)
            setOpenSnack(true)
            setSnackMessage("Ocurrió un error")
            console.warn(error)
        }
    }

    return (
        <SafeAreaView>
            <Snack
                textMessage={snackMessage}
                actionText='Aceptar'
                actionHandler={() => {
                    setOpenSnack(false)

                    if (isUpload) {
                        //Vacía el arreglo de archivos e imagenes
                        setFile(null)
                        setPublicacion({
                            ...publicacion,
                            imagenUrl: null,
                            texto: "",
                        })
                        setIsUpload(false)
                    }
                }}
                visible={openSnack} />
            <View style={{ ...styles.card, marginBottom: 10 }}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10
                    }}>
                        <ImageBackground
                            source={{ uri: firebase.auth.currentUser.photoURL }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                overflow: 'hidden',
                            }}
                        />
                        <TextInput
                            style={{
                                backgroundColor: "#EAEAEA",
                                height: 50,
                                width: '85%',
                                marginHorizontal: 5,
                                borderRadius: 10,
                                paddingHorizontal: 10
                            }}
                            keyboardType="default"
                            multiline
                            maxLength={255}
                            placeholder="Comparte un conocimiento"
                            onChangeText={value => setPublicacion({ ...publicacion, texto: value })} />
                    </View>
                </View>

                {
                    /**
                     * Esta vista solo se muestra si hay imágenes seleccionadas
                     */
                    publicacion.imagenUrl ?
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            marginBottom: 15
                        }}>
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    marginHorizontal: 2.5
                                }}
                                source={{ uri: publicacion.imagenUrl }}
                            />
                        </View> : null
                }

                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                    {/**Si son 4 imágenes, ya no se puede agregar más */}
                    {!isLoading ?
                        <>
                            <TouchableOpacity
                                onPress={anadirFotografiaGaleria}>
                                <Text>GALERÍA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={tomarFotoCamara}>
                                <Text>CÁMARA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={subirPublicacion}>
                                <Text>Publicar</Text>
                            </TouchableOpacity>
                        </> :
                        <>
                            <ActivityIndicator size={20} color="#273469" />
                            <Text>Publicando...</Text>
                        </>
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

export default CrearPublicacion

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        padding: 10
    }
})
