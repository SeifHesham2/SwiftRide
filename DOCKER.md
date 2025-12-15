# MiniUber Docker Setup 🐳

Complete Docker configuration for running the MiniUber application with all its services.

## 📋 Services Overview

The application consists of 5 services:

1. **MySQL Database** - Port 3307 (external) / 3306 (internal)
2. **RabbitMQ Message Broker** - Ports 5672 (AMQP) & 15672 (Management UI)
3. **Spring Boot Backend** - Port 8081 (external) / 8080 (internal)
4. **Customer Frontend** - Port 3002
5. **Employee Portal** - Port 3003

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- At least 4GB RAM available for Docker

### Running the Application

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes (clean slate):**
   ```bash
   docker-compose down -v
   ```

## 🔗 Access URLs

Once all services are running:

- **Customer Frontend**: http://localhost:3002
- **Employee Portal**: http://localhost:3003
- **Backend API**: http://localhost:8081
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MySQL Database**: localhost:3307 (springstudent/springstudent)

## 📦 Individual Service Commands

### Build specific service:
```bash
docker-compose build backend
docker-compose build frontend
docker-compose build employee-portal
```

### Start specific service:
```bash
docker-compose up -d mysql
docker-compose up -d rabbitmq
docker-compose up -d backend
```

### View logs for specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart specific service:
```bash
docker-compose restart backend
```

## 🔧 Troubleshooting

### Services won't start
1. Check if ports are already in use:
   ```bash
   netstat -ano | findstr :3002
   netstat -ano | findstr :8081
   ```

2. View service status:
   ```bash
   docker-compose ps
   ```

### Backend can't connect to MySQL/RabbitMQ
- Wait for health checks to pass (usually 30-60 seconds)
- Check logs: `docker-compose logs mysql rabbitmq`

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Clean rebuild (removes cached layers)
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 📁 File Structure

```
MiniUber/
├── docker-compose.yml          # Orchestration configuration
├── Dockerfile.backend          # Backend build instructions
├── .dockerignore              # Backend ignore patterns
├── frontend/
│   ├── Dockerfile             # Frontend build instructions
│   ├── nginx.conf             # Frontend nginx config
│   └── .dockerignore          # Frontend ignore patterns
└── employee-portal/
    ├── Dockerfile             # Employee portal build instructions
    ├── nginx.conf             # Employee portal nginx config
    └── .dockerignore          # Employee portal ignore patterns
```

## 🔐 Environment Variables

All sensitive configuration is in `docker-compose.yml`. To use different values:

1. Create a `.env` file in the project root
2. Override variables:
   ```env
   MYSQL_PASSWORD=your_password
   RABBITMQ_PASSWORD=your_password
   ```

## 💾 Data Persistence

- **MySQL data** is persisted in a Docker volume named `mysql-data`
- **Uploads** are mounted from `./uploads` directory
- To reset database: `docker-compose down -v`

## 🎯 Production Considerations

For production deployment:

1. **Change default passwords** in docker-compose.yml
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** with proper SSL certificates
4. **Configure resource limits** for each service
5. **Set up proper logging** and monitoring
6. **Use Docker secrets** instead of plain text passwords

## 📝 Notes

- The backend waits for MySQL and RabbitMQ health checks before starting
- Frontend and Employee Portal proxy `/api/*` requests to the backend
- SQL scripts in `./sql-scripts` are automatically executed on first MySQL startup
