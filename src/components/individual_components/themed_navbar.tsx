import React from 'react'
import { AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import classes from '*.module.css'
const useStyles=makeStyles({
    parent:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center',
        color:'white'
    }
})
export default () => {
    return(
        <AppBar position='static'>
        <div className={classes.parent}>
        <span>Fork On Github</span>
        <span>About Developer</span>
        </div>
        </AppBar>
    )
}