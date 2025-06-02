import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: question }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro do servidor: ${text}`);
      }

      const data = await res.json();
      setResponse(data.resposta || 'Nenhuma resposta recebida.');
    } catch (error) {
      console.error('Error:', error);
      setResponse('❌ Erro: não foi possível obter uma resposta do servidor.');
    }
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">🤖 Chatbot Agrícola</h2>

      <div className="chatbot-response-box">
        {response ? (
          <div className="bot-response">
            <span className="bot-label">🌱 Bot:</span>
            <p>{response}</p>
          </div>
        ) : (
          <p className="placeholder-text">As respostas aparecerão aqui...</p>
        )}
      </div>

      <form className="chatbot-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chatbot-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Digite sua dúvida sobre a plantação..."
        />
        <button type="submit" className="chatbot-button">Enviar</button>
      </form>
    </div>
  );
}

export default Chatbot;
