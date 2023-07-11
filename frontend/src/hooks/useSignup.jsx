import {useState, useContext} from 'react'
import {AuthContext} from '../contexts/AuthContext'

const useSignup = ()=>{

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
            else{
                switch(name){
                    case "email":
                        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
                            copyErr["email"] = "Invalid email format"
                        break;
                    case "password":
                        let errString = ""
                        if(!/[A-Z]/.test(value)) errString+="Password must have one uppercase letter\n"
                        if(!/[a-z]/.test(value)) errString+="Password must have one lowercase letter\n"
                        if(!/[0-9]/.test(value)) errString+="Password must have one digit\n"
                        if(!/[!@#$%]/.test(value)) errString+="Password must have one special character (!, @, #, $, %)\n"
                        if(value.length<8) errString+="Pasword must be more than 8 characters long"
                        if(errString)
                            copyErr['password'] = errString.trim()
                    break;
                    case "age":
                        if(+value<15)
                            copyErr['age'] = "You cannot be less than 15 years of age to make an account"
                        if (+value>110)
                            copyErr['age'] = "Age figure too large"
                    break;
                    default:
                    break;
                }
            }
        }
        if(Object.keys(copyErr).length===0){
            try{
                const res = await fetch("http://localhost:2000/user/signup/",{
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
            console.log(copyErr)
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

export default useSignup