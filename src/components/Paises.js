import React from 'react';
import {
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
const Paises = ({ datosPaises }) => {
    console.log(datosPaises);
    return (
        <TouchableOpacity>
            <DropDownPicker
                items={[
                    { label: datosPaises.name, value: datosPaises.name, icon: () => <Icon name="flag" size={10} color="#900" />, hidden: true },
                ]}
                containerStyle={{ height: 40 }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                    justifyContent: 'flex-end'
                }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onChangeItem={item => this.setState({
                    country: item.value
                })}
            />
        </TouchableOpacity>
    );
};

export default Paises;
