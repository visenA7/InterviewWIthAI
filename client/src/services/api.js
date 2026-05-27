const API_BASE_URL = 'http://localhost:3001/api/interview';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const api = {
  /**
   * Starts a new interview session
   */
  async startInterview({ type, role, difficulty, numQuestions, focusAreas, llmSettings }) {
    const response = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, role, difficulty, numQuestions, focusAreas, llmSettings })
    });
    return handleResponse(response);
  },

  /**
   * Submits candidate response and gets next question
   */
  async respondInterview(sessionId, answer) {
    const response = await fetch(`${API_BASE_URL}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId, answer })
    });
    return handleResponse(response);
  },

  /**
   * Finishes interview and fetches complete performance evaluation
   */
  async scoreInterview(sessionId) {
    const response = await fetch(`${API_BASE_URL}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    });
    return handleResponse(response);
  },

  /**
   * Fetches past interview logs
   */
  async getHistory() {
    const response = await fetch(`${API_BASE_URL}/history`);
    return handleResponse(response);
  },

  /**
   * Fetches a specific interview details
   */
  async getInterviewDetails(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
  },

  /**
   * Deletes a specific interview session
   */
  async deleteInterview(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  /**
   * Clears all completed interview history sessions
   */
  async clearHistory() {
    const response = await fetch(`${API_BASE_URL}/history/clear`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};
export default api;
