import React, {useState, useEffect} from 'react'
import Card from '../components/Card'
import { Link } from 'react-router-dom'

const Home = () => {
  const [page, setPage ]= useState(1)
  const [blogs, setBlogs] = useState([])
  useEffect(()=>{
    fetch(`http://localhost:2000/blog/fetch?page=${page}`)
    .then(data=>data.json())
    .then(res =>setBlogs(res))
    .catch(err=>console.error(err))
  }, [page])

  return (
    <>
    <div>
      <h2>Trending</h2>
      <section className="popular">
        {blogs.map(blog=>
        <Link to={`read/${blog.id}`}><Card blogId={blog.id} likes={blog.likes} title={blog.title} content={blog.content} author={blog.author} published={blog.publishedAt} cover={blog.cover}/></Link>)}
      </section>
    </div>
    </>
  )
}

export default Home