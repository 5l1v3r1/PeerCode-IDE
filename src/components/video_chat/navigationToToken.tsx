import React from 'react'
//@ts-ignore
import { v1 as uuid} from 'uuid'
export default (props:any)=>{
    function create(){
        const id = uuid();
        props.history.push(`/rooms/${id}`)
    }
    return (
        <button onClick={create}>
            Join in Video
        </button>
    )
}
