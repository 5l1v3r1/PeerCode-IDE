import React from 'react'
import Room from './room_peer_client'
export default(props:any)=>{
    return(
        <Room roomID={props.match.params.roomID}/>
    )
}