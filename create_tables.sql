-- Create users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME(0) DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

-- Create posts table
CREATE TABLE posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    authorId VARCHAR(36) NOT NULL,
    createdAt DATETIME(0) DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    INDEX idx_posts_authorId (authorId)
);

-- Create comments table
CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY,
    content TEXT NOT NULL,
    postId VARCHAR(36) NOT NULL,
    authorId VARCHAR(36) NOT NULL,
    createdAt DATETIME(0) DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    INDEX idx_comments_postId (postId),
    INDEX idx_comments_authorId (authorId)
); 