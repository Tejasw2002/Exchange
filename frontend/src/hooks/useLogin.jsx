import {useState, useContext} from 'react'
import {AuthContext} from '../contexts/AuthContext'

const useLogin = ()=>{

    const [error, setError] = useState({})
    const [displayFlash, setDisplayFlash] = useState(false)
    const {authDispatch} = useContext(AuthContext)

    async function handleSubmit(event){
        event.preventDefault()
        setDisplayFlash(false)
        event.target[event.target.length-1].disabled = true
        setError({})
        let copyErr = {}
        let copyVal = {}
        for(let i=0; i<event.target.length-1; i++){
            const name = event.target[i].name
            const value = event.target[i].value.trim()
            copyVal[name] = value
            if(!value)
                copyErr[name] = "This field cannot be left blank"
        }
        if(Object.keys(copyErr).length===0){
            try{
                const res = await fetch("http://localhost:2000/user/login/",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(copyVal)
                })
                if(res.ok){
                    const {id, token} = await res.json()
                    authDispatch({type:"login", payload:{token}})
                    setDisplayFlash(true)
                    event.target.reset()
                }
                else
                    throw res
            }
            catch(err){
                const genErr = await err.json()
                console.log(genErr)
                copyErr["general"] = genErr.message
                setError(copyErr)
            }
        }
        else{
            setError(copyErr)
        }
        event.target[event.target.length-1].disabled = false
    }

    return({
        error,
        handleSubmit,
        displayFlash
    })

}

export default useLogin