# Git workflow

## Branches
- `main` → always working, protected (merge by Pull Request only)
- `dev`  → integration branch, all features merge here first
- `feature/<name>` e.g. `feature/auth`, `feature/votes`, `fix/comment-delete`

## Daily flow
```bash
git checkout dev && git pull
git checkout -b feature/votes
# ...work...
git add . && git commit -m "feat(votes): add vote endpoint"
git push -u origin feature/votes
# open Pull Request -> dev, at least 1 teammate reviews
```

## Commit messages (Conventional Commits)
`feat:` new feature · `fix:` bug fix · `docs:` docs · `style:` formatting · `refactor:` · `test:` · `chore:`

## Rules
- Never push `.env`
- Pull `dev` before starting work every day
- One feature per branch, small PRs
