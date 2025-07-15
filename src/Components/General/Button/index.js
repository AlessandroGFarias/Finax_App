import React from "react";
import {TouchableOpacity, Text} from 'react-native'
//------------------------------------------------------------------------

            
export default function Button( props ){       
    
    return(
        <TouchableOpacity 
        id={props.id}
        style={props.style}
        activeOpacity={0.7}
        onPress={props.onPress}
        >
            <Text style={props.fontStyle}>{props.name}</Text>
        </TouchableOpacity>
    )
}