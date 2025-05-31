import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/ask", { // ✅ porta corrigida aqui
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="chatbot">
      <div className="message-history">
        {/* Mensagens do chatbot aqui */}
      </div>
      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Digite aqui sua dúvida"
        />
        <button type="submit">Enviar</button>
      </form>
      {response && (
        <div className="response">
          <strong>Resposta:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
