import React,{useEffect} from 'react'
import Firebase from '../../contexts/Firebase/Firebase'
import AuthModal from './AuthModal'
import Particles from 'react-particles-js'
export default()=>{
    const firebase = new Firebase()
    useEffect(() => {
        console.log('work dude')
    })
    return(
        <div>
        <Particles 
        className="particles"
        height="100vh"
        width="100vw"
        params={{ 
          particles: { 
            number: { 
              value: 100, 
              density: { 
                enable: true, 
                value_area: 1500, 
              } 
            }, 
          }, 
        }} 
        /> 
        <AuthModal/> 
        </div>
    )
}