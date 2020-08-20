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
    socket.on('canvas_test',(data)=>{
        socket.to(data.room).broadcast.emit('canvas_test_rec',data)
    })
    socket.on('canvas_point_push',(data)=>{
        socket.to(data.room).broadcast.emit('canvas_point_push_rec',data)
    })
    socket.on('handle_end_draw',(data)=>{
        socket.to(data).broadcast.emit('canvas_end_draw',data)
    })
    

}
io.sockets.on('connection',newConnection)
server.listen(5000,()=>{
    console.log('connection estabilished')
})

