import React, { useState } from 'react';

export default function AskAI() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAI = async () => {
    if (!query.trim()) {
      setError('Please enter a question before submitting.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error('AI Assistant error:', error);
      setError('An error occurred while communicating with the AI Assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-ai-container">
      <h1>Ask AI Assistant</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your question here..."
      />
      <button onClick={askAI} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {aiResponse && (
        <div className="ai-response">
          <h2>Response:</h2>
          <p>{aiResponse}</p>
        </div>
      )}
      <style jsx>{`
        .ask-ai-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        textarea {
          width: 100%;
          height: 100px;
          margin-bottom: 20px;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }
        button:disabled {
          cursor: not-allowed;
          background-color: #ccc;
        }
        .error-message {
          color: red;
          margin-top: 10px;
        }
        .ai-response {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
