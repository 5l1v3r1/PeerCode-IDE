const app = require('express')()
const server = require('http').Server(app);
const { v4: uuidv4 }=require(`uuid`)
var cors=require('cors')
const url=require('./constants')
var socket=require('socket.io')
const helper=require('./Routes/addUsers')
var io=socket(server)
global["XMLHttpRequest"] = require("xmlhttprequest").XMLHttpRequest

app.use(cors())
var socket_id;
var frontendUrl="http://localhost:3000"
const rooms=[]
var session_destroy=(chunk)=>{
    console.log(`Room has been disconnected`)
}
const video_rooms=[]
console.log(rooms)
app.get('/room_creation/:room/:name',(req,res,next)=>{
    if(rooms[req.params.room]){
    return res.status(200).send('exist')
    }    
    rooms[req.params.room]=req.params.name
    console.log(rooms)
    return res.status(200).send('into route')
})
var newConnection=(socket)=>{
    console.log(socket.id)
    socket.on('join',(data,callback)=>{
        console.log(`${data.room} created`)
        socket.join(data.room)
        callback()
    })
    socket.on('disconnect',session_destroy)
    socket.on('code_request',(data,callback)=>{
        console.log(data)
        socket.to(data.room).broadcast.emit('receive',data.value)
        callback()
    })
    socket.on('draw_peer',(data)=>{
        socket.to(data.room).broadcast.emit('draw_peer_catch',data)
    })    
}
io.sockets.on('connection',newConnection)
server.listen(5000,()=>{
    console.log('connection estabilished')
})

