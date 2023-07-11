import React, {useState} from 'react'

const Flash = ({message, classname, id}) => {
  const [showFlash, setShowFlash] = useState(false)
  return (
    <div className={`flash ${classname}`} style={{display: (!showFlash? "flex": "none")}}>
        <div className="message"> {message} </div>
        <i class="fa fa-close" onClick={()=>setShowFlash(true)} hidden={showFlash}></i>
    </div>
  )
}

export default Flash