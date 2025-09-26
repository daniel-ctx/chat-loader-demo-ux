# Chat Loader Demo UX

https://daniel-ctx.github.io/chat-loader-demo-ux/

Este projeto demonstra um comportamento de carregamento animado para um chat AI, onde a resposta exibida varia de acordo com a complexidade da interação.



## Objetivo


**1. Exibir o raciocínio do AI na interface de forma temporária**

**2. Criar uma experiência mais imersiva para respostas complexas e demoradas**

**3. Diminuir o atrito entre as interações**


##


**Respostas curtas → Mostram apenas frases genéricas como "Processando resposta...", "Pensando...", etc.**


**Respostas longas/complexas → Seguem um fluxo estruturado em passos e subpassos, com animações em estilo typewriter que simulam o raciocínio da IA antes de exibir a resposta final.**


##


### Funcionamento Resposta curta
→ Exibe apenas uma frase temporária:

> Processando resposta...

→ Logo em seguida a resposta real aparece.

##


### Resposta longa (com passos e subpassos)
→ O fluxo é dividido em etapas numeradas, cada uma com subtarefas exibidas de forma sequencial. Exibição animada durante a execução:

> Passo Preparando ambiente de análise 1/4

> ... Inicializando módulos de processamento...


→ Depois:



> Passo Coletando dados relevantes 2/4

> ... Buscando fontes de dados primárias...

→ Durante o passo 2/4:

> Passo Coletando dados relevantes 2/4

> ... Validando integridade dos dados...



→ E assim por diante até o fim.

### Exemplo visual Antes da resposta final

→ Logo antes da mensagem real da IA, o estado é exibido assim:

> Passo Preparando ambiente de análise

> Passo Coletando dados relevantes

> Passo Processando informações 3/4

> ... Aplicando filtros...

→ E em seguida, aparece a resposta final do chat.


## Regras visuais

- Passo atual → aparece com estilo .typing e com contador (exemplo: 2/4) e subpasso animado em execução com estilo .typing
- Passos anteriores → permanecem visíveis, mas em estilo .typed mais claro e sem contador
- Subpassos não permanecem visíveis quando o passo termina
- Efeito Typewriter → todas as frases (passos e subpassos) aparecem como se estivessem sendo digitadas.
- Loader animado na resposta única simples
- Loader animado na resposta complexa apenas nos subpassos (ThreeDots - react-loader-spinner)
Estilização: TailwindCSS para destacar passos ativos e suavizar os anteriores

