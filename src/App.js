import React, { useState } from 'react';
import Chat from './components/Chat';
import './styles/App.scss';
import { IconArrowRight } from '@tabler/icons-react';

function App() {
  const [processingSeconds, setProcessingSeconds] = useState(null);
  
  return <div className='main'>
    <div className='text-description'>
      <div>
        <h1>Chat response</h1>
        <h2>Feature para melhoria de percepção do usuário sobre tempo e racional do AI</h2>
        <div className='point'><IconArrowRight /><p>Tempo de resposta:{processingSeconds ? ` • ~${processingSeconds}s` : ''}</p></div>
      </div>
    </div>
    <div className='content'><Chat onProcessingStart={() => {}} onProcessingEnd={(secs) => setProcessingSeconds(secs)} /></div>
  </div>;
}

export default App;
