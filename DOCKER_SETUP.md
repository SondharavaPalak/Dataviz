# Docker Setup Guide

This project has been containerized with Docker. Both the Django backend and React frontend are ready for containerization.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v1.29+)
- Git

## Project Structure

```
.
├── backend/                 # Django REST API
│   ├── Dockerfile          # Backend container configuration
│   └── requirements.txt     # Python dependencies
├── frontend/                # React frontend
│   ├── Dockerfile          # Frontend container configuration
│   └── package.json        # Node.js dependencies
├── docker-compose.yml      # Multi-container orchestration
├── .env.example            # Environment variables template
└── DOCKER_SETUP.md         # This file
```

## Services

The docker-compose file defines the following services:

1. **db** - PostgreSQL 15 database
   - Port: 5432
   - Database: sem4_db
   - User: sem4_user
   - Password: sem4_password

2. **redis** - Redis cache and message broker
   - Port: 6379

3. **backend** - Django REST API
   - Port: 8000
   - Depends on: db, redis
   - Auto-runs: migrations, collectstatic, gunicorn

4. **frontend** - React application
   - Port: 3000
   - Depends on: backend

5. **celery** (optional) - Async task worker
   - Depends on: db, redis, backend

## Quick Start

### 1. Clone/Download the Project
```bash
cd d:/Projects/Sem4
```

### 2. Create .env file
```bash
cp .env.example .env
```

Edit `.env` to configure environment variables if needed.

### 3. Build and Start Containers
```bash
docker-compose up --build
```

This will:
- Build the backend and frontend images
- Start PostgreSQL, Redis, Django, React, and Celery services
- Run database migrations
- Collect static files

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

## Common Commands

### Start Services
```bash
docker-compose up
```

### Start Services in Background
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop Services and Remove Volumes
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Run Django Management Commands
```bash
docker-compose exec backend python manage.py <command>

# Example: Create superuser
docker-compose exec backend python manage.py createsuperuser

# Example: Run migrations
docker-compose exec backend python manage.py migrate
```

### Run Frontend Commands
```bash
docker-compose exec frontend npm <command>
```

## Environment Variables

### Backend (.env or docker-compose.yml)
- `DEBUG`: Set to False in production
- `SECRET_KEY`: Change in production!
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DATABASE_URL`: PostgreSQL connection string
- `CELERY_BROKER_URL`: Redis broker URL
- `CELERY_RESULT_BACKEND`: Redis result backend URL
- `CORS_ALLOWED_ORIGINS`: Frontend origin(s)

### Frontend (.env or docker-compose.yml)
- `REACT_APP_API_URL`: Backend API URL
- `NODE_ENV`: development or production

## Database Setup

### First Time Setup

The docker-compose automatically runs migrations. If you need to create a superuser:

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Accessing PostgreSQL

```bash
docker-compose exec db psql -U sem4_user -d sem4_db
```

### Backup Database
```bash
docker-compose exec db pg_dump -U sem4_user sem4_db > backup.sql
```

### Restore Database
```bash
docker-compose exec db psql -U sem4_user sem4_db < backup.sql
```

## Building Production Images

### Build Images Locally
```bash
docker build -t sem4-backend:1.0 ./backend
docker build -t sem4-frontend:1.0 ./frontend
```

### Push to Docker Registry
```bash
docker tag sem4-backend:1.0 your-registry/sem4-backend:1.0
docker push your-registry/sem4-backend:1.0

docker tag sem4-frontend:1.0 your-registry/sem4-frontend:1.0
docker push your-registry/sem4-frontend:1.0
```

## Production Deployment

For production deployment:

1. Use environment-specific `.env` files
2. Set `DEBUG=False` in backend
3. Change `SECRET_KEY` to a secure random value
4. Use a managed database service (AWS RDS, Azure Database, etc.)
5. Use a CDN for static files
6. Configure proper CORS origins
7. Use a reverse proxy (Nginx) in front
8. Enable HTTPS/TLS

## Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml or kill the process
lsof -i :8000  # Find process on port 8000
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check if db service is healthy
docker-compose ps

# View database logs
docker-compose logs db
```

### Static Files Not Loading
```bash
# Collect static files manually
docker-compose exec backend python manage.py collectstatic --noinput
```

### Frontend Can't Connect to Backend
- Check `REACT_APP_API_URL` in frontend environment
- Ensure CORS is properly configured in Django
- Check backend is running and accessible

### Clearing Docker Resources
```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove all unused volumes
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

## File Modifications Made

The following files were created/modified for Docker support:

### Created:
- `backend/Dockerfile` - Backend container configuration
- `backend/requirements.txt` - Python dependencies
- `backend/.dockerignore` - Files to exclude from backend image
- `frontend/Dockerfile` - Frontend container configuration
- `frontend/.dockerignore` - Files to exclude from frontend image
- `docker-compose.yml` - Multi-container orchestration
- `.env.example` - Environment variables template
- `DOCKER_SETUP.md` - This documentation

## Next Steps

1. Update `SECRET_KEY` in django settings for production
2. Configure database connection for production
3. Set appropriate CORS origins
4. Test the application locally
5. Push images to container registry
6. Deploy to orchestration platform (Kubernetes, Docker Swarm, etc.)

## Support

For issues or questions, refer to:
- Django Documentation: https://docs.djangoproject.com/
- Docker Documentation: https://docs.docker.com/
- React Documentation: https://react.dev/
