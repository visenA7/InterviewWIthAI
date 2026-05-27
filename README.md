# 🚀 AI Interview Trainer

A premium, interactive AI-powered interview preparation platform. This application features a React frontend and an Express/Node.js backend, fully integrated via npm workspaces for seamless development.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite, HSL-tailored custom styles, Responsive UI)
- **Backend:** Node.js, Express, OpenAI API Integration, Session Management
- **Workspaces:** npm workspaces for unified dependency management

---

## 📂 Project Structure

```text
├── client/                 # React frontend (Vite)
├── server/                 # Express backend (Node.js)
├── .gitignore              # Root Git ignore rules
├── package.json            # Root workspace configuration
└── README.md               # Project documentation (this file)
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed.

### 2. Environment Setup
Create a `.env` file inside the `server/` directory:
```bash
cp server/.env.example server/.env  # Or edit server/.env if already present
```
Configure your OpenAI API key and server port:
```env
PORT=5000
OPENAI_API_KEY=your_openai_key_here
```

### 3. Installation
Install all dependencies for both the client and server with a single command from the root folder:
```bash
npm install
```

### 4. Running the Application
Start both the React frontend and Node.js backend concurrently:
```bash
npm run dev
```

The application will launch:
- **Frontend (Client):** `http://localhost:5173`
- **Backend (Server):** `http://localhost:5000`

---

## 💻 Available Scripts

Run these scripts from the root directory:

| Command | Description |
|:---|:---|
| `npm run dev` | Starts **both** client & server concurrently |
| `npm run dev:client` | Starts only the frontend development server |
| `npm run dev:server` | Starts only the backend development server |
| `npm run build:client`| Compiles the client React app for production |
| `npm run start:server`| Starts the production backend server |
| `npm run lint:client` | Runs ESLint on the frontend codebase |

---

## 🤝 Community & Licensing

Contributions, issues, and feature requests are welcome!

- **License:** Distributed under the [MIT License](LICENSE).
- **Contributing:** Read our [Contributing Guidelines](CONTRIBUTING.md) to get started.
- **Code of Conduct:** Please review our [Code of Conduct](CODE_OF_CONDUCT.md) to keep this community welcoming.
- **Security:** Learn how to report vulnerabilities in our [Security Policy](SECURITY.md).

---

Happy Interview Prep! 🎯

