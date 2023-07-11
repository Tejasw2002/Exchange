import React, {useState, useContext, useEffect} from 'react'
import ReplyField from './ReplyField'
import {AuthContext} from '../contexts/AuthContext'

const Comment = ({id, author, content, likes, liked, selfw, blog, level, getComment, deleted}) => {
  const {authState} = useContext(AuthContext)
  const [clickedReply, setClickedReply] = useState(false)
  const [likedByMe, setLikedByMe] = useState(+liked)
  const [totalLikes, setTotalLikes] = useState(+likes)
  const [more, setMore] = useState(true)
  const [page, setPage] = useState(1)
  const[remove, setRemove] = useState(deleted)
  function like(){
    fetch("http://localhost:2000/blog/comment/like",{
      method:'PATCH',
      body:JSON.stringify({comment:id}),
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authState}`
    }
    }).then(data=>{
      if(data.ok){
        if(likedByMe)
          setTotalLikes(prev=>prev-1)
        else
          setTotalLikes(prev=>prev+1)
        setLikedByMe(prev=>!prev)
      }
    }).catch(err=>console.log(err))
  }
  function reply(){
    setClickedReply(true) 
  }
  function setMoreFalse(){
    setMore(false)
  }
  function loadComments(){
    getComment(id, page, setMoreFalse)
    setPage(prev=>prev+1)
  }
  function deleteComment(){
    fetch("http://localhost:2000/blog/comment/remove",{
      method:'DELETE',
      body:JSON.stringify({comment:id}),
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authState}`
    }
    })
    .then(data=>{data.ok && setRemove(true)})
    .catch(err=>console.log(err))
  }

  return (
    <div className={`comment ${level}`} style={{marginLeft:`${level-1}00px`}} id={id}>
      <div style={{color:'grey'}}>{author == "null" ? "[deleted]" : author}</div>
      {remove ? <div>This comment has been deleted by the author</div> : <div>{content}</div>}
      <div className="action-tray" style={{marginTop:'4px'}}>
        <div onClick={like}> <i class="fas fa-heart" style={{color:`${likedByMe?"red":"black"}`}}></i> {totalLikes}</div>
        {!remove&& <div onClick={reply}><i class="fa fa-reply"></i></div>}
        {!!(selfw && !remove) && <i class="fa fa-trash-o" onClick={deleteComment}></i>}
        {more && <div onClick={loadComments}>+More</div>} 
      </div>
      {clickedReply && <ReplyField parent={id} blog={blog}/>}
    </div>
  )
}
export default Comment
