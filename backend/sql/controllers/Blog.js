const getRelativeTime = require('../utils/relativeTime')

async function addBlog(req, res, next){
    const query = "INSERT INTO Blogs (title, content, author) VALUES(?, ?, ?)"
    const params = [req.body.title, req.body.content, req.body.author||req.body.user_id].map(param=>param??null)
    try{
        const result = await db.execute(query, params)
        res.status(200).json("ok")
    }catch(err){
        console.error(err)
        next({"status":500, "error":err.sqlMessage||err})
    }
}

async function deleteBlog(req, res, next){
    const query = "DELETE FROM Blogs WHERE id =  ?"
    const params = [req.body.blog]
    try{
        const result = await db.execute(query, params)
        const exists  = result[0]['affectedRows']
        if(exists)
            res.status(200).json("ok")
        else
            throw "This blog does not exist"
    }catch(err){
        next(JSON.stringify({"message":err.sqlMessage || err, "status":500}))
    }
}

async function getBlog(req, res, next){
    const blogQuery = "SELECT title, cover, content, publishedAt, (SELECT name FROM users WHERE id = (SELECT author FROM blogs WHERE id=?)) as author FROM blogs WHERE id = ?";
    const likesQuery = "SELECT SUM(CASE WHEN liked=1 THEN 1 ELSE 0 END) AS likes FROM readsonblogs WHERE blog = ? GROUP BY blog";
    const likeStatus = "SELECT liked FROM readsOnBlogs WHERE blog = ? AND reader = ?"
    const params = [req.body.reader||req.body.user_id, req.body.blog].map(param=>param??null)
    try{

        const [result1,] = await db.execute(blogQuery, [params[1], params[1]])
        const [result2, ] = await db.execute(likesQuery, [params[1]])
        const [result3, ] = await db.execute(likeStatus, params.reverse())
        const result = {...result1[0], ...result2[0], ...result3[0]}
        return result
    }catch(err){
        console.log(err)
        throw JSON.stringify({}) 
    }
}

async function getComments(req, res, next){
    console.log(req.body.page)
    const query = `with cte1 as (select
            id,
            commenter,
            content,
            deleted,
            case when commenter=? then 1 else 0 end as selfw
        from comments
            where parent ${req.body.parent===undefined ? "is null" : "='"+req.body.parent+"' "}
            and blog = ?),
        cte2 as (
            select comment,
            count(*) as likes,
            sum(case when reader = ? then 1 else 0 end) as liked
            from likesoncomments group by comment
        )
        select cte1.id, content, users.name as commenter, deleted, selfw, coalesce(likes,0) as likes, coalesce(liked,0) as liked 
        from cte1 left join cte2 on cte1.id = cte2.comment 
        left join users on cte1.commenter = users.id
        ORDER BY 
            likes DESC
        LIMIT 10 OFFSET ${(req.body.page-1)*10}`
        // LIMIT 10 OFFSET 0`
    const params = [req.body.user_id, req.body.blog, req.body.user_id]
    console.log(req.body.user_id, req.body.blog, req.body.parent)
    try{
        const [result, ] = await db.execute(query,params)
        console.table(result)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        next({"status":500, "error":err.sqlMessage||err})
    }
}

async function updateReadsOnBlog(req, res, next){
    const query = "INSERT IGNORE INTO ReadsOnBlogs (reader, blog) VALUES(?, ?)"
    // the ignore keyword will not insert the record with the same reader and blog values pair
    const params = [req.body.reader||req.body.user_id, req.body.blog].map(param=>param??null)
    try{
        const read = await db.execute(query, params)
        const result = await getBlog(req)
        console.log(result)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        next({"status":500, "error":err.sqlMessage||err})
    }
}

async function likeBlog(req, res, next){
    const query = "UPDATE ReadsOnBlogs SET liked = ? WHERE reader = ? AND blog = ?"
    const params = [req.body.liked, req.body.reader||req.body.user_id, req.body.blog].map(param=>param??null)
    try{
        const result = await db.execute(query, params)
        console.log(result)
        res.status(200).json("ok")
    }catch(err){
        next(JSON.stringify({"status":500, "message":err.sqlMessage||err}))
    }
}

async function getBlogs(req, res, next){
    const OFFSET = 20
    const param = (req.body.page-1>=0||0)*OFFSET
    const query = `SELECT id, title, cover, author, publishedAt, case when likes is null then 0 else likes end as likes FROM blog_details ORDER BY likes DESC, publishedAt DESC LIMIT 20 OFFSET ${param}`
    try{
        const [rows, ] = await db.execute(query)
        rows.forEach(row=>row['publishedAt'] = getRelativeTime(row.publishedAt))
        console.table(rows)
        res.status(200).json(rows)
    }catch(err){
        console.log(err)
        next(JSON.stringify({"status":500, "message":err.sqlMessage||err}))
    }
}

async function comment(req, res, next){
    const query = "INSERT INTO Comments(commenter, blog, content, parent) VALUES(?, ?, ?, ?)"
    const params = [req.body.author||req.body.user_id, req.body.blog, req.body.content, req.body.parent].map(param=>param??null)
    try{
        const result = await db.execute(query, params)
        console.log(result)
        res.status(200).json("ok")
    }catch(err){
        next(JSON.stringify({"status":500, "message":err.sqlMessage||err}))
    }
}

async function deleteComment(req, res, next){
    const query = "UPDATE Comments SET deleted = 1 WHERE id=?"
    const params = [req.body.comment].map(param=>param??null)
    try{
        const result = await db.execute(query, params)
        console.log(result)
        res.status(200).json("ok")
    }catch(err){
        next(JSON.stringify({"status":500, "message":err.sqlMessage||err}))
    }
}

async function likeComment(req, res, next){
    const queryLiked = "SELECT COUNT(comment) as liked FROM LikesOnComments WHERE comment = ? AND reader = ?"
    const queryLike = "INSERT INTO LikesOnComments(comment, reader) VALUES(?, ?)"
    const queryUnlike = "DELETE FROM LikesOnComments WHERE comment = ? AND reader = ?"
    const params = [req.body.comment, req.body.reader||req.body.user_id].map(param=>param??null)
    try{
        const [liked,] = await db.execute(queryLiked, params)
        let result
        if(liked[0].liked)
            result = await db.execute(queryUnlike, params)
        else
            result = await db.execute(queryLike, params)
        console.log(result)
        res.status(200).json("ok")
    }catch(err){
        next(JSON.stringify({"status":500, "message":err.sqlMessage||err}))
    }
}



module.exports = {
    addBlog,
    deleteBlog,
    updateReadsOnBlog,
    likeBlog,
    getBlogs,
    getBlog,
    comment,
    getComments,
    deleteComment,
    likeComment
}