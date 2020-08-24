import React from 'react'
import Room from './room_peer_client'
import './css/live_app.css'
export default(props:any)=>{
    return(
        <Room roomID={props.match.params.roomID}/>
    )
}