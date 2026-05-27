# Contributing to AI Interview Trainer

Thank you for your interest in contributing to AI Interview Trainer! We welcome contributions from everyone.

Following these guidelines helps ensure a smooth, efficient, and welcoming contribution process for both contributors and maintainers.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs
- Search existing issues to see if the bug has already been reported.
- If it hasn't, open a new issue. Include:
  - A clear, descriptive title.
  - Steps to reproduce the issue.
  - Expected vs. actual behavior.
  - Screenshots or error logs, if applicable.
  - Your environment details (OS, Node.js version, browser).

### 2. Suggesting Features
- Open a feature request issue.
- Describe the feature you'd like to see, why it is useful, and how it should work.
- Provide mockups or flow diagrams if possible.

### 3. Submitting Pull Requests (PRs)
- Fork the repository.
- Create a new branch named after your feature or fix (e.g., `feat/interactive-charts` or `fix/auth-token`).
- Make your changes.
- Ensure that the frontend lint rules pass:
  ```bash
  npm run lint:client
  ```
- Write clear, descriptive commit messages.
- Push your changes to your fork and submit a PR to the `main` branch.
- Reference any relevant issues in your PR description.

---

## 💻 Development Workflow

1. **Clone & Setup**:
   ```bash
   git clone https://github.com/your-username/InterviewWithAI.git
   cd InterviewWithAI
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` in the `server/` directory:
   ```env
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Running the App**:
   ```bash
   npm run dev
   ```

---

## 🎨 Code Style & Quality

- **Javascript/React**: Use ES6+ features, functional React components, and custom hooks where applicable.
- **Styling**: Maintain the established HSL-tailored custom styles in the stylesheet files.
- **Linting**: Keep code clean and lint-error-free.

Thank you again for contributing! 🎉
