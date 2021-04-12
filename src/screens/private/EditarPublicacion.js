import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import firebase from '../../database/firebase'

/**Componentes */
import Snack from 'react-native-snackbar-component';

/**Multimedia */
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { SafeAreaView } from 'react-native';

const EditarPublicacion = (props) => {
    const [usuarioFirebase, setUsuarioFirebase] = useState({});
    const [docUsuario, setDocUsuario] = useState({});
    const [publicacion, setPublicacion] = useState({
        autor: "",
        texto: props.route.params.datos.texto
    })
    const [imagenes, setImagenes] = useState([])
    const [file, setFile] = useState({})
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
                setImagenes(imagenes.concat(imgGaleria.uri))
            }

            //Creamos el archivo y blob
            const blob = await (await fetch(imgGaleria.uri)).blob()
            setFile(new File(
                [blob],
                `${docUsuario.id}-${imgGaleria.uri}`,
                { type: 'image/jpeg', }
            ))

            blob.close()
        }
    }

    const tomarFotoCamara = async () => {
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
                setImagenes(imagenes.concat(imgCamara.uri))
            }

            //Creamos el archivo y blob
            const blob = await (await fetch(imgCamara.uri)).blob()
            setFile(new File(
                [blob],
                `${docUsuario.id}-${imgGaleria.uri}`,
                { type: 'image/jpeg', }
            ))

            blob.close()
        }
    }

    const subirPublicacion = async () => {
        //Variable para el documento de la public
        let publicDoc = null

        //Obtiene la fecha
        let hoy = new Date()

        /**Validaciones */
        if (publicacion.texto.length === 0) {
            //Mensaje
            setOpenSnack(true)
            setSnackMessage("Escribe algo")
        }

        //Sube las fotos
        try {
            //Inicia carga
            setIsLoading(true)

            //Si hay un archivo
            if (imagenes.length > 0) {
                //Instancia de subida
                const subida = await firebase.storage
                    .ref()
                    .child('images')
                    .child('posts')
                    .child(file.name)
                    .put(file, { contentType: file.type });

                if (subida.state === 'success') {

                    //Obtiene la url
                    const urlImage = await subida.ref.getDownloadURL();

                    //Sube los datos de la publicación a firebase
                    publicDoc = await firebase.db
                        .collection('publicaciones')
                        .doc(props.route.params.datos.id)
                        .update({
                            ...publicacion,
                            imagenUrl: urlImage,
                            editado: true
                        })

                    //Para la carga
                    setIsLoading(false)

                    //Indica que ya se subió el archivo
                    setIsUpload(true)

                    setOpenSnack(true)
                    setSnackMessage("Publicado con éxito")
                }
            } else {
                //Sube los datos de la publicación a firebase
                publicDoc = await firebase.db
                    .collection('publicaciones')
                    .doc(props.route.params.datos.id)
                    .update({
                        ...publicacion,
                        editado: true
                    }).then((doc) => {
                        setIsLoading(false)
                        setIsUpload(true)
                        setOpenSnack(true)
                        setSnackMessage("Editado con éxito")
                    })
            }

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
                    //setOpenSnack(false)

                    props.navigation.goBack()

                    if (isUpload) {
                        //Vacía el arreglo de archivos e imagenes
                        setFile({})
                        setImagenes([])
                        setPublicacion({
                            ...publicacion,
                            imagenUrl: "",
                            texto: ""
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
                        marginBottom: 15
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
                            defaultValue={props.route.params.datos.texto}
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
                    imagenes.length > 0 ?
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            marginBottom: 15
                        }}>
                            {
                                imagenes.map((img, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            //Elimina la url de la imagen 
                                            setImagenes(imagenes.filter(uri => img !== uri))

                                            //elimina el archivo
                                            setArchivos(archivos.filter(file => file.name !== `${docUsuario.id}-${img}`))
                                        }}>
                                        <Image
                                            style={{
                                                width: 50,
                                                height: 50,
                                                marginHorizontal: 2.5
                                            }}
                                            source={{ uri: img }}
                                        />
                                    </TouchableOpacity>
                                ))
                            }
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
                                disabled={imagenes.length >= 1 ? true : false}
                                onPress={anadirFotografiaGaleria}>
                                <Text>GALERÍA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={imagenes.length >= 1 ? true : false}
                                onPress={tomarFotoCamara}>
                                <Text>CÁMARA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={subirPublicacion}>
                                <Text>Guardar</Text>
                            </TouchableOpacity>
                        </> :
                        <>
                            <ActivityIndicator size={20} color="#273469" />
                            <Text>Editando...</Text>
                        </>
                    }
                </View>
            </View>
            {
                props.route.params.datos.imagenUrl ?
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={{ uri: props.route.params.datos.imagenUrl }} /> : null
            }
        </SafeAreaView>
    )
}

export default EditarPublicacion

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        padding: 10
    }
})
