# Blog System Documentation

## User Stories

### Authentication
1. As a new user, I want to register an account so that I can access the blog system
2. As a user, I want to login to my account so that I can create and manage my posts
3. As a user, I want to logout from my account for security purposes

### Posts Management
4. As a user, I want to create a new post so that I can share my thoughts
5. As a user, I want to view all posts so that I can read content from others
6. As a user, I want to view a specific post so that I can read its details
7. As a post author, I want to edit my post so that I can update its content
8. As a post author, I want to delete my post so that I can remove unwanted content

### Comments Management
9. As a user, I want to comment on a post so that I can share my thoughts
10. As a user, I want to view comments on a post so that I can read discussions
11. As a comment author, I want to edit my comment so that I can update my thoughts
12. As a comment author, I want to delete my comment so that I can remove unwanted content

## System Analysis

### Step 0: Requirements Analysis

#### Functional Requirements (FR)
1. User Authentication
   - User registration
   - User login
   - User logout
2. Post Management
   - Create post
   - Read posts
   - Update post
   - Delete post
3. Comment Management
   - Create comment
   - Read comments
   - Update comment
   - Delete comment

#### Non-Functional Requirements (NFR)
1. Performance
   - Response time < 2s for all API calls
   - Support up to 1000 concurrent users
2. Security
   - JWT authentication
   - API key validation
   - Input sanitization
3. Scalability
   - Docker containerization
   - MySQL database
   - Prisma ORM

### Step 1: Domain Analysis

#### Main Features
1. User Management
2. Post Management
3. Comment Management

#### User Roles
1. Guest User
   - View posts
   - View comments
2. Registered User
   - All guest user features
   - Create/Edit/Delete posts
   - Create/Edit/Delete comments

```mermaid
graph TD
    A[User] --> B[Authentication]
    A --> C[Post Management]
    A --> D[Comment Management]
    B --> B1[Register]
    B --> B2[Login]
    B --> B3[Logout]
    C --> C1[Create Post]
    C --> C2[Read Posts]
    C --> C3[Update Post]
    C --> C4[Delete Post]
    D --> D1[Create Comment]
    D --> D2[Read Comments]
    D --> D3[Update Comment]
    D --> D4[Delete Comment]
```

### Step 2: Entity Analysis

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String password
        +DateTime createdAt
        +DateTime updatedAt
        +Boolean isDeleted
        +createPost()
        +updatePost()
        +deletePost()
        +createComment()
        +updateComment()
        +deleteComment()
    }

    class Post {
        +String id
        +String title
        +String content
        +String authorId
        +DateTime createdAt
        +DateTime updatedAt
        +Boolean isDeleted
        +addComment()
        +getComments()
    }

    class Comment {
        +String id
        +String content
        +String postId
        +String authorId
        +DateTime createdAt
        +DateTime updatedAt
        +Boolean isDeleted
    }

    User "1" -- "many" Post : writes
    User "1" -- "many" Comment : writes
    Post "1" -- "many" Comment : has
```

### Step 3: Process Analysis

```mermaid
stateDiagram-v2
    [*] --> Guest
    Guest --> Registered: Register
    Registered --> Guest: Logout
    Registered --> PostCreation: Create Post
    PostCreation --> PostManagement: Post Created
    PostManagement --> PostEditing: Edit Post
    PostManagement --> PostDeletion: Delete Post
    PostManagement --> CommentCreation: Add Comment
    CommentCreation --> CommentManagement: Comment Added
    CommentManagement --> CommentEditing: Edit Comment
    CommentManagement --> CommentDeletion: Delete Comment
```

### Step 4: Component Analysis

```mermaid
graph TD
    A[Blog System] --> B[Authentication Service]
    A --> C[Post Service]
    A --> D[Comment Service]
    A --> E[Database Service]
    
    B --> F[JWT Auth]
    B --> G[API Key Validation]
    
    C --> H[Post CRUD]
    C --> I[Post Validation]
    
    D --> J[Comment CRUD]
    D --> K[Comment Validation]
    
    E --> L[MySQL]
    E --> M[Prisma ORM]
```


## Prerequisites
- Docker
- Docker Compose
- Node.js (v14 or higher)

## Setup and Installation

### 1. Start Docker Services
```bash
# Build and start containers
docker-compose up -d
```

### 2. Database Setup
```bash
# Run Prisma migrations
npx prisma db pull


# Generate Prisma Client
npx prisma generate
```

### 3. Install Dependencies
```bash
# Install backend dependencies
pnpm install
```

### 4. Environment Configuration
Create `.env` file in the root directory with the following variables:
```
DATABASE_URL="mysql://bloguser:Simple123@localhost:3306/blog"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="1d"
API_KEY="your-api-secret-key"
ENABLE_API_KEY_AUTH=true
PORT=3001
```

### 5. Run the Application

#### Backend
```bash
# Development mode
pnpm run start:dev
```

### 6. Stop Docker Services
```bash
# Stop and remove containers
docker-compose down
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user


### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Comments
- `GET /posts/:id/comments` - Get comments for a post
- `POST /posts/:id/comments` - Add comment to post
- `PUT /posts/:id/comments/:commentId` - Update comment
- `DELETE /posts/:id/comments/:commentId` - Delete comment

## Database Schema

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o{ posts : "writes"
    users ||--o{ comments : "writes"
    posts ||--o{ comments : "has"

    users {
        string id PK
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
        boolean isDeleted
    }

    posts {
        string id PK
        string title
        string content
        string authorId FK
        datetime createdAt
        datetime updatedAt
        boolean isDeleted
    }

    comments {
        string id PK
        string content
        string postId FK
        string authorId FK
        datetime createdAt
        datetime updatedAt
        boolean isDeleted
    }
```

## System Architecture

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant Database

    Client->>Backend: POST /auth/register
    Backend->>Database: Create new user
    Database-->>Backend: User created
    Backend-->>Client: Return JWT token

    Client->>Backend: POST /auth/login
    Backend->>Database: Verify credentials
    Database-->>Backend: User verified
    Backend-->>Client: Return JWT token
```

### Post Management Flow

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant Database

    Client->>Backend: POST /posts (with JWT)
    Backend->>Database: Create new post
    Database-->>Backend: Post created
    Backend-->>Client: Return post data

    Client->>Backend: GET /posts
    Backend->>Database: Fetch posts
    Database-->>Backend: Return posts
    Backend-->>Client: Return posts list

    Client->>Backend: PUT /posts/:id (with JWT)
    Backend->>Database: Update post
    Database-->>Backend: Post updated
    Backend-->>Client: Return updated post
```

### Comment Management Flow

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant Database

    Client->>Backend: POST /posts/:id/comments (with JWT)
    Backend->>Database: Create new comment
    Database-->>Backend: Comment created
    Backend-->>Client: Return comment data

    Client->>Backend: GET /posts/:id/comments
    Backend->>Database: Fetch comments
    Database-->>Backend: Return comments
    Backend-->>Client: Return comments list
```

## Database Schema Details

### Users Table
- `id`: VARCHAR(36) - Primary Key
- `email`: VARCHAR(255) - Unique
- `password`: VARCHAR(255)
- `createdAt`: DATETIME
- `updatedAt`: DATETIME
- `isDeleted`: BOOLEAN

### Posts Table
- `id`: VARCHAR(36) - Primary Key
- `title`: VARCHAR(255)
- `content`: TEXT
- `authorId`: VARCHAR(36) - Foreign Key to users
- `createdAt`: DATETIME
- `updatedAt`: DATETIME
- `isDeleted`: BOOLEAN

### Comments Table
- `id`: VARCHAR(36) - Primary Key
- `content`: TEXT
- `postId`: VARCHAR(36) - Foreign Key to posts
- `authorId`: VARCHAR(36) - Foreign Key to users
- `createdAt`: DATETIME
- `updatedAt`: DATETIME
- `isDeleted`: BOOLEAN

## Relationships
- One user can write many posts (1:N)
- One user can write many comments (1:N)
- One post can have many comments (1:N)
- Comments belong to both a post and a user (N:1)
