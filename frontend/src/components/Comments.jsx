import React, {useState} from 'react'
import Comment from '../components/Comment'
const Comments = ({thread, lookup, blog, getComment, level=0, idx="top"}) =>{
    return(<>
        {thread[idx]!==undefined && (
            thread[idx].map(node=>{
                const $found=lookup[node]
                return <>
                <Comment id={$found.id} author={$found.commenter} content={$found.content} likes={$found.likes} liked={$found.liked} selfw={$found.selfw} blog={blog} deleted={$found.deleted} level={level+1} getComment={getComment}/>
                <Comments thread={thread} lookup={lookup} level={level+1} idx={node} blog={blog} getComment={getComment}/>
                </>
            })
            )}
    </>)
}
export default Comments