import React from 'react'
import { View, Text, ImageBackground } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const TarjetaUsuario = (props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View
                style={{
                    flex: 3,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    marginBottom: 5,
                }}
            >
                <ImageBackground
                    source={{ uri: props.data.avatar }}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                        overflow: 'hidden',
                    }}
                />
            </View>

            <View
                style={{
                    flex: 11,
                    marginLeft: 10,
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '900',
                    }}
                >
                    {`${props.data.nombres} ${props.data.apellidos}`}
                </Text>
                {/* <Text
                    style={{
                        marginTop: 1,
                        color: '#535353',
                        fontSize: 10
                    }}>
                    {props.data.email}
                </Text> */}
                <Text
                    style={{
                        marginTop: 1,
                        color: '#535353',
                        fontSize: 10
                    }}>
                    {props.data.tipoUsuario}
                </Text>
            </View>
        </View>
    )
}

export default TarjetaUsuario
