import React, { useEffect , useState , useRef } from 'react'
import AceEditor from 'react-ace' 
import * as Component from '@material-ui/core'
import queryString from 'querystring'
import {makeStyles} from '@material-ui/core/styles'
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-dracula";
import './code_editor.css'
//@ts-ignore
import io from 'socket.io-client'
import Firebase from '../../contexts/Firebase/Firebase'
var socket:any;
let ENDPOINT='http://localhost:5000';
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
        justifyContent:'space-between',
        gridGap: "2vh"
    },
})
const OtherInstanceUser=()=>{
    const classes=useStyles()
    return(
    <div className='users_online_grid'>

    </div>
    )
}

export default()=>{
    const canvasRef = useRef(null)
    const [checked,setChecked]=useState<any>(true)
    const [color,setColor]=useState<any>('black')
    const contextRef = useRef(null)
    const [users,setUsers]=useState<any[]>([])
    const [name,setName]=useState<any>('')
    const [room,setRoom]=useState<any>('')
    const [joinMessage,SetJoinMessage]=useState<any>('')
    const [fillCode,setFillCode]=useState<any>('')
    const [isDrawing,SetIsDrawing]=useState<any>(false)
    const firebase = new Firebase()
    const handleSave=(value:any)=>{
        socket.emit('code_request',{name,room,value},(error:any)=>{
            if(error)
            alert(error)
        })
    }
    const handleEraser=(e:any)=>{
        if(checked)
        {setChecked(false)}
        else{
        //@ts-ignore    
        setChecked(true);
        }
    }
    //@ts-ignore
    const startDrawing=({nativeEvent})=>{
        const {offsetX,offsetY}=nativeEvent;
        //@ts-ignore
        contextRef.current.beginPath()
        //@ts-ignore
        contextRef.current.moveTo(offsetX,offsetY)
        SetIsDrawing(true)
    }
    const finishDrawing=()=>{
        //@ts-ignore
        contextRef.current.closePath()
        SetIsDrawing(false)
    }
    //@ts-ignore
    const draw=({nativeEvent})=>{
        if(!isDrawing)
        {
            return;
        }
        const{offsetX,offsetY}=nativeEvent
        //@ts-ignore
        contextRef.current.lineTo(offsetX,offsetY)
        //@ts-ignore
        contextRef.current.stroke()
        //@ts-ignore
        console.log('drawingnnnnn')
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
    },[ENDPOINT])
    useEffect(()=>{
        socket.on('receive',(data:any)=>{
            setFillCode(data)
        })
    })
    useEffect(()=>{
        const canvas = canvasRef.current;
        //@ts-ignore
        canvas.height=window.innerHeight;canvas.width=window.innerWidth/2;
        //@ts-ignore
        const context = canvas.getContext('2d')
        context.lineCap='round'
        context.strokeStyle='black'
        context.lineWidth=5
        console.log(color)
        contextRef.current = context;
    },[checked])
    const classes=useStyles()
    return(
        <div className={classes.root}>
            <OtherInstanceUser

            />
            <div>
                <Component.AppBar 
                position='static' 
                className={classes.navbar_theme}>
                    <Component.Container >
                    <div className={`${classes.root} adjust_top`}>
                    <select>
                    <option>languages</option>
                    </select>
                    <select>
                    <option>Themes</option>
                    </select>
                    <Component.Switch className="slider"/>  
                    </div>  
                    </Component.Container>
                </Component.AppBar>    
                <AceEditor
                mode='java'
                theme="dracula"
                onChange={handleSave}
                name="hey_boi"
                className='ace_editor'
                value={fillCode}
                editorProps={{$blockScrolling:true}}
                />
            </div>
            <Component.Grid item xs className={classes.parent} >
            <Component.Paper className='side-boxes' elevation={2}>
            <section className="console-headers">
                <Component.Switch
                onChange={handleEraser}
                checked={checked}
                />
                LOGIC CONSOLE
                <span className="secondary-header">
                    (You Can Draw your logic Here to Visualise)
                </span>
            </section>
            <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
                className="canvas"
            />
            </Component.Paper>
            <Component.Paper className="side-boxes" elevation={2}>
            <section className="console-headers">OUTPUT CONSOLE</section>
            </Component.Paper>
            </Component.Grid>
        </div>
    )
}