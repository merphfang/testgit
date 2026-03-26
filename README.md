# Todo App — React + .NET 8 Web API

A simple full-stack Todo application with a .NET 8 minimal-API backend and a React + Vite frontend.

---

## Prerequisites

| Tool | Version |
|------|---------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0+ |
| [Node.js](https://nodejs.org/) | 18+ |
| npm | 9+ |

---

## Project structure

```
testgit/
├── backend/
│   ├── TodoApi.sln
│   └── TodoApi/
│       ├── Controllers/
│       │   └── TodoController.cs   # CRUD endpoints
│       ├── Models/
│       │   └── TodoItem.cs         # { Id, Title, IsCompleted }
│       ├── Program.cs              # App setup + CORS
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       └── TodoApi.csproj
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js              # /api proxy → http://localhost:5000
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Full Todo CRUD UI
│       └── App.css
├── .gitignore
└── README.md
```

---

## Running the app

### 1. Start the backend

```bash
cd backend/TodoApi
dotnet run
```

The API will listen on **http://localhost:5000**.

Swagger UI is available at http://localhost:5000/swagger while in Development mode.

### 2. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

The React app will start on **http://localhost:5173**.

Vite proxies every `/api/*` request to `http://localhost:5000`, so no CORS issues during development.

---

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | List all todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/{id}` | Update a todo (title / completed) |
| DELETE | `/api/todos/{id}` | Delete a todo |

### Todo object shape

```json
{
  "id": 1,
  "title": "Buy groceries",
  "isCompleted": false
}
```

### Example requests

```bash
# Get all todos
curl http://localhost:5000/api/todos

# Create a todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn .NET","isCompleted":false}'

# Toggle complete (id = 1)
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn .NET","isCompleted":true}'

# Delete (id = 1)
curl -X DELETE http://localhost:5000/api/todos/1
```

---

## Notes

- **In-memory storage** — data resets every time the backend restarts.
- CORS is configured to allow `http://localhost:5173` (Vite default).
- The backend port is set in `appsettings.Development.json` (`"Urls": "http://localhost:5000"`).
