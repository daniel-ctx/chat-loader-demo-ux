import React from 'react';
import './MessageLog.scss';
import { IconSparkles } from '@tabler/icons-react';
import { marked } from 'marked';
import { ThreeDots } from 'react-loader-spinner';
import { getRandomModeCResponse } from '../Chat/aiResponses';

// Hook reutilizável de "máquina de escrever"
const useTypewriter = (fullText, enabled, speed = 25, onEnd) => {
  const [displayed, setDisplayed] = React.useState(enabled ? '' : fullText);

  React.useEffect(() => {
    if (!enabled) {
      setDisplayed(fullText);
      return;
    }
    let i = 0;
    setDisplayed('');
    const id = setTimeout(function tick() {
      i += 1;
      setDisplayed(fullText.slice(0, i));
      if (i < fullText.length) {
        return setTimeout(tick, speed);
      }
      onEnd?.();
      return undefined;
    }, speed);

    return () => clearTimeout(id);
  }, [fullText, enabled, speed, onEnd]);

  return displayed;
};

export const UserMessage = ({ text }) => (
  <div className="user-message">
    <span>{text}</span>
  </div>
);

export const AiMessage = ({ text, typewriter, onTypewriterEnd }) => {
  const displayed = useTypewriter(text, !!typewriter, 25, onTypewriterEnd);

  const html = React.useMemo(() => {
    return marked.parse(displayed);
  }, [displayed]);

  const stillTyping = typewriter && displayed.length < text.length;

  return (
    <div className={`ai-message ${typewriter ? 'ai-typing' : 'ai-completed'}`}>
      <span className="chat-ai-icon">
        <IconSparkles size={20} stroke={2} />
      </span>
      <p
        className="ai-message-markdown"
        aria-live="polite"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {stillTyping && (
        <span className="ai-typing-dots" aria-hidden="true">
          <span>.</span><span>.</span><span>.</span>
        </span>
      )}
    </div>
  );
};

export default function MessageLog({
  messages,
  aiTyping,
  showTypewriter,
  pendingAiMsg,
  onTypewriterEnd,
  messagesEndRef,
  processingSeconds = null,
  mode = 'A',
}) {
  const steps = React.useMemo(() => ([
    'Buscando base de dados (1/4)',
    'Identificando os pontos geográficos (2/4)',
    'Aplicando os filtros definidos (3/4)',
    'Aplicando camada no mapa (4/4)',
  ]), []);

  const stepsNoCounters = React.useMemo(() => ([
    'Buscando base de dados',
    'Identificando os pontos geográficos',
    'Aplicando os filtros definidos',
    'Aplicando camada no mapa',
  ]), []);

  // ===== Modo A (DESABILITADO) =====
  // const [aIdx, setAIdx] = React.useState(0);
  // const [aDisplayed, setADisplayed] = React.useState('');
  // const aIntervalsRef = React.useRef({ step: null, typing: null });

  // React.useEffect(() => {
  //   if (mode !== 'A' || !aiTyping || showTypewriter || !processingSeconds) {
  //     clearInterval(aIntervalsRef.current.step);
  //     clearInterval(aIntervalsRef.current.typing);
  //     setAIdx(0);
  //     setADisplayed('');
  //     return;
  //   }

  //   const totalMs = processingSeconds * 1000;
  //   const perStepMs = Math.max(200, Math.floor(totalMs / steps.length));

  //   const startTyping = (text) => {
  //     clearInterval(aIntervalsRef.current.typing);
  //     let i = 0;
  //     setADisplayed('');
  //     aIntervalsRef.current.typing = setInterval(() => {
  //       i += 1;
  //       setADisplayed(text.slice(0, i));
  //       if (i >= text.length) clearInterval(aIntervalsRef.current.typing);
  //     }, 20);
  //   };

  //   setAIdx(0);
  //   startTyping(steps[0]);

  //   clearInterval(aIntervalsRef.current.step);
  //   aIntervalsRef.current.step = setInterval(() => {
  //     setAIdx((prev) => {
  //       const next = prev + 1;
  //       if (next < steps.length) {
  //         startTyping(steps[next]);
  //         return next;
  //       }
  //       clearInterval(aIntervalsRef.current.step);
  //       return prev;
  //     });
  //   }, perStepMs);

  //   return () => {
  //     clearInterval(aIntervalsRef.current.step);
  //     clearInterval(aIntervalsRef.current.typing);
  //   };
  // }, [mode, aiTyping, showTypewriter, processingSeconds, steps]);

  // ===== Modo B =====
  const [bIdx, setBIdx] = React.useState(0);
  const [bTexts, setBTexts] = React.useState(() =>
    Array(stepsNoCounters.length).fill('')
  );
  const bTimeoutsRef = React.useRef([]);
  const TYPING_CHAR_DELAY_MS = 25;

  React.useEffect(() => {
    const clearAll = () => {
      bTimeoutsRef.current.forEach(clearTimeout);
      bTimeoutsRef.current = [];
    };

    if (mode !== 'B' || !aiTyping || showTypewriter || !processingSeconds) {
      clearAll();
      setBIdx(0);
      setBTexts(Array(stepsNoCounters.length).fill(''));
      return;
    }

    clearAll();
    setBIdx(0);
    setBTexts(Array(stepsNoCounters.length).fill(''));

    const totalMs = processingSeconds * 1000;
    const stepsCount = stepsNoCounters.length;
    const perStepMs = Math.max(200, Math.floor(totalMs / stepsCount));

    const typeStep = (index) => {
      const full = stepsNoCounters[index];
      let i = 0;
      const stepStart = Date.now();

      setBIdx(index);

      const tick = () => {
        i += 1;
        setBTexts((prev) => {
          const next = prev.slice();
          next[index] = full.slice(0, i);
          return next;
        });

        if (i < full.length) {
          bTimeoutsRef.current.push(setTimeout(tick, TYPING_CHAR_DELAY_MS));
        } else {
          const elapsed = Date.now() - stepStart;
          const remainingHold = Math.max(0, perStepMs - elapsed);

          if (index + 1 < stepsCount) {
            bTimeoutsRef.current.push(
              setTimeout(() => {
                typeStep(index + 1);
              }, remainingHold)
            );
          }
        }
      };

      bTimeoutsRef.current.push(setTimeout(tick, TYPING_CHAR_DELAY_MS));
    };

    typeStep(0);

    return () => clearAll();
  }, [mode, aiTyping, showTypewriter, processingSeconds, stepsNoCounters]);

  // ===== Modo C =====
  const [cData, setCData] = React.useState(null);
  const [cBigSteps, setCBigSteps] = React.useState([]);
  const [cCurrentBigStep, setCCurrentBigStep] = React.useState(0);
  const [cCurrentSmallStep, setCCurrentSmallStep] = React.useState(0);
  const [cBigStepText, setCBigStepText] = React.useState('');
  const [cSmallStepText, setCSmallStepText] = React.useState('');
  const [cIsBigStepComplete, setCIsBigStepComplete] = React.useState(false);
  const cTimeoutsRef = React.useRef([]);

  React.useEffect(() => {
    const clearAll = () => {
      cTimeoutsRef.current.forEach(clearTimeout);
      cTimeoutsRef.current = [];
    };

    if (mode !== 'C' || !aiTyping || showTypewriter || !processingSeconds) {
      clearAll();
      setCData(null);
      setCBigSteps([]);
      setCCurrentBigStep(0);
      setCCurrentSmallStep(0);
      setCBigStepText('');
      setCSmallStepText('');
      setCIsBigStepComplete(false);
      return;
    }

    // Obter dados aleatórios para o modo C
    const modeCData = getRandomModeCResponse();
    setCData(modeCData);
    setCBigSteps([]);
    setCCurrentBigStep(0);
    setCCurrentSmallStep(0);
    setCBigStepText('');
    setCSmallStepText('');
    setCIsBigStepComplete(false);

    if (modeCData.type === 'direct') {
      return;
    }

    clearAll();

    const bigSteps = modeCData.steps;

    const processBigStep = (bigStepIndex) => {
      if (bigStepIndex >= bigSteps.length) {
        // Todos os big steps concluídos
        // Adicionar o último big step à lista antes de limpar
        if (bigStepIndex > 0) {
          const lastBigStep = bigSteps[bigStepIndex - 1];
          setCBigSteps(prev => [...prev, {
            ...lastBigStep,
            status: 'typed',
            displayText: lastBigStep.title
          }]);
        }
        
        cTimeoutsRef.current.push(
          setTimeout(() => {
            setCBigSteps([]);
            setCCurrentBigStep(0);
            setCCurrentSmallStep(0);
            setCBigStepText('');
            setCSmallStepText('');
            setCIsBigStepComplete(false);
          }, 1000)
        );
        return;
      }

      // Adicionar o big step anterior à lista quando o próximo começar
      if (bigStepIndex > 0) {
        const previousBigStep = bigSteps[bigStepIndex - 1];
        setCBigSteps(prev => [...prev, {
          ...previousBigStep,
          status: 'typed',
          displayText: previousBigStep.title
        }]);
      }

      const bigStep = bigSteps[bigStepIndex];
      setCCurrentBigStep(bigStepIndex);
      setCCurrentSmallStep(0);
      setCBigStepText('');
      setCSmallStepText('');
      setCIsBigStepComplete(false);

      // 1. Big step começa a renderizar com contador
      const bigStepText = `${bigStep.title} (${bigStep.id}/${bigSteps.length})`;
      let charIndex = 0;
      
      const typeBigStep = () => {
        if (charIndex < bigStepText.length) {
          setCBigStepText(bigStepText.slice(0, charIndex + 1));
          charIndex++;
          cTimeoutsRef.current.push(setTimeout(typeBigStep, 40));
        } else {
          // 2. Big step completo, começar small steps
          setCIsBigStepComplete(true);
          processSmallStep(0);
        }
      };
      
      cTimeoutsRef.current.push(setTimeout(typeBigStep, 200));

      const processSmallStep = (smallStepIndex) => {
        if (smallStepIndex >= bigStep.smallSteps.length) {
          // 4. Small steps acabaram, big step termina
          // Primeiro limpar o big step atual
          setCBigStepText('');
          setCSmallStepText('');
          setCIsBigStepComplete(false);
          
          // Próximo big step
          processBigStep(bigStepIndex + 1);
          return;
        }

        setCCurrentSmallStep(smallStepIndex);
        const smallStepText = bigStep.smallSteps[smallStepIndex];
        
        // 3. Small step renderiza com animação
        let charIndex = 0;
        setCSmallStepText('');
        
        const typeSmallStep = () => {
          if (charIndex < smallStepText.length) {
            setCSmallStepText(smallStepText.slice(0, charIndex + 1));
            charIndex++;
            cTimeoutsRef.current.push(setTimeout(typeSmallStep, 30));
          } else {
            // Small step completo, próximo após 1.5s
            cTimeoutsRef.current.push(
              setTimeout(() => processSmallStep(smallStepIndex + 1), 1500)
            );
          }
        };

        cTimeoutsRef.current.push(setTimeout(typeSmallStep, 100));
      };
    };

    processBigStep(0);

    return () => clearAll();
  }, [mode, aiTyping, showTypewriter, processingSeconds]);

  return (
    <div className="message-log">
      {messages.map((msg, idx) =>
        msg.sender === 'user' ? (
          <UserMessage key={idx} text={msg.text} />
        ) : (
          <AiMessage key={idx} text={msg.text} typewriter={false} />
        )
      )}

      {aiTyping && !showTypewriter && (
        mode === 'B' ? (
          <div className="ai-message ai-loading modeB">
            <div className="ai-message-markdown" aria-live="polite">
              {stepsNoCounters.map((_, i) => (
                <p key={i} className={i === bIdx ? 'typing' : i < bIdx ? 'typed' : ''}>
                  <span className="loader">
                <ThreeDots visible />
              </span>
                  {bTexts[i]}
                </p>
              ))}
              {bIdx < stepsNoCounters.length && (
                <span className="ai-typing-dots" aria-hidden="true">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              )}
            </div>
          </div>
        ) : mode === 'C' ? (
          <div className="ai-message ai-loading modeC">
            <div className="ai-message-markdown" aria-live="polite">
              {cData && cData.type === 'bigSteps' ? (
                <>
                  {/* Big steps concluídos (sem contador) */}
                  {cBigSteps.map((bigStep, bigIndex) => (
                    <p key={bigIndex} className="big-step typed">
                      {bigStep.displayText}
                    </p>
                  ))}
                  
                  {/* Big step atual sendo digitado (com contador) */}
                  {cCurrentBigStep < (cData?.steps?.length || 0) && cBigStepText && (
                    <p className="big-step typing">
                      {cBigStepText}
                      {/* Small step sempre visível quando big step está completo */}
                      {cIsBigStepComplete && (
                        <p className="small-step typing">
                          <span className="loader">
                            <ThreeDots visible />
                          </span>
                          {cSmallStepText}
                        </p>
                      )}
                    </p>
                  )}
                  {cBigSteps.length === 0 && (
                    <p>
                      {/* <span className="loader">
                        <ThreeDots visible />
                      </span> */}
                      
                    </p>
                  )}
                </>
              ) : cData && cData.type === 'direct' ? (
                <p>
                  <span className="loader">
                    <ThreeDots visible />
                  </span>
                  {cData.response}
                </p>
              ) : (
                <p>
                  <span className="loader">
                    <ThreeDots visible />
                  </span>
                   
                </p>
              )}
            </div>
          </div>
        ) : (
          // Modo A desabilitado - fallback para modo B
          <div className="ai-message ai-loading modeB">
            <div className="ai-message-markdown" aria-live="polite">
              {stepsNoCounters.map((_, i) => (
                <p key={i} className={i === bIdx ? 'typing' : i < bIdx ? 'typed' : ''}>
                  <span className="loader">
                <ThreeDots visible />
              </span>
                  {bTexts[i]}
                </p>
              ))}
              {bIdx < stepsNoCounters.length && (
                <span className="ai-typing-dots" aria-hidden="true">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              )}
            </div>
          </div>
        )
      )}

      {aiTyping && showTypewriter && (
        <AiMessage text={pendingAiMsg} typewriter onTypewriterEnd={onTypewriterEnd} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
