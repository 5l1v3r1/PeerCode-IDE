import React from 'react'
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles} from '@material-ui/core/styles';
const useStyles=makeStyles({
    custom_icon:{
        color:'white'
    }
})

export default () => {
    const classes = useStyles()
    return(
        <div className={classes.custom_icon} >
        < InfoIcon />
        </div>
    )
}