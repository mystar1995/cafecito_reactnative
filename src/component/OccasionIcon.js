import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontiso from 'react-native-vector-icons/Fontisto'
export default function OccasionIcon({color,size,name = "star"})
{
    let Icon = FontAwesome

    if(name == 'block-helper' || name == "chart-line-variant" || name == "flag-triangle")
    {
        Icon = MaterialCommunityIcons
    }
    else if(name == 'birthday-cake' || name == 'gripfire')
    {
        Icon = FontAwesome5
    }
    else if(name == 'gift' || name == "users" || name == "star")
    {
        Icon = Feather
    }
    else if(name == "chat-bubble-outline")
    {
        Icon = MaterialIcons
    }
    else if(name == "smiley")
    {
        Icon = Fontiso
    }
    else if(name == "hearto")
    {
        Icon = AntDesign
    }

    return (<Icon color={color} name={name} size={size}></Icon>)

}