import React, { useEffect , useState , useRef } from 'react'
import AceEditor from 'react-ace' 
import * as Component from '@material-ui/core'
import queryString from 'querystring'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import 'ace-builds/src-noconflict/theme-xcode'
import './code_editor.css'
import Sketch from 'react-p5'
import p5Types from 'p5'
import userMedia  from './user_video_player'
//@ts-ignore
import io from 'socket.io-client'
import Firebase from '../../contexts/Firebase/Firebase'
var socket:any;
let ENDPOINT='http://localhost:5000';
var drawing_points:any[]=[];
var current_path:any[]=[];
var current_peer_points:any[]=[]
const useStyles=makeStyles({
    root:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    themed_button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    navbar_theme:{
        height:'10vh',
        position:'relative',
        top:'0px'
    },
    parent:{
        display:'flex',
        flexDirection:'column',
        gridGap: "2vh"
    },
})
const useStyles2 = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(0),
      minWidth: 120,
    },
  }),
);
const CAPTURE_OPTIONS ={
    audio:false,
    video:{ facingMode : 'environment' }
}
export default()=>{
    const videoRef=useRef();
    const mediaStream = userMedia(CAPTURE_OPTIONS)
    const [media,setMedia]=useState<any>(null)
    const [eraser,setEraser]=useState<any>(true)
    const [ideLanguage,SetIdeLanguage]=useState<any>('c_cpp')
    const [theme,setTheme]=useState<any>('dracula')
    const [strokeWeight,setStrokeWeight]=useState<any>(4)
    const [checked,setChecked]=useState<any>(false)
    const [color,setColor]=useState<any>('black')
    const [name,setName]=useState<any>('')
    const [darkMode,setDarkMode]=useState<any>('black')
    const [room,setRoom]=useState<any>('')
    const [fillCode,setFillCode]=useState<any>('')
    const firebase = new Firebase()
    
    if(mediaStream && videoRef.current
        && 
        //@ts-ignore
        !videoRef.current.srcObject ){
            //@ts-ignore
            videoRef.current.srcObject = mediaStream;
        }
    
    //p5 commands..
    const setup = (p5 : p5Types , canvasRef : Element ) =>{
        p5.createCanvas(1000,1000).parent(canvasRef)
    }

    const drawPoints = ( p5 : p5Types ) => {
        p5.background(darkMode);
        p5.stroke(color);
        p5.strokeWeight(strokeWeight)
        p5.noFill();
        p5.beginShape();

        for(var i=0;i<current_peer_points.length;i++){
            p5.vertex(current_peer_points[i].x,current_peer_points[i].y)
        }
        p5.endShape()
    }

    const draw = ( p5 : p5Types ) => {
        p5.background(darkMode);
        p5.stroke(color);
        p5.strokeWeight(strokeWeight)
        p5.noFill();
        drawPoints(p5)
        drawing_points.forEach(Rowpoints=>{
            p5.beginShape();
            for(var i=0;i<Rowpoints.length;i++){
            p5.vertex(Rowpoints[i].x,Rowpoints[i].y)
            }
            p5.endShape()
        })
    }

    const handleEraser=()=>{
        if(eraser){
        setStrokeWeight(10)
        setEraser(false)
        setColor('white')
        }
        else{
        setEraser(true)
        setColor('black')
        setStrokeWeight(3)
        }
    }
    const handleCheck=()=>{
        if(checked)
        setChecked(false)
        else
        setChecked(true)
        if(theme=='dracula')
        setTheme('xcode')
        else
        setTheme('dracula')
    }
    const MouseRelease=()=>{
        current_path=[]
        current_peer_points=[]
    }
    
    const MousePressed=()=>{
        drawing_points.push(current_path)
    }

    const handleSave=(value:any)=>{
        socket.emit('code_request',{name,room,value},(error:any)=>{
            if(error)
            alert(error)
        })
    }

    const handleIdeLang=(e:any)=>{
        SetIdeLanguage(e.target.value)
    } 

    const MouseDragged = (e:any) => {
        const mouse_points={x:e.mouseX,y:e.mouseY}
        current_path.push(mouse_points)
        socket.emit('draw_peer',{mouse_points,room})
    }  
    const handleCanPlay = () => {
        //@ts-ignore
        videoRef.current.play();
    }

    useEffect(()=>{
    const parsed=queryString.parse(window.location.search.slice(1))
    //@ts-ignore
    const secrets=JSON.parse(window.sessionStorage.getItem('secrets'))
    socket=io(ENDPOINT)
    setRoom(parsed.room)
    setName(parsed.name)
    socket.emit('join',
        queryString.parse(
        window.location.search.slice(1)
        ),(error:any)=>{    
        if(error)
        alert(error)
        }
    )        
    if(secrets.username!==parsed.name && secrets.room_id!==parsed.room)
        alert('opened in different instance')   
    },[ENDPOINT,name,room])

    useEffect(()=>{
        socket.on('receive',(data:any)=>{
            setFillCode(data)
        })
        console.log('callleddllll')
    },[fillCode])
    useEffect(()=>{
        socket.on('draw_peer_catch',(data:any)=>{
            current_peer_points.push(data.mouse_points)
        })
    })
    
    const classes=useStyles()
    const classes2=useStyles2()
    return(
        <div className={classes.root}>
            <div>
                <Component.AppBar 
                position='static' 
                className={classes.navbar_theme}>
                    <Component.Container >
                    <div className={`${classes.root} adjust_top`}>
                    <Component.FormControl className={classes2.formControl}>
                    <Component.InputLabel id="languages" className="label-up">Languages</Component.InputLabel>
                    <Component.Select
                    labelId="demo-simple-select-label"
                    id="demo-mutiple-name-label select-input"
                    value={ideLanguage}
                    onChange={handleIdeLang}
                    className="indiv_list_item"
                    >
                    <Component.MenuItem value='c_cpp' >C</Component.MenuItem>
                    <Component.MenuItem value='c_cpp' >C++</Component.MenuItem>
                    <Component.MenuItem value='python'>Python</Component.MenuItem>
                    <Component.MenuItem value='java' >Java</Component.MenuItem>
                    <Component.MenuItem value="javascript"  >Javascript</Component.MenuItem>
                    </Component.Select>
                    </Component.FormControl>
                    <Component.Switch checked={checked} onChange={handleCheck} name="checkedB" />
                    </div>  
                    </Component.Container>
                </Component.AppBar>    
                <AceEditor
                mode={ideLanguage}
                theme={theme}
                onChange={handleSave}
                name="hey_boi"
                className='ace_editor'
                value={fillCode}
                editorProps={{$blockScrolling:true}}
                />
            </div>
            <Component.Grid item xs className={classes.parent} >
            <Component.Paper className='side-boxes canvas_parent' elevation={2}>
            <Component.Switch checked={eraser} onChange={handleEraser} name="checkedB" className="eraser"/>
            <Sketch setup={setup} 
            draw={draw}  
            className="our_lovely_canvas"
            mouseDragged={MouseDragged} 
            mousePressed={MousePressed}
            mouseReleased={MouseRelease}/>
            </Component.Paper>
            <Component.Paper className="side-boxes" elevation={2}>
            <section className="console-headers">OUTPUT CONSOLE</section>
            <AceEditor
                mode='java'
                theme="dracula"
                name="hey_boi"
                className='ace_output'
                editorProps={{$blockScrolling:true}}
                />
            </Component.Paper>
            </Component.Grid>
            <video 
            //@ts-ignore
            ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
        </div>
    )
}