import {useState, useContext} from 'react'
import {AuthContext} from '../contexts/AuthContext'

const usePublish = ()=>{
    const [error, setError] = useState({})
    const {authState, authDispatch} = useContext(AuthContext)

    const handlePublish = async (event)=>{
        event.preventDefault()
        let copyErr = {}
        setError({})
        for(let i=0; i<event.target.length-1; i++){
            if(event.target[i].value==="")
                copyErr[event.target[i].name] = "This field cannot be left blank"
        }
        setError(copyErr)
        if(Object.keys(copyErr).length===0){
            const body = {
                [event.target[0].name]: event.target[0].value,
                [event.target[1].name]: event.target[1].value,
            }
            console.log(body)
            const res = await fetch ("http://localhost:2000/blog/publish/", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authState}`
                  },
                body: JSON.stringify(body)
            })
            if(res.ok)
                event.target.reset()
            const printOnConsole = await res.json()
        }
    }

    return({
        error, handlePublish
    })
}

export default usePublish