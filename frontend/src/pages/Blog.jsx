import React, {useContext, useState, useEffect} from 'react'
import {AuthContext} from '../contexts/AuthContext'
import {useParams} from 'react-router-dom';
import Comments from '../components/Comments'

const Blog = () => {
    const [thread, setThread] = useState({})
    const [lookup, setLookup] = useState({})
    const [details, setDetails] = useState({})
    const [liked, setLiked] = useState(0)
    const {authState} = useContext(AuthContext)
    const [cover, setCover] = useState()
    const {blogId} = useParams()
    const id = blogId

    function getComments(parent=undefined, page=1, setMoreFalse=undefined){
        console.log(page)
        fetch("http://localhost:2000/blog/comment/fetch", {
            body:JSON.stringify({
                parent,
                page,
                blog:id
            }),
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authState}`
            }
        })
        .then(data=>data.json())
        .then(data=>{
            if(Object.keys(data).length === 0){
                setMoreFalse()   
                return
            }
            let to_push = []
            data.map(datum=>{
                to_push.push(datum.id)
                setLookup(prev=>({...prev, [datum.id]:datum}))
            })
            if(parent === undefined)
                parent = "top"
            if([parent] in thread)
                setThread({...thread, [parent]:[...thread[[parent]], ...to_push]})
            else
                setThread({...thread, [parent]:to_push})
        }).catch(err=>console.log("An error occured", err)) 
    }

    function likeBlog(event){
        const action = event.target.id
        let track = 0
        if((liked===-1 && action==='dislike')|| (liked===1 && action==='like'))
            track = 0;
        else
        track = action==='like'?1:-1
        fetch("http://localhost:2000/blog/like",{
            body:JSON.stringify({blog:id, liked:track}),
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authState}`
            },
            method:"PATCH"
        })
        .then(data=>{
            if(data.ok)
            setLiked(track)
        }).catch(err=>console.log("An error occured"))
    }

    useEffect(()=>{
        if(!authState)
            return;
        fetch("http://localhost:2000/blog/read",{
            body:JSON.stringify({blog:id}),
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authState}`
            },
            method:"POST"
        })
        .then(data=> data.json())
        .then(data=>{
            setDetails(data)
            setLiked(data.liked)
            getComments()
        })
        .catch(err=>console.log(err))
        getComments()
    }, [authState])

  return (
    <div className="article">
        <h1>{details.title}</h1>
        <div className="details">
            <div>Written by {details.author}</div>
            <div>{new Date(details.publishedAt).toLocaleString("en-US", {year:"numeric", month:"long", day:"numeric"})}</div>
            <div className="like-actions">
                <div>
                    {details.likes}
                    <i id="like"  onClick={(event)=>likeBlog(event)} class="fas fa-heart" style={{color:`${liked===1?"red":"black"}`}}></i>
                </div>
                <div>
                    <i id = "dislike" class="fa fa-close" onClick={(event)=>likeBlog(event)} style={{color:`${liked===-1?"red":"black"}`}}></i>
                </div>
            </div>
        </div>
        <div className="coverphoto">
            <img src={`http://localhost:2000/get_image?image=${details.cover}`} alt="" />
        </div>
        <article>
            {details.content}
        </article>
        <br />
        <br />
        <h2>Comments</h2>
        <div className="comments">
            <br />
            <Comments thread={thread} lookup={lookup} blog={blogId} getComment={getComments}/>
        </div>
    </div>
  )

}

export default Blog