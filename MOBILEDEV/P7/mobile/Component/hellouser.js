import React from 'react';
import {Text} from 'react-native';
export default function hellouser({name}){
    return(
        <Text styles={{fontsize: 20, marginVertical: 5}}>
            hako,{name}!
        </Text>
    );
}