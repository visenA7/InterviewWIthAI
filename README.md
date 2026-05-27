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

Configure your local port and LLM configurations in `server/.env`.

#### Option A: Running with LM Studio (Default)
1. Launch **LM Studio** on your local machine.
2. Select and download a model (e.g., `mistralai/ministral-3-3b` or `phi-3`).
3. Head to the **Local Server** tab in LM Studio and click **Start Server**.
4. In your `server/.env`:
   ```env
   PORT=3001
   LLM_PROVIDER=lmstudio
   LM_STUDIO_URL=http://localhost:1234/v1
   LM_STUDIO_MODEL=mistralai/ministral-3-3b
   ```

#### Option B: Running with Ollama
1. Download and install **[Ollama](https://ollama.com/)**.
2. Run your target model in your terminal:
   ```bash
   ollama run llama3
   ```
3. In your `server/.env`:
   ```env
   PORT=3001
   LLM_PROVIDER=ollama
   OLLAMA_URL=http://localhost:11434/v1
   OLLAMA_MODEL=llama3
   ```

---

### ⚙️ Frontend Advanced LLM Customization
You can also customize, override, or test different local LLM endpoints directly in the web UI!
1. Launch the application and click **Launch Local Interview**.
2. Click **⚙️ Show Advanced Local LLM Settings**.
3. Toggle between **LM Studio**, **Ollama**, or **Custom Endpoint** to enter a specific base API URL and model name on the fly.

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

