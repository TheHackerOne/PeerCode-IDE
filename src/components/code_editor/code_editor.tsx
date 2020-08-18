import React, { useEffect , useState , useRef } from 'react'
import AceEditor from 'react-ace' 
import * as Component from '@material-ui/core'
import queryString from 'querystring'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
const useStyles2 = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(0),
      minWidth: 120,
    },
  }),
);
const OtherInstanceUser=()=>{
    const classes=useStyles()
    return(
    <div className='users_online_grid'>

    </div>
    )
}

export default()=>{
    const canvasRef = useRef(null)
    const [ideLanguage,SetIdeLanguage]=useState<any>('C++')
    const [theme,setTheme]=useState<any>('')
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
    const handleIdeLang=(e:any)=>{
        SetIdeLanguage(e.target.value)
    }
    const handleTheme=()=>{

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
    console.log('called')
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
        const canvas = canvasRef.current;
        //@ts-ignore
        canvas.height=window.innerHeight;canvas.width=window.innerWidth/2;
        //@ts-ignore
        const context = canvas.getContext('2d')
        context.lineCap='round'
        context.strokeStyle={color}
        context.lineWidth=1
        contextRef.current = context;
    },[color])
    const classes=useStyles()
    const classes2=useStyles2()
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
                    <Component.FormControl className={classes2.formControl}>
                    <Component.InputLabel id="languages" className="label-up">Languages</Component.InputLabel>
                    <Component.Select
                    labelId="demo-simple-select-label"
                    id="demo-mutiple-name-label select-input"
                    value={ideLanguage}
                    onChange={handleIdeLang}
                    >
                    <Component.MenuItem value='C'>C</Component.MenuItem>
                    <Component.MenuItem value='C++'>C++</Component.MenuItem>
                    <Component.MenuItem value='Python'>Python</Component.MenuItem>
                    <Component.MenuItem value='Java' >Java</Component.MenuItem>
                    <Component.MenuItem value="Javascript" >Javascript</Component.MenuItem>
                    </Component.Select>
                    </Component.FormControl>
                    <Component.FormControl className={classes2.formControl}>
                    <Component.InputLabel id="themes" className="label-up">Themes</Component.InputLabel>
                    <Component.Select
                     label="age"
                     labelId='age'
                     id="demo-mutiple-name-label select-input"
                     value={theme}
                     onChange={handleTheme}
                    >
                    <Component.MenuItem>languages</Component.MenuItem>
                    </Component.Select>
                    </Component.FormControl>
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
            <AceEditor
                mode='java'
                theme="dracula"
                name="hey_boi"
                className='ace_output'
                editorProps={{$blockScrolling:true}}
                />
            </Component.Paper>
            </Component.Grid>
        </div>
    )
}