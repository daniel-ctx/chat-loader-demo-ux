import React, { useState, useRef, useEffect } from 'react';
import { RightOutlined } from '@ant-design/icons';
import logo from '../../img/logo.svg';
import './Chat.scss';
import aiResponses from './aiResponses';

import MessageLog from '../MessageLog';
import ChatPromptInput from '../ChatPromptInput';
import { useRef as useReactRef } from 'react';


const getRandomAiResponse = () => {
  const idx = Math.floor(Math.random() * aiResponses.length);
  return aiResponses[idx];
};

const initialAiGreeting = { sender: 'ai', text: 'Olá! Sou o Cortex AI, estou aqui para te ajudar a explorar, analisar e entender seus dados geográficos. O que deseja fazer agora?' };

// Retorna um tempo aleatório inteiro de segundos entre 5s e 50s
function getRandomDelay() {
  const seconds = Math.floor(Math.random() * (50 - 5 + 1)) + 5; // 5s a 50s
  return { ms: seconds * 1000, seconds };
}

const Chat = ({ onProcessingStart, onProcessingEnd }) => {
  const [messages, setMessages] = useState([initialAiGreeting]);
  const [mentionsValue, setMentionsValue] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [pendingAiMsg, setPendingAiMsg] = useState('');
  const [showTypewriter, setShowTypewriter] = useState(false);
  const messagesEndRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const aiTimeoutRef = useReactRef();
  const [processingSeconds, setProcessingSeconds] = useState(null);
  const [mode, setMode] = useState('B'); // Modo será determinado pelo tempo

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping, showTypewriter]);

  const handleSend = (e) => {
    e.preventDefault();
    const textToSend = mentionsValue.trim();
    if (!textToSend) return;
    setMessages([...messages, { sender: 'user', text: textToSend }]);
    setMentionsValue('');
    setAiTyping(true);
    setShowTypewriter(false);
    const aiMsg = getRandomAiResponse();
    setPendingAiMsg(aiMsg);
    const delay = getRandomDelay();
    
    // Determinar modo baseado no tempo: <10s = B, >=10s = C
    const selectedMode = delay.seconds < 10 ? 'B' : 'C';
    setMode(selectedMode);
    
    setProcessingSeconds(delay.seconds);
    if (onProcessingStart) onProcessingStart(delay.seconds);
    aiTimeoutRef.current = setTimeout(() => {
      setShowTypewriter(true);
    }, delay.ms);
  };

  const handleCancelAi = () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    setAiTyping(false);
    setShowTypewriter(false);
    setPendingAiMsg('');
    setProcessingSeconds(null);
    if (onProcessingEnd) onProcessingEnd();
  };

  return (
    <div className="chat-onmaps">
      <header className="chat-header">
        <img src={logo} alt="logo" style={{ cursor: 'pointer' }} onClick={() => setMessages([initialAiGreeting])} />
        <span className="chat-chevron"><RightOutlined /></span>
      </header>
      <MessageLog
        messages={messages}
        aiTyping={aiTyping}
        showTypewriter={showTypewriter}
        pendingAiMsg={pendingAiMsg}
        mode={mode}
        processingSeconds={processingSeconds}
        onTypewriterEnd={() => {
          setMessages((msgs) => [
            ...msgs,
            { sender: 'ai', text: pendingAiMsg }
          ]);
          setAiTyping(false);
          setShowTypewriter(false);
          setPendingAiMsg('');
          const finishedSeconds = processingSeconds;
          setProcessingSeconds(null);
          if (onProcessingEnd) onProcessingEnd(finishedSeconds);
        }}
        messagesEndRef={messagesEndRef}
      />
      <form className="chat-footer" onSubmit={handleSend}>
        <ChatPromptInput
          value={prompt}
          onChange={setPrompt}
          onSend={text => {
            if (!text.trim()) return;
            setMessages([...messages, { sender: 'user', text }]);
            setPrompt('');
            setAiTyping(true);
            setShowTypewriter(false);
            const aiMsg = getRandomAiResponse();
            setPendingAiMsg(aiMsg);
            const delay = getRandomDelay();
            
            // Determinar modo baseado no tempo: <10s = B, >=10s = C
            const selectedMode = delay.seconds < 10 ? 'B' : 'C';
            setMode(selectedMode);
            
            setProcessingSeconds(delay.seconds);
            if (onProcessingStart) onProcessingStart(delay.seconds);
            aiTimeoutRef.current = setTimeout(() => {
              setShowTypewriter(true);
            }, delay.ms);
          }}
          aiTyping={aiTyping}
          onCancelAi={handleCancelAi}
        />
      </form>
    </div>
  );
};

export default Chat; 