# API documentation
- Live Swagger UI: `http://localhost:5000/api-docs` (generated from `server/src/docs/*.yaml`)
- Postman collection: `reddit-clone.postman_collection.json` (export from Postman into this folder)

| Resource | Base path |
|---|---|
| Auth | `/api/auth` (register, login, logout, me) |
| Users | `/api/users` (profile, edit, user posts/comments) |
| Communities | `/api/communities` (create, get, join, leave, posts) |
| Posts | `/api/posts` (CRUD, feed, sort & paginate, vote, summarize) |
| Comments | `/api/comments` (create, reply, edit, delete, vote) |
| Moderation | `/api/communities/:id/mod` (remove post/comment) |
| Search | `/api/search?q=&type=communities|users` |
| AI | `/api/posts/:id/summary` |
| Chat | `/api/chat` + Socket.IO events |
