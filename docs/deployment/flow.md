# Deployment Flow (Staging → Production)

## Golden Rule
Production is only updated after staging is validated.

---

## Step 1: Build Image
```bash
docker build -t ghcr.io/mr-badr/ar-clock:staging .
