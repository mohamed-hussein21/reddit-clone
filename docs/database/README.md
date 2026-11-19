# Database design
- Diagram source: `schema.dbml` (dbdiagram.io) → export `schema.png` here.
- **Votes:** separate collection with a unique index on `(user, target)` → a user can never have 2 votes on one post.
  Vote change is done with an atomic `findOneAndUpdate` (returns old value) + `$inc` of the difference on the post score,
  inside a MongoDB transaction. This keeps the score correct even with simultaneous requests.
- **Memberships:** separate collection (unique `(user, community)`) instead of an array inside the community → scales and avoids races.
- **Nested comments:** `parent` reference + `depth`; tree is built on the client/server from a flat list.
- **Soft delete:** `isDeleted` / `isRemoved` so replies under a deleted comment remain visible ("[deleted]").
