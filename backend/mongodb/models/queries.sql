
"INSERT INTO Comments (author, blog, content, parent) VALUES(?)",
[req.body.author, req.body.blog, req.body.content, req.body.parent??(null)]

"UDPATE Comments SET deleted = 1 WHERE id = ?",
[req.body.comment]

"INSERT INTO LikesOnComments VALUES (?)",
[req.body.comment, req.body.reader]

"DELETE FROM LikesOnComments WHERE comment = ? AND reader = ?",
[req.body.comment, req.body.reader]
