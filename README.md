# Forum API

## Notes:
1. Authentication with jwt through the route /authenticate - tokens last for 24 hours - middleware to check token authenticity- then send back response - add middleware to all protected pages on the site / forum

### Users:
Users consist of:
* USERNAME
* PASSWORD (saved as a hash in the database)

### Posts:
Posts consist of:
 * USERNAME The user that created the post
 * POST The post content
 * CREATED_AT The date the post was created (timestamp without timezone - default now)
 * POST_ID auto-incremented primary key - post id

 Logged out users have the ability to:
 - See a list of posts
 - See a particular post by id
 Logged in users have the ability to:
 - create a post
 - delete any posts they created
 - edit any posts they created

### Comments:
Comments consist of:
* Comment_id
* Comment data - comment
* Username of commenter - username
* Id of the post it's on - post_id
* date created - created_at

 Logged out users have the ability to:
 - View a list of comments on a post
 Logged in users have the ability to:
 - Add a comment to a post
 - Edit any of their comments
 - Delete any of their comments

### Likes

Likes consist of:
* type of like - post or comment
* username of liker
* id of liked post/comment

Logged out users have the ability to:
- view a list of likes for every post/comment

Logged in users have the ability to:
- Add a like to a post/comment
- Remove a like from a post/comment

.env with local db route & secret key for encryption

TODO: Document Routes - inputs & outputs
