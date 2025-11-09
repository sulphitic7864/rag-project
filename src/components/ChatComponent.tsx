import React, { useState } from 'react';
import axios from 'axios';
import './ChatComponent.css';

interface QueryResponse {
  answer: string;
  resources: { source: string; page_number: number }[];
}

const ChatComponent: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { question: string; response: QueryResponse }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() === '') return;

    setLoading(true);
    try {
      const sessionId = localStorage.getItem('X-Session-Id');
      const headers = sessionId ? { 'X-Session-Id': sessionId } : {};

      const response = await axios.post<QueryResponse>(
        'https://stag-smashing-sole.ngrok-free.app/query',
        { question },
        { headers }
      );

      const newSessionId = response.headers['X-Session-Id'];
      if (newSessionId && !sessionId) {
        localStorage.setItem('X-Session-Id', newSessionId);
      }

      setChatHistory([...chatHistory, { question, response: response.data }]);
      setQuestion('');
    } catch (error) {
      const response: QueryResponse = {
        answer: "Al momento il servizio non è disponibile. Riprovare più tardi",
        resources: []
      };
      setChatHistory([...chatHistory, { question, response }]);
      console.error('Error fetching response:', error);
    }
    setLoading(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {sidebarCollapsed ? '>' : '<'}
        </button>
        {!sidebarCollapsed && (
          <>
            <h2>Resources</h2>
            <ul className="pdf-list">
              {['ITAS-1.pdf', 'ITAS-2.pdf', 'ITAS-3.pdf', 'ITAS-4.pdf', 'ITAS-5.pdf', 'ITAS-6.pdf', 'ITAS-7.pdf', 'ITAS-8-per-CP.pdf'].map((pdf, index) => (
                <li key={index}>
                  <a href={`/pdfs/${pdf}`} target="_blank" rel="noopener noreferrer">
                    {pdf}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="chat-container">
        <div className="chat-window">
          {chatHistory.map((entry, index) => (
            <div key={index} className="chat-entry">
              <p>
                <b>Domanda:</b> {entry.question}
              </p>
              <p>
                <b>Risposta:</b> {entry.response.answer}
              </p>
              <ResourceSection resources={entry.response.resources} />
            </div>
          ))}
          {loading && <div className="loading">Loading...</div>}
        </div>
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Send a message"
            className="chat-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

interface ResourceProps {
  resources: { source: string; page_number: number }[];
}

const ResourceSection: React.FC<ResourceProps> = ({ resources }) => {
  const [showResources, setShowResources] = useState(false);

  // Deduplicate resources by grouping pages
  const groupedResources = resources.reduce((acc, resource) => {
    const { source, page_number } = resource;
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(page_number);
    return acc;
  }, {} as Record<string, number[]>);

  return (
    <div className="resource-section">
      <button
        className="toggle-resources"
        onClick={() => setShowResources(!showResources)}
      >
        {showResources ? 'Nascondi Riferimenti' : 'Mostra Riferimenti'}
      </button>
      <div
        className="resource-content"
        style={{
          maxHeight: showResources ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <ul>
          {Object.entries(groupedResources).map(([source, pages], idx) => (
            <li key={idx}>
              <a
                href={`/pdfs/${source}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
                aria-label={`Open ${source} on pages ${pages.join(', ')}`}
              >
                {source} - Pages {pages.join(', ')}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatComponent;
