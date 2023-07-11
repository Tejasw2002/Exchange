import React, { useState } from 'react'

const Formfield = ({type, name, label, error, options}) => {

    const [height, setHeight] = useState("auto")

    const [passwordType, setpasswordType] = useState('password')
    function toggle(event){
        if (passwordType==='password') setpasswordType('text'); else setpasswordType('password')
    }

    function handleInput(event){
        const elem = event.target
        elem.style.height = height
        if(elem.scrollHeight > elem.clientHeight){
            setHeight(prev => `auto`)
            setHeight(prev => `${elem.scrollHeight}px`)
        }
    }

    if(type==='button')
        return (<div className="formfield">
            <button type="submit" name={name} id={name}>{label}</button>
            </div>)
  return (
    <div className="formfield">
        <label htmlFor={name}>
            <h3>{label}</h3>
        </label>
        {["text", "number", "email", "file"].includes(type) && <input type={type} name={name} id={name}></input>}
        {type==='textarea' && <textarea name={name} id={name} onInput={(event)=>handleInput(event)}></textarea>}
        {type==='password' && 
        <>
            <input type={passwordType} name={name} id={name}/>
            <span className="toggle" onClick={(event)=>toggle(event)}>{passwordType==='password' ? <small>Show Password</small> : <small>Hide Password</small>}</span>
        </>}
        {type==='select' && <select name={name} id={name}>
            <option value="" selected default></option>
            {options.map(option=>
                <option value={option.toLowerCase()} key={option}>{option}
                </option>
            )}
        </select>}
        <div className="error">{error}</div>
    </div>
  )
}

export default Formfield