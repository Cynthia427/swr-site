import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaArrowLeft, FaArrowRight, FaBook, FaRobot, FaSearch, FaUserCircle } from 'react-icons/fa';
import Typesense from 'typesense';
import ReactMarkdown from 'react-markdown';

export default function SearchModal({ isOpen, onClose, initialQuery = '' }) {
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [currentView, setCurrentView] = useState('default');
  const [searchResults, setSearchResults] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const router = useRouter();

  // Use environment variables for Typesense configuration
const typesenseClient = new Typesense.Client({
  nodes: [{
    host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
    port: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
    protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL
  }],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY,
  connectionTimeoutSeconds: 2
});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const goToPage = (slug) => {
    onClose();
    router.push(`/${slug}`);
  };

const handleSearch = async (searchQuery) => {
  setQuery(searchQuery);
  if (searchQuery.length > 2) {
    try {
      console.log('Searching with query:', searchQuery);
      console.log('Typesense config:', {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
        port: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL
      });
      const searchParameters = {
        q: searchQuery,
        query_by: 'title,content',
        per_page: 5,
      };
      const results = await typesenseClient.collections('docs').documents().search(searchParameters);
      console.log('Search results:', results);
      setSearchResults(results.hits || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  } else {
    setSearchResults([]);
  }
};

  const handleAiQuery = async (e) => {
    e.preventDefault();
    setAiResponse('');
    if (aiQuery.trim()) {
      setIsAiThinking(true);
      try {
        const response = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: aiQuery }),
        });
        const data = await response.json();
        setAiResponse(data.response);
      } catch (error) {
        console.error('AI query error:', error);
        setAiResponse('Sorry, there was an error processing your request.');
      } finally {
        setIsAiThinking(false);
        setAiQuery(''); // Clear the query after submission
      }
    }
  };

  if (!isMounted) return null;

  return isOpen ? ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {currentView === 'default' ? (
          <>
            <div className="search-section">
              <FaSearch className="search-icon" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="modal-section">
                <h3 className="section-header">SEARCH RESULTS</h3>
                <ul>
                  {searchResults.map((result) => (
                    <li key={result.document.id}>
                      <FaArrowRight className="icon" />
                      <button onClick={() => goToPage(result.document.slug)}>
                        {result.document.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-section">
              <h3 className="section-header">DOCS</h3>
              <ul>
                <li>
                  <FaBook className="icon" />
                  <button onClick={() => setQuery('')}>
                    Search the docs
                  </button>
                </li>
                <li>
                  <FaRobot className="icon" />
                  <button onClick={() => setCurrentView('ai')}>Ask AI</button>
                </li>
              </ul>
            </div>

            <div className="modal-section">
              <h3 className="section-header">GO TO</h3>
              <ul>
                <li>
                  <FaArrowRight className="icon" />
                  <button onClick={() => goToPage('getting-started')}>
                    Go to Getting Started
                  </button>
                </li>
                <li>
                  <FaArrowRight className="icon" />
                  <button onClick={() => goToPage('database')}>
                    Go to Database
                  </button>
                </li>
                <li>
                  <FaArrowRight className="icon" />
                  <button onClick={() => goToPage('auth')}>
                    Go to Auth
                  </button>
                </li>
                <li>
                  <FaArrowRight className="icon" />
                  <button onClick={() => goToPage('storage')}>
                    Go to Storage
                  </button>
                </li>
                <li>
                  <FaArrowRight className="icon" />
                  <button onClick={() => goToPage('functions')}>
                    Go to Functions
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="ai-section">
            <div className="ai-header">
              <button onClick={() => setCurrentView('default')} className="back-button">
                <FaArrowLeft className="icon" style={{ marginRight: '5px' }} /> Ask AI
              </button>
            </div>
            <form onSubmit={handleAiQuery} className="ai-query-section">
              <FaUserCircle className="icon" style={{ marginRight: '5px' }} />
              <input
                type="text"
                placeholder="Type your question..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="search-input"
              />
            </form>

            {isAiThinking && (
              <div className="ai-thinking">
                <FaRobot className="thinking-robot" style={{ marginRight: '5px' }} /> AI is thinking...
              </div>
            )}

            {aiResponse && (
              <div className="ai-response-section">
                <div className="ai-response-header">
                  <FaRobot className="icon" style={{ marginRight: '5px' }} />
                  <span>Ask AI</span>
                </div>
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </div>
            )}

            <p className="ai-disclaimer">
              Our AI is experimental and may produce incorrect answers.
              Always verify the output before executing.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }
        .search-section, .ai-query-section {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .search-icon {
          color: #6b7280;
          font-size: 20px;
          margin-right: 15px;
        }
        .search-input {
          flex-grow: 1;
          border: none;
          border-radius: 0;
          font-size: 16px;
          padding: 10px 0;
          outline: none;
          background: transparent;
          transition: box-shadow 0.3s ease;
          margin-left: 10px;
        }
        .search-input:focus,
        .search-input:not(:placeholder-shown) {
          box-shadow: 0 2px 0 0 #3b82f6;
        }
        .search-input::placeholder {
          color: #9ca3af;
        }
        .section-header {
          color: #6f7681;
          text-transform: uppercase;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .ai-section {
          display: flex;
          flex-direction: column;
        }
        .ai-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .back-button {
          background: none;
          border: none;
          color: #3ecf8e;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
        }
        .back-button svg {
          margin-right: 5px;
        }
        .ai-thinking {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
          font-style: italic;
          color: #6b7280;
        }
        .thinking-robot {
          animation: pulse 1s infinite alternate;
          margin-right: 10px;
        }
        @keyframes pulse {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        .ai-response-section {
          background-color: #f0f0f0;
          border-radius: 5px;
          padding: 15px;
          margin-top: 20px;
        }
        .ai-response-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .ai-disclaimer {
          color: #888;
          font-size: 12px;
          margin-top: 20px;
          padding: 10px;
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 5px;
        }
        .modal-section ul {
          list-style: none;
          padding: 0;
        }
        .modal-section li {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .modal-section button {
          background: none;
          border: none;
          color: #3ecf8e;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          display: flex;
          align-items: center;
          margin-left: 8px;
        }
        .modal-section button:hover {
          text-decoration: underline;
        }
        .icon {
          margin-right: 10px; /* Adjust the margin for icons */
          font-size: 18px;
          color: #6f7681;
          flex-shrink: 0;
        }
      `}</style>
      <style jsx global>{`
        .ai-response-section {
          margin-top: 20px;
        }
        .ai-response-section h3 {
          font-size: 1.2em;
          margin-top: 15px;
          margin-bottom: 10px;
        }
        .ai-response-section ul, .ai-response-section ol {
          padding-left: 20px;
          margin-bottom: 10px;
        }
        .ai-response-section li {
          margin-bottom: 5px;
        }
        .ai-response-section p {
          margin-bottom: 10px;
        }
        .ai-response-section code {
          background-color: #f4f4f4;
          padding: 2px 4px;
          border-radius: 4px;
        }
        .ai-response-section pre {
          background-color: #f4f4f4;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
      `}</style>
    </div>,
    document.getElementById('modal-root')
  ) : null;
}
