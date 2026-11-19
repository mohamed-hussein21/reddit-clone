// castVote(userId, targetId, value 1|-1|0) inside a transaction: findOneAndUpdate vote (returns old) -> delta = new - old -> $inc score by delta
