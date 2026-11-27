# Database Design

## Database Schema Diagram

- **Source:** `schema.dbml`, created using [dbdiagram.io](https://dbdiagram.io/).
- **Export:** `schema.png`, available in the `docs/screenshots/` directory.
- The diagram represents the MongoDB collections, their fields, indexes, and relationships.

## Design Decisions

### 1. Votes
- Votes are stored in a separate collection.
- A unique compound index on `(user, target)` ensures that a user can have only one active vote per post or comment.
- Each vote contains a `targetType` field (`Post` or `Comment`) to identify the type of content being voted on.
- Vote changes use an atomic `findOneAndUpdate` operation and update the target's score using `$inc` inside a MongoDB transaction.
- This approach helps maintain accurate scores when multiple voting requests happen simultaneously.

### 2. Memberships
- Community memberships are stored in a separate collection rather than as an array inside the Community document.
- A unique compound index on `(user, community)` prevents duplicate memberships.
- This design supports scalable membership management and helps prevent duplicate join operations.

### 3. Nested Comments
- Comments use a `parent` reference to identify their parent comment.
- The `depth` field represents the nesting level.
- Top-level comments have `parent = null`.
- Comment trees are built from a flat list of comments using their parent references.

### 4. Soft Deletion
- Posts and comments use `isDeleted` and `isRemoved` flags instead of immediately deleting documents.
- `isDeleted` indicates deletion by the content author.
- `isRemoved` indicates removal by a moderator.
- This allows the application to preserve discussion structure, including replies under deleted comments, which can be displayed as `[deleted]`.