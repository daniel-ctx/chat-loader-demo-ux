import React, { useState } from 'react';
import Chat from './components/Chat';
import './styles/App.scss';
import { IconArrowRight } from '@tabler/icons-react';

function App() {
  const [processingSeconds, setProcessingSeconds] = useState(null);
  
  return <div className='main'>
    <div className='text-description'>
      <div>
        <h1>Chat loader </h1>
        <h2>Feature para melhoria de percepção do usuário sobre tempo e racional do AI</h2>
        <div className='point'><IconArrowRight /><p>Envie uma mensagem no chat para ver o comportamento de resposta do AI</p></div>
        <div className='point'><IconArrowRight /><p>Para respostas curtas o AI vai exibir uma frase temporária</p></div>
        <div className='point'><IconArrowRight /><p>Para respostas longas, o AI vai exibir o raciocínio em passos e subpassos</p></div>
        <div className='point'><IconArrowRight /><p>Tempo de resposta da última mensagem para referencia:{processingSeconds ? ` • ~${processingSeconds}s` : ''}</p></div>
      </div>
    </div>
    <div className='content'><Chat onProcessingStart={() => {}} onProcessingEnd={(secs) => setProcessingSeconds(secs)} /></div>
  </div>;
}

export default App;
