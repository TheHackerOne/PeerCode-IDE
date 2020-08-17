import React,{useEffect} from 'react'
import Firebase from '../../contexts/Firebase/Firebase'
import AuthModal from './AuthModal'
export default()=>{
    const firebase = new Firebase()
    useEffect(() => {
        console.log('work dude')
    })
    return(
        <div>
        <AuthModal/> 
        </div>
    )
}