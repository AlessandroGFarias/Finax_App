import React, { useContext } from "react";
import {  
    ActivityIndicator,
    View 
} from 'react-native'

import AuthRoutes from "./Auth.routes";
import AppRoutes from "./App.routes";
import { AuthContext } from "../contexts/auth";


function Routes() {

    const { signed, loading } = useContext( AuthContext )

    if(loading) {
        
        return (
            <View style={{
                flex: 1,
                justifyContent:'center',
                alignItems:"center",
                backgroundColor:'#656571'
            }}>
                <ActivityIndicator size={"large"} color={'#fff'} />
            </View>
        )
    }

    return (
        signed ? <AppRoutes/> : <AuthRoutes/>
    )
}

export default Routes;