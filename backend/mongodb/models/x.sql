DROP DATABASE IF EXISTS blogapp;
CREATE DATABASE Blogapp;
USE Blogapp;

CREATE TABLE Users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(50) NOT NULL UNIQUE CHECK (email RLIKE '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$'),
    name VARCHAR(30) NOT NULL,
    age INT (4) CHECK (age BETWEEN 15 AND 110),
    sex ENUM ('male', 'female', 'other'),
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE Blogs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(36) NOT NULL,
    content VARCHAR(100) NOT NULL,
    author VARCHAR(36) NOT NULL,
    publishedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES Users(id) ON DELETE CASCADE
    -- delete the blogs of the author when they delete their account
);

CREATE TABLE ReadsOnBlogs(
    reader VARCHAR(36),
    blog VARCHAR(36),
    liked INT DEFAULT 0 NOT NULL CHECK(liked IN (0, 1, -1)),
    readAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (reader, blog),
    FOREIGN KEY (reader) REFERENCES Users (id) ON DELETE CASCADE,
    -- delete the information about their reading activity when the user deletes their account 
    FOREIGN KEY (blog) REFERENCES Blogs (id) ON DELETE CASCADE
    -- delete the comments when the blog is removed from the database
);

CREATE TABLE Comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    author VARCHAR(36),
    -- if the author of the comment deletes their account, we will set it to null, while preserving their comment
    blog VARCHAR(36) NOT NULL,
    content VARCHAR(100),
    parent VARCHAR(36) DEFAULT NULL,
    deleted INT NOT NULL DEFAULT 0 CHECK(deleted in (0,1)),
    -- if the comment is deleted, set it to 1, DO NOT DELETE THE ACTUAL COMMENT
    commentedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent) REFERENCES comments(id),
    FOREIGN KEY (author) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (blog) REFERENCES blogs(id) ON DELETE CASCADE
    -- If the blog gets deleted, we will delete all the comment threads on it as well
);

CREATE TABLE LikesOnComments(
    comment VARCHAR(36) NOT NULL,
    reader VARCHAR(36) NOT NULL,
    FOREIGN KEY (reader) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment) REFERENCES Comments(id) ON DELETE CASCADE,
    PRIMARY KEY(comment, reader)
);
