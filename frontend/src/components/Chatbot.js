import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';

// Configuração da API
const API_URL = 'http://127.0.0.1:5000/ask';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        initializeChatbot();
        ChatbotUtils.loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeChatbot = () => {
        // Focus input on page load
        document.getElementById('userInput')?.focus();
    };

    const sendSuggestion = (text) => {
        setUserInput(text);
        sendMessage();
    };

    const addMessage = (content, isUser = false) => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages, { content, isUser }];
            return newMessages;
        });
    };

    const formatMessage = (content) => {
        let formattedContent = content.replace(/\\n/g, '<br>');
        formattedContent = formattedContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formattedContent = formattedContent.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        return formattedContent;
    };

    const scrollToBottom = () => {
        messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    const showLoading = () => {
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    const clearInput = () => {
        setUserInput('');
    };

    const sendMessage = async () => {
        const message = userInput.trim();
        if (!message) return;

        addMessage(message, true);
        clearInput();
        showLoading();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pergunta: message
                })
            });

            const data = await response.json();

            if (response.ok) {
                addMessage(data.resposta);
            } else {
                addMessage(`❌ Erro: ${data.erro || 'Algo deu errado. Tente novamente.'}`);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            addMessage('❌ Erro de conexão. Verifique se a API está rodando e tente novamente.');
        }

        hideLoading();
        ChatbotUtils.saveHistory();
    };

    const clearChat = () => {
        setMessages([]);
    };

    const checkAPIStatus = async () => {
        try {
            const response = await fetch(API_URL.replace('/ask', '/'), {
                method: 'GET',
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    const ChatbotUtils = {
        saveHistory: () => {
            localStorage.setItem('agrobot-history', JSON.stringify(messages));
        },
        loadHistory: () => {
            const history = localStorage.getItem('agrobot-history');
            if (history) {
                const messages = JSON.parse(history);
                setMessages(messages);
            }
        },
        exportChat: () => {
            const messagesToExport = messages.map(msg => {
                return `${msg.isUser ? 'Usuário' : 'AgroBot'}: ${msg.content}`;
            });
            const chatText = messagesToExport.join('\n\n');

            const blob = new Blob([chatText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `agrobot-conversa-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        
            <div className="chatbot-container">
                <div id="messagesContainer" className="messages-container">
                    {messages.length === 0 && (
                        <div className="welcome-message">
                            <h3>👋 Olá! Sou o AgroBot</h3>
                            <p>Estou aqui para ajudar com suas dúvidas sobre lavouras de café, irrigação, IoT e muito mais!</p>
                            <div className="suggestions">
                                <div className="suggestion-chip" onClick={() => sendSuggestion('Fale sobre o Agro Neural')}>Agro Neural🌱</div>
                                <div className="suggestion-chip" onClick={() => sendSuggestion('sensores de irrigação')}>sensores de irrigação🔍</div>
                                <div className="suggestion-chip" onClick={() => sendSuggestion('dicas de irrigação')}>dicas de irrigação💧</div>
                                <div className="suggestion-chip" onClick={() => sendSuggestion('Como a IA me ajuda no campo')}>Como a IA me ajuda no campo?🤖</div>
                            </div>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                            <div className="message-avatar">{msg.isUser ? '👤' : '🤖'}</div>
                            <div className="message-content" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                        </div>
                    ))}
                    <div ref={messagesContainerRef} />
                </div>
                <form id="chatForm" className="input-container" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                    <div className="input-form">
                        <textarea
                            id="userInput"
                            className="user-input"
                            placeholder="Digite sua pergunta..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            style={{ width: '886px', height: '137px' }}
                        />
                        <button id="sendButton" type="submit" disabled={isLoading}>
                            {isLoading ? '⏳' : '➤'}
                        </button>
                    <button onClick={clearChat} className="reset-button" type="button">
                        &#x21BB;
                    </button>
                    </div>
                </form>
                <div id="loadingIndicator" className="loading-indicator" style={{ display: isLoading ? 'flex' : 'none' }}>
                    Loading...
                </div>
            </div>
        
    );
};

export default Chatbot;
