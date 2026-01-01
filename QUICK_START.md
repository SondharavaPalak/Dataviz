# Quick Setup Guide for Your Friend 👥

## 🎯 TL;DR - Fastest Way to Run

**Your friend's complete steps (2 minutes):**

```powershell
# 1. Install Docker
# Download from: https://www.docker.com/products/docker-desktop

# 2. Clone your project (if on GitHub)
git clone https://github.com/your-username/sem4.git
cd sem4

# 3. Copy environment config (creates .env file)
copy .env.example .env

# 4. Start everything with ONE command
docker-compose up -d

# 5. Wait 30 seconds, then enjoy!
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# Admin:     http://localhost:8000/admin
```

**That's it!** No manual setup, no dependency installation, nothing else needed. 🎉

---

## 📋 What Your Friend Gets

After running `docker-compose up -d`:

```
✅ Frontend (React app)     running on :3000
✅ Backend (Django API)     running on :8000
✅ Database (PostgreSQL)    running on :5432
✅ Cache (Redis)            running on :6379
✅ Task Queue (Celery)      ready for async jobs
```

All automatically set up and configured!

---

## 🆘 When Something Goes Wrong

### "Port already in use"
```powershell
# Kill the process on port 8000
taskkill /PID <PID> /F
docker-compose down
docker-compose up -d
```

### "Can't connect to backend"
```powershell
# Check if backend is running
docker-compose ps

# View errors
docker-compose logs backend
```

### "Database error"
```powershell
# Restart database
docker-compose restart db

# Check status
docker-compose logs db
```

### "Complete reset"
```powershell
docker-compose down -v
docker-compose up -d
```

---

## 🔧 Common Commands

```powershell
# View all running services
docker-compose ps

# See what's happening
docker-compose logs -f

# Stop everything
docker-compose down

# Restart everything
docker-compose restart

# Create admin user
docker-compose exec backend python manage.py createsuperuser

# Access database
docker-compose exec db psql -U sem4_user -d sem4_db
```

---

## ✅ Success = All These URLs Work

- http://localhost:3000 → Frontend loads
- http://localhost:8000 → Backend API responds
- http://localhost:8000/admin → Admin panel (after creating user)

---

## 📚 Full Documentation

For detailed help, your friend can read:
- **FRIEND_SETUP_GUIDE.md** ← Detailed version (more detailed)
- **DOCKER_SETUP.md** ← Even more detailed
- **DOCKER_QUICK_REFERENCE.md** ← All commands reference

---

**Summary: Just run `docker-compose up -d` and enjoy!** 🚀
