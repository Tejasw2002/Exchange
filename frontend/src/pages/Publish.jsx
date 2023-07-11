import React from 'react'
import Formfield from '../components/Formfield'
import usePublish from '../hooks/usePublish'

const Publish = () => {
    const {handlePublish, error} = usePublish()
  return (
    <form onSubmit={(event)=>handlePublish(event)} className="publish">
        <div className='form-head'>
          <h1>Publish Your Blog</h1>
        </div>
        <div className="error">{error.general}</div>
        <Formfield name="title" label="Title"  error={error.title} options={undefined} type="text"/>
        <Formfield name="content" label="Content"  error={error.content} options={undefined} type="textarea"/>
        <Formfield name="cover" label="Cover"  error={undefined} options={undefined} type="file"/>
        <Formfield name="publish" label="Publish" error={undefined} options={undefined} type="button"/>
    </form>
  )
}

export default Publish