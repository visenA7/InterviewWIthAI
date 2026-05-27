import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory and sessions file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SESSIONS_FILE)) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(data || '[]');
      parsed.forEach(session => {
        this.sessions.set(session.id, session);
      });
    } catch (error) {
      console.error('Failed to load sessions from disk:', error);
    }
  }

  saveToDisk() {
    try {
      const list = Array.from(this.sessions.values());
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save sessions to disk:', error);
    }
  }

  createSession(id, config) {
    const session = {
      id,
      config,
      createdAt: new Date().toISOString(),
      status: 'active', // active, completed
      turns: [],        // full chat logs for API context: [{ role: 'assistant' | 'user', content: '...' }]
      qaPairs: [],      // clean pairs for evaluation: [{ question: '...', answer: '...' }]
      evaluation: null  // final results
    };
    this.sessions.set(id, session);
    this.saveToDisk();
    return session;
  }

  getSession(id) {
    return this.sessions.get(id) || null;
  }

  addTurn(id, role, content) {
    const session = this.getSession(id);
    if (!session) return null;
    
    session.turns.push({ role, content, timestamp: new Date().toISOString() });
    
    // Maintain clean Q&A pairs for scoring
    if (role === 'user') {
      const lastAssistantTurn = [...session.turns].reverse().find(t => t.role === 'assistant');
      if (lastAssistantTurn) {
        session.qaPairs.push({
          question: lastAssistantTurn.content,
          answer: content
        });
      }
    }
    
    this.saveToDisk();
    return session;
  }

  completeSession(id, evaluation) {
    const session = this.getSession(id);
    if (!session) return null;
    
    session.status = 'completed';
    session.evaluation = evaluation;
    session.completedAt = new Date().toISOString();
    
    this.saveToDisk();
    return session;
  }

  deleteSession(id) {
    const deleted = this.sessions.delete(id);
    if (deleted) {
      this.saveToDisk();
    }
    return deleted;
  }

  clearAllHistory() {
    this.sessions.clear();
    this.saveToDisk();
  }

  getHistory() {
    // Return all completed sessions, sorted by date
    return Array.from(this.sessions.values())
      .filter(session => session.status === 'completed')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export const sessionManager = new SessionManager();
