# HOLIDEX

## Project Overview

HOLIDEX is a full-stack vacation management platform.

- Users can authenticate, browse vacations, and like/unlike vacations.
- Admin-oriented vacation data is served by the backend API.
- Live like updates are broadcast through a dedicated Socket.IO service.
- Vacation images are served from an S3-compatible bucket in LocalStack.

The system is split into independent services and can run in 3 modes:
local npm development, standalone `docker run` containers, or `docker compose` (recommended).

## Project Structure

- `backend`: Express + TypeScript REST API, authentication, vacations, likes, reports.
- `frontend`: React + Vite client application.
- `io`: Socket.IO relay service for real-time events.
- `database`: MySQL image seed (`sunnydb.sql`).
- `localstack`: Local AWS emulator setup (S3 bucket bootstrap scripts + image assets).

## Architecture and Dependencies

Startup dependency order:

1. `database` (MySQL)
2. `localstack` (S3-compatible API)
3. `io` (Socket server)
4. `backend` (depends on DB + LocalStack + IO)
5. `frontend` (depends on backend + IO URLs)

Notes:

- The backend connects to service hostnames `database`, `localstack`, and `io` in containerized compose-mode config.
- For local npm mode, backend defaults to localhost endpoints and can be overridden with `NODE_CONFIG`.

## Prerequisites

- Node.js `22.x`
- npm `10+`
- Docker Engine `24+`
- Docker Compose v2 (`docker compose`)
- `curl`
- `python3` (used in verification helper snippets)

Quick checks:

```bash
node -v
npm -v
docker --version
docker compose version
curl --version
python3 --version
```

## Run Mode 1: Local Development (`npm`)

This mode runs app services (`backend`, `io`, `frontend`) with npm.  
You still need infrastructure dependencies (MySQL + LocalStack).

### 1) Install npm dependencies

```bash
npm install --prefix backend
npm install --prefix io
npm install --prefix frontend
```

### 2) Start infrastructure dependencies

```bash
docker build -t holidex-database ./database
docker build -t holidex-localstack ./localstack

# If port 3306 is occupied on your host, use 3308:3306 and NODE_CONFIG override below.
docker run --name database-local \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=1 \
  -e MYSQL_DATABASE=sunnydb \
  -e MYSQL_TCP_PORT=3306 \
  -p 3308:3306 \
  -d holidex-database

docker run --name localstack-local \
  -e SERVICES=s3 \
  -e DEBUG=1 \
  -p 4566:4566 \
  -d holidex-localstack
```

### 3) Start app services (3 terminals)

Terminal A:

```bash
cd io
npm run dev
```

Terminal B:

```bash
cd backend
APP_SECRET=secret JWT_SECRET=jwtSecret \
NODE_CONFIG='{"db":{"host":"localhost","port":3308}}' \
npm run dev
```

Terminal C:

```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

### 4) Verify mode 1 end-to-end

```bash
# Frontend + infrastructure reachability
curl -I http://127.0.0.1:5173
curl -s http://localhost:4566/_localstack/health
curl -s 'http://localhost:3004/socket.io/?EIO=4&transport=polling'

# Auth -> read -> write -> read-back flow
EMAIL="npm_$(date +%s)@example.com"
JWT=$(curl -s -X POST http://localhost:3000/auth/signup \
  -H 'Content-Type: application/json' \
  -d "{\"firstName\":\"Npm\",\"lastName\":\"Mode\",\"email\":\"$EMAIL\",\"password\":\"secret123\"}" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["jwt"])')

VACATION_ID=$(curl -s http://localhost:3000/vacations \
  -H "Authorization: Bearer $JWT" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)[0]["id"])')

curl -s -X POST "http://localhost:3000/likes/$VACATION_ID" \
  -H "Authorization: Bearer $JWT" -H "x-client-id:npm-check"
curl -s http://localhost:3000/likes -H "Authorization: Bearer $JWT"
curl -s -X DELETE "http://localhost:3000/likes/$VACATION_ID" \
  -H "Authorization: Bearer $JWT" -H "x-client-id:npm-check"
curl -s http://localhost:3000/reports -H "Authorization: Bearer $JWT"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/reports/csv \
  -H "Authorization: Bearer $JWT"
```

## Run Mode 2: Individual Containers (`docker run`)

### 1) Build images

```bash
docker build -t holidex-database ./database
docker build -t holidex-localstack ./localstack
docker build -t holidex-io ./io
docker build -t holidex-backend ./backend
docker build -t holidex-frontend -f ./frontend/Dockerfile.compose ./frontend
```

### 2) Create shared network

```bash
docker network create holidex-net
```

### 3) Run services

Use the exact aliases below so backend DNS resolution matches config:

```bash
docker run --name holidex-run-database \
  --network holidex-net --network-alias database \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=1 \
  -e MYSQL_DATABASE=sunnydb \
  -e MYSQL_TCP_PORT=3306 \
  -p 3309:3306 \
  -d holidex-database

docker run --name holidex-run-localstack \
  --network holidex-net --network-alias localstack \
  -e SERVICES=s3 \
  -e DEBUG=1 \
  -p 4566:4566 \
  -d holidex-localstack

docker run --name holidex-run-io \
  --network holidex-net --network-alias io \
  -p 3004:3004 \
  -d holidex-io

# Start backend after database and localstack are ready.
docker run --name holidex-run-backend \
  --network holidex-net \
  -e NODE_ENV=compose \
  -e JWT_SECRET=jwtSecret \
  -e APP_SECRET=secret \
  -p 3020:3000 \
  -d holidex-backend

docker run --name holidex-run-frontend \
  --network holidex-net \
  -p 3012:80 \
  -d holidex-frontend
```

### 4) Verify mode 2 end-to-end

```bash
docker logs --tail=50 holidex-run-database
docker logs --tail=50 holidex-run-localstack
docker logs --tail=50 holidex-run-io
docker logs --tail=50 holidex-run-backend
docker logs --tail=50 holidex-run-frontend

curl -I http://localhost:3012
curl -s 'http://localhost:3004/socket.io/?EIO=4&transport=polling'
curl -s http://localhost:4566/_localstack/health

EMAIL="dockerrun_$(date +%s)@example.com"
JWT=$(curl -s -X POST http://localhost:3020/auth/signup \
  -H 'Content-Type: application/json' \
  -d "{\"firstName\":\"Docker\",\"lastName\":\"Run\",\"email\":\"$EMAIL\",\"password\":\"secret123\"}" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["jwt"])')

VACATION_ID=$(curl -s http://localhost:3020/vacations \
  -H "Authorization: Bearer $JWT" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)[0]["id"])')

curl -s -X POST "http://localhost:3020/likes/$VACATION_ID" \
  -H "Authorization: Bearer $JWT" -H "x-client-id:docker-run-check"
curl -s http://localhost:3020/likes -H "Authorization: Bearer $JWT"
curl -s -X DELETE "http://localhost:3020/likes/$VACATION_ID" \
  -H "Authorization: Bearer $JWT" -H "x-client-id:docker-run-check"
curl -s http://localhost:3020/reports -H "Authorization: Bearer $JWT"
```

## Run Mode 3: Docker Compose (Recommended)

### Start

```bash
docker compose up -d
```

### Stop

```bash
docker compose down
```

### Follow logs

```bash
docker compose logs -f
```

### Verify mode 3 end-to-end

```bash
docker compose ps
docker compose logs --tail=50 database
docker compose logs --tail=50 localstack
docker compose logs --tail=50 io
docker compose logs --tail=50 backend
docker compose logs --tail=50 frontend

curl -I http://localhost:3012
curl -s 'http://localhost:3004/socket.io/?EIO=4&transport=polling'
curl -s http://localhost:4566/_localstack/health

EMAIL="compose_$(date +%s)@example.com"
JWT=$(curl -s -X POST http://localhost:3020/auth/signup \
  -H 'Content-Type: application/json' \
  -d "{\"firstName\":\"Compose\",\"lastName\":\"Mode\",\"email\":\"$EMAIL\",\"password\":\"secret123\"}" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["jwt"])')

VACATION_ID=$(curl -s http://localhost:3020/vacations \
  -H "Authorization: Bearer $JWT" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)[0]["id"])')

curl -s -X POST "http://localhost:3020/likes/$VACATION_ID" \
  -H "Authorization: Bearer $JWT" -H "x-client-id:compose-check"
curl -s http://localhost:3020/likes -H "Authorization: Bearer $JWT"
curl -s -X DELETE "http://localhost:3020/likes/$VACATION_ID" \
  -H "Authorization: Bearer $JWT" -H "x-client-id:compose-check"
curl -s http://localhost:3020/reports -H "Authorization: Bearer $JWT"
```

## Environment Variables

Frontend runtime URLs are selected by mode files:

- `frontend/.env.development`
- `frontend/.env.docker`
- `frontend/.env.compose`
- `frontend/.env.production`

Backend/runtime variables:

| Variable | Used By | Description | Example |
| --- | --- | --- | --- |
| `APP_SECRET` | backend | HMAC secret for password hashing | `secret` |
| `JWT_SECRET` | backend | JWT signing secret | `jwtSecret` |
| `NODE_ENV` | backend | Config profile (`default`, `compose`, `docker`, `production`) | `compose` |
| `NODE_CONFIG` | backend (optional) | Inline override JSON for local npm mode | `{"db":{"host":"localhost","port":3308}}` |
| `SERVICES` | localstack | Enabled AWS emulated services | `s3` |
| `DEBUG` | localstack | LocalStack debug logging | `1` |
| `MYSQL_ALLOW_EMPTY_PASSWORD` | database | Allow empty MySQL root password | `1` |
| `MYSQL_DATABASE` | database | Database initialized on startup | `sunnydb` |
| `MYSQL_TCP_PORT` | database | Internal MySQL container port | `3306` |

## Ports

| Service | Local npm mode | `docker run` mode | Compose mode |
| --- | --- | --- | --- |
| Frontend | `5173` | `3012` | `3012` |
| Backend API | `3000` | `3020` | `3020` |
| IO (Socket.IO) | `3004` | `3004` | `3004` |
| LocalStack | `4566` | `4566` | `4566` |
| MySQL (host) | `3308` (recommended) | `3309` | `3309` |

## Service Scripts and Dockerfiles

- `backend`: `dev`, `build`, `start` (`backend/package.json`), Dockerfile exists (`backend/Dockerfile`).
- `frontend`: `dev`, `start`, `docker`, `build`, `build:compose`, `qa`, `lint`, `preview` (`frontend/package.json`), Dockerfiles exist (`frontend/Dockerfile`, `frontend/Dockerfile.compose`).
- `io`: `dev`, `build`, `start` (`io/package.json`), Dockerfile exists (`io/Dockerfile`).
- `database`: no `package.json`, Dockerfile exists (`database/Dockerfile`).
- `localstack`: no `package.json`, Dockerfile exists (`localstack/Dockerfile`).

## Cleanup Commands

Local npm mode dependencies:

```bash
docker rm -f database-local localstack-local
```

`docker run` mode:

```bash
docker rm -f holidex-run-frontend holidex-run-backend holidex-run-io holidex-run-localstack holidex-run-database
docker network rm holidex-net
```
