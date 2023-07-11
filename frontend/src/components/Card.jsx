import React from 'react'

const Card = ({title, content, likes, author, published, blogId, cover}) => {

  return (
    <div className="card" id={blogId}>
        <div className="cover">
            <img src={`http://localhost:2000/get_image?image=${cover}`} alt="" />
        </div>
        <div className="details">
            <h2 className="title">{title}</h2>
            <div className="second">
                <div> <i class="fas fa-heart" style={{color:'red'}}></i> {likes} </div>
                <div> Written by {author} </div>
                <div> {published} </div>
            </div>
        </div>
    </div>
  )
}

export default Card