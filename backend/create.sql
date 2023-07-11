CREATE TABLE `users` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(50) UNIQUE NOT NULL,
  `name` varchar(30) NOT NULL,
  `age` int NOT NULL,
  `sex` enum('male','female','other') NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `valid_email_format` CHECK (regexp_like(`email`,_cp850'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}(?:.[A-Za-z]{2,})?$')),        
  CONSTRAINT `age_in_range` CHECK (`age` between 15 and 110)
);


CREATE TABLE `blogs` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(200) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `author` varchar(36) NOT NULL,
  `publishedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cover` varchar(300),
  PRIMARY KEY (`id`),
  CONSTRAINT `foreign_key_author` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `comments` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `commenter` varchar(36) DEFAULT NULL,
  -- make it null by default so that on user account deletion we don't violate referential integrity
  `blog` varchar(36) NOT NULL,
  `content` varchar(100) NOT NULL,
  `parent` varchar(36) DEFAULT NULL,
  -- top level comments do not have a parent and hence are null by default
  `deleted` int NOT NULL DEFAULT '0',
  `commentedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `foreign_key_parent` FOREIGN KEY (`parent`) REFERENCES `comments` (`id`) ON DELETE SET NULL,
  -- we will never actually delete the reference to the parent in the children comments when the parent is deleted, instead set the deleted flag on the parent to 1
  -- this way we will be able to hide the parent comment and maintain the heirarchy of the thread 
  CONSTRAINT `foreign_key_commenter` FOREIGN KEY (`commenter`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  -- make the author field null, this means that the account of the author is deleted, but don't delete the contents of the comment
  CONSTRAINT `foreign_key_blog` FOREIGN KEY (`blog`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  -- delete all the comments associated with a blog when the blog itself is deleted
  CONSTRAINT `comments_chk_1` CHECK ((`deleted` in (0,1))),
  INDEX(`blog`)
);

CREATE TABLE `likesoncomments` (
  `comment` varchar(36) NOT NULL,
  `reader` varchar(36) NOT NULL,
  PRIMARY KEY (`comment`, `reader`),
  CONSTRAINT `foreign_key_comment_reader` FOREIGN KEY (`reader`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  -- when the user deletes their account, remove their user activity as well including likes on comments
  CONSTRAINT `foreign_key_comment` FOREIGN KEY (`comment`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  -- when a comment is deleted, delete all the information from it as well
  INDEX(`comment`)
);

CREATE TABLE `readsonblogs` (
  `reader` varchar(36) NOT NULL,
  `blog` varchar(36) NOT NULL,
  `liked` int NOT NULL DEFAULT '0',
  `readAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reader`,`blog`),
  CONSTRAINT `foreign_key_blog_reader` FOREIGN KEY (`reader`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  -- when the user deletes their account, remove their user activity as well including likes on comments
  CONSTRAINT `foreign_key_blog_read` FOREIGN KEY (`blog`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  -- when a blog is deleted, delete all realted acitivities like the views and comments on it
  CONSTRAINT `like_dislike_neutral` CHECK (`liked` in (0,1,-(1))),
  INDEX(`blog`, `liked`)
);

CREATE VIEW blog_details AS 
SELECT id, cover, title, content, author, publishedAt, likes
FROM (
    SELECT blog, SUM(liked = 1) AS likes
    FROM readsonblogs
    GROUP BY blog
    ORDER BY likes DESC
) q1 
RIGHT JOIN (
    SELECT bl.id, bl.title, bl.content, us.name as author, bl.publishedAt, bl.cover
    FROM blogs bl
    JOIN users us ON bl.author = us.id
) q2 
ON q1.blog = q2.id;


