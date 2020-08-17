import React, { useEffect , useState } from 'react'
import AceEditor from 'react-ace' 
import queryString from 'querystring'
import {makeStyles} from '@material-ui/core/styles'
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-xcode";
//@ts-ignore
import io from 'socket.io-client'
import Firebase from '../../contexts/Firebase/Firebase'
var socket:any;
let ENDPOINT='http://localhost:5000';
const useStyles=makeStyles({
    root:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center'
    }
})
export default()=>{
    const [name,setName]=useState<any>('')
    const [room,setRoom]=useState<any>('')
    const [joinMessage,SetJoinMessage]=useState<any>('')
    const [fillCode,setFillCode]=useState<any>('')
    const firebase = new Firebase()
    const handleSave=(value:any)=>{
        socket.emit('code_request',{name,room,value},(error:any)=>{
            if(error)
            alert(error)
        })
    }
    useEffect(()=>{
    const parsed=queryString.parse(window.location.search.slice(1))
    //@ts-ignore
    const secrets=JSON.parse(window.sessionStorage.getItem('secrets'))
    socket=io(ENDPOINT)
    setRoom(parsed.room)
    setName(parsed.name)
            socket.emit('join',queryString.parse(
                window.location.search.slice(1)
                ),(error:any)=>{
                if(error)
                alert(error)
            })        
    if(secrets.username!==parsed.name && secrets.room_id!==parsed.room)
            {
                alert('opened in different instance')
            }
    },[ENDPOINT])
    useEffect(()=>{
        socket.on('receive',(data:any)=>{
            setFillCode(data)
        })
    })
    const classes=useStyles()
    return(
        <div className={classes.root}>
            <AceEditor
            mode='c'
            theme="xcode"
            onChange={handleSave}
            name="hey_boi"
            value={fillCode}
            editorProps={{$blockScrolling:true}}
            />
            {joinMessage}
        </div>
    )
}