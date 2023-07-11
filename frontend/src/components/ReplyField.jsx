import React, {useContext} from 'react'
import {AuthContext} from '../contexts/AuthContext'
const ReplyField = ({parent, blog}) =>{
  const {authState} = useContext(AuthContext)
  async function reply(event){
    event.preventDefault()
    const body = JSON.stringify({
      content: event.target[0].value,
      parent,
      blog
    })
    fetch("http://localhost:2000/blog/comment/", {
      method:"POST",
      body,
      headers:{
        'Authorization': `Bearer ${authState}`,
        'Content-Type': "application/json"
      }
    }).then(data=>{
      if(!data.ok)
        throw "error"
      else
        event.target.reset()
    }).catch(err=>console.log(err))
  }
  return(
    <form class="comreply" onSubmit={(event)=>reply(event)}>
    <textarea name="reply"></textarea>
    <button>Post</button>
  </form>
  )
}
export default ReplyField;