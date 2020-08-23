import React , {Fragment} from 'react'
import ClientUI from '../user_credentials/user_cred'
import * as Component from '@material-ui/core'
import {Accordion,AccordionSummary,AccordionDetails,Typography} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {makeStyles} from '@material-ui/core/styles'
import './css/user_details.css'
//@ts-ignore
import { v1 as uuid} from 'uuid'
const useStyles=makeStyles({
    bottom_left:{
        width:'25vw',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    },
    parent:{
        position:'absolute',
        top:'80%',
        left:'5vh',
    },
    accordion_row:{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    },
    expand_icon:{
        color:"white"
    }
})
const InstructionBox=()=>{
    const classes=useStyles()
    let Instruction:any[]=[]
    Instruction=[
        'Enter Details like Your name and Room ID'+
        'you would like to make.These will be the'+ 
        'Credentials through which your code will'+ 
        'be saved in Firebase Realtime DB.',
        'Then You will see Code Editor and there is Seperate Canvas Board where you can write your logic or Thoughts',
        'Then Just Share Your Code Link to your Peer and when Peer Opens the Code Link then You will be able to see your peer and can communicate by WebCam',
        'All the manipulation on Code Editor will be seen in RealTime to Both The users.',
    ]
    return(
    <Component.Grid xs className={classes.parent}>
        <Component.Paper className={classes.bottom_left}>
        {
        Instruction.map((value,index)=>{
            return(
            <Accordion className={classes.accordion_row}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon className={classes.expand_icon}/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            > 
            <Typography className={`accordion`} >STEP {index+1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography className={`accordion-extended`}>
                {value}
            </Typography>
            </AccordionDetails>
            </Accordion>
            )
        })
        }
        </Component.Paper>
    </Component.Grid>
    )
}
export default (props:any)=>{
    const classes=useStyles()
    const create =()=> {
        const id = uuid();
        props.history.push(`/rooms/${id}`)
    }
    return (
        <div>
            <ClientUI/>
            <InstructionBox />
        </div>
    )
}
