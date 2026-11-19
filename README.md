# Reddit Clone — Web Development Fall 26

Minimal Reddit clone built with the **MERN** stack (MongoDB, Express, React + Vite, Node.js).

## Features
- [ ] Account creation & login (JWT)
- [ ] View / edit profile
- [ ] Create community · Join / leave community
- [ ] Create post in a community · View community posts · Home feed
- [ ] Upvote / downvote (one vote per user, concurrency-safe)
- [ ] Comments + nested replies
- [ ] Search communities & users
- [ ] Sort (New / Top / Hot) + pagination (infinite scroll)
- [ ] Edit / delete own posts & comments
- [ ] Moderation: community creator removes posts/comments
- [ ] **AI:** summarize a post
- [ ] **Bonus:** real-time chat (Socket.IO)
- [ ] **Bonus:** deployment

## Project structure
```
client/   React (Vite) frontend
server/   Express REST API + Socket.IO
docs/     DB schema diagram, API docs (Swagger/Postman), user stories, contributions
```

## Getting started
```bash
git clone <repo-url> && cd reddit-clone
npm run install:all
cp server/.env.example server/.env   # fill in the values
cp client/.env.example client/.env
npm run dev                          # server :5000  · client :5173
```
API docs (Swagger UI): http://localhost:5000/api-docs

## Team & contributions
See [docs/CONTRIBUTIONS.md](docs/CONTRIBUTIONS.md).

## Git workflow
See [CONTRIBUTING.md](CONTRIBUTING.md).
