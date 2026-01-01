# DataViz 

A modern, full-stack data analysis application built with Django, React, and advanced data processing capabilities. Upload, analyze, and visualize your datasets with AI-powered insights.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-19.1+-blue.svg)
![Django](https://img.shields.io/badge/django-5.2+-darkgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

- **📊 Dataset Upload & Management** - Upload CSV files with automatic validation
- **🔍 Advanced Data Analysis** - Perform statistical analysis and data exploration
- **📈 Interactive Visualizations** - Generate graphs and visual reports
- **🤖 AI-Powered Insights** - Get intelligent analysis recommendations
- **🔄 Async Processing** - Handle large files with background tasks using Celery
- **👤 User Authentication** - Secure JWT-based authentication
- **📱 Responsive UI** - Modern React frontend with smooth animations
- **🐳 Containerized** - Docker support for easy deployment
- **🔒 Production Ready** - CORS, CSRF protection, environment-based config

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 5.2.4 + Django REST Framework
- **Language:** Python 3.9+
- **Authentication:** JWT (Simple JWT)
- **Task Queue:** Celery + Redis
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **API:** RESTful API with comprehensive endpoints

### Frontend
- **Framework:** React 19.1
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **UI Components:** Custom components with Lucide icons
- **Build Tool:** Create React App

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL
- **Cache/Message Broker:** Redis
- **Web Server:** Gunicorn + Nginx (Production)

---

## 📋 Prerequisites

### Local Development
- Python 3.9 or higher
- Node.js 14+ and npm/yarn
- PostgreSQL 12+ (or use SQLite for development)
- Redis 6+ (for Celery)

### Docker
- Docker 20.10+
- Docker Compose 2.0+

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/data-analysis-platform.git
cd data-analysis-platform

# Build and run with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser (optional)
docker-compose exec backend python manage.py createsuperuser
```

Access the application:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin

### Option 2: Local Development

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend runs on: http://localhost:8000

#### Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Start development server
npm start
```

Frontend runs on: http://localhost:3000

#### Redis/Celery (Optional, for async tasks)

```bash
# Make sure Redis is running
redis-server

# In another terminal, start Celery worker
celery -A backend worker -l info
```

---

## 📁 Project Structure

```
data-analysis-platform/
├── backend/                      # Django REST Backend
│   ├── accounts/                # User authentication
│   ├── analyze/                 # Data analysis app
│   ├── backend/                 # Django settings
│   ├── media/                   # User uploads (datasets, graphs)
│   ├── requirements.txt         # Python dependencies
│   ├── manage.py               # Django CLI
│   └── Dockerfile              # Backend container config
│
├── frontend/                    # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── package.json           # Node dependencies
│   └── Dockerfile             # Frontend container config
│
├── datasets/                    # Sample datasets
├── docker-compose.yml          # Docker composition
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── Makefile                   # Build automation
└── README.md                  # This file
```

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Key variables:
- `DEBUG` - Development mode (True/False)
- `SECRET_KEY` - Django secret key
- `DATABASE_URL` - Database connection string
- `CELERY_BROKER_URL` - Redis URL for Celery
- `CORS_ALLOWED_ORIGINS` - Frontend URL for CORS
- `REACT_APP_API_URL` - Backend API URL for frontend

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/accounts/login/      - Login and get JWT token
POST   /api/accounts/register/   - Create new account
POST   /api/accounts/logout/     - Logout
POST   /api/token/refresh/       - Refresh JWT token
```

### Analysis Endpoints

```
GET    /api/analyze/datasets/                 - List user's datasets
POST   /api/analyze/datasets/                 - Upload new dataset
GET    /api/analyze/datasets/{id}/           - Get dataset details
DELETE /api/analyze/datasets/{id}/           - Delete dataset

POST   /api/analyze/analysis/                - Create analysis job
GET    /api/analyze/analysis/{id}/           - Get analysis results
GET    /api/analyze/analysis/{id}/insights/  - Get AI insights
GET    /api/analyze/analysis/{id}/graphs/    - Get generated graphs
```

For detailed API documentation, visit: `/api/docs` (if Swagger is configured)

---

## 🔧 Common Commands

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

### Using Makefile

```bash
# Build Docker images
make build

# Start services
make up

# Stop services
make down

# Run migrations
make migrate

# View logs
make logs
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Backend (8000)
lsof -i :8000
kill -9 <PID>

# Frontend (3000)
lsof -i :3000
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
# Windows: Services → PostgreSQL
# macOS: brew services list
# Linux: sudo systemctl status postgresql
```

### Redis Connection Issues
```bash
# Ensure Redis is running
redis-cli ping
# Should return: PONG
```

---

## 📖 Documentation

- [Docker Setup Guide](DOCKER_SETUP.md) - Detailed Docker configuration
- [Quick Start Guide](QUICK_START.md) - Quick reference
- [Setup Checklist](SETUP_CHECKLIST.md) - Deployment checklist

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows project style guidelines
- Tests are written for new features
- Documentation is updated
- All tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


## 📊 Project Status

- ✅ Core features implemented
- ✅ Docker containerization complete
- ✅ API documentation in progress
- ✅ Testing framework setup
- 🔄 CI/CD pipeline (GitHub Actions) - coming soon
- 🔄 Cloud deployment - coming soon

---
