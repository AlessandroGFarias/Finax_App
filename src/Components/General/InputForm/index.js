import React, { useState } from "react";
import { TextInput,
         TouchableOpacity, 
         View,} 
from "react-native";
//-------------------------------------------------------------------------
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

    
export default function InputForm( props ){

    const [hiddenPassword,setHiddenPassword] = useState(true)

    const esconderSenha = () => {
        setHiddenPassword(!hiddenPassword)
    }

    return (
             <View>
                <View style={{flexDirection:'row',alignItems:'center'}}>

                        <TextInput
                            placeholder={ props.placeholder }
                            placeholderTextColor={props.placeholderTextColor}
                            style={ props.style }
                            value={props.value}
                            secureTextEntry={ props.secureTextEntry ? hiddenPassword : false }
                            onChangeText={props.onChangeText}
                        />
                        
                    {props.secureTextEntry == true && <ButtonHide esconderSenha={esconderSenha}/>}
                </View>

            </View>

    )
} 


const ButtonHide = ( {esconderSenha} ) => {

    const [icon, setIcon] = useState('eye')
    

    return (
        <TouchableOpacity 
        onPress={ () => {
            if(icon == 'eye'){
                setIcon('eye-off')
                esconderSenha()
            } else {
                setIcon('eye')
                esconderSenha()
            }
        }}>
            <Icon name={icon} size={18} style={{marginLeft:-25}}/>
        </TouchableOpacity>
    )
}