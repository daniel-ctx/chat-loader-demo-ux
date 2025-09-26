Chat AI Loader Demo

Este projeto demonstra um comportamento de carregamento animado para um chat AI, onde a resposta exibida varia de acordo com a complexidade da interação.

Respostas curtas → Mostram apenas frases genéricas como "Processando resposta...", "Pensando...", etc.

Respostas longas/complexas → Seguem um fluxo estruturado em passos e subpassos, com animações em estilo typewriter que simulam o raciocínio da IA antes de exibir a resposta final.

Funcionamento
Resposta curta

Exibe apenas uma frase temporária:

Processando resposta...

Logo em seguida a resposta real aparece.

Resposta longa (com passos e subpassos)

O fluxo é dividido em etapas numeradas, cada uma com subtarefas exibidas de forma sequencial.

Exibição animada

Durante a execução:

Passo Preparando ambiente de análise 1/4
Inicializando módulos de processamento...

Depois:

Passo Coletando dados relevantes 2/4
Buscando fontes de dados primárias...

Passo Coletando dados relevantes 2/4
Validando integridade dos dados...

E assim por diante até o fim.

Regras visuais

Passo atual → aparece com contador (exemplo: 2/4) e subpasso animado em execução.

Passos anteriores → permanecem visíveis, mas em estilo mais claro e sem contador.

Efeito Typewriter → todas as frases (passos e subpassos) aparecem como se estivessem sendo digitadas.

Antes da resposta final

Logo antes da mensagem real da IA, o estado é exibido assim:

Passo Preparando ambiente de análise
Passo Coletando dados relevantes
Passo Processando informações 3/4
Aplicando filtros...

E em seguida, aparece a resposta final do chat.

Tecnologias sugeridas

Frontend: React ou Vue

Animações:

efeito typewriter (Typed.js ou implementação própria)

transições suaves (Framer Motion)

Estilização: TailwindCSS para destacar passos ativos e suavizar os anteriores

Objetivo

Este projeto pode ser utilizado para:

Simular raciocínio de IA em interfaces conversacionais

Criar experiências mais imersivas em chats inteligentes

Demonstrar processos complexos antes de mostrar uma resposta final