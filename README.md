# JAXYRON — AI Operating System

Primeira versão de uma central de missões com React, Vite e Express. Interface em português, identidade futurista, boot animado, 18 especialistas em quatro camadas, seleção por missão, histórico local, cópia e exportação Markdown.

## Executar

Requer Node.js 24.5+ e npm.

```bash
npm ci
npm run dev
```

O servidor atende na porta 3000 (`PORT` permite alterar). O Express serve a API e o Vite no mesmo processo durante o desenvolvimento.

```bash
npm run build
npm test
npm start
```

`npm start` serve o build de produção; execute o build antes. Os testes de API também utilizam esse build.

## Integração Anthropic

Sem chave, o app funciona em **modo demonstração**, com respostas ilustrativas locais explicitamente identificadas. Não é uma resposta de IA nem executa ações externas.

Para ativar IA, copie `.env.example` para `.env` e configure `ANTHROPIC_API_KEY` no servidor, ou injete a variável no ambiente. Nunca coloque a chave em variáveis `VITE_` ou no frontend. Reinicie o servidor após configurar. O modelo padrão é `claude-sonnet-4-20250514`; `ANTHROPIC_MODEL` permite selecionar outro modelo disponível na sua conta. A integração real exige acesso HTTPS a `api.anthropic.com`, credencial válida e saldo. Ela não foi validada com uma chave real nesta entrega.

O runtime usa o proxy de rede herdado com verificação TLS preservada. As fontes Exo 2 e JetBrains Mono são servidas localmente.

## Escopo da primeira versão

- Os 18 agentes são papéis selecionados por regras locais e consolidados em **uma chamada ao modelo**, sem processos autônomos separados.
- Histórico limitado às 30 missões mais recentes e armazenado apenas no navegador. Limpar os dados do navegador apaga o histórico. Exporte entregas importantes.
- Nenhuma ferramenta externa é acionada. O sistema produz planos e respostas; não publica campanhas nem executa código.
- Backend para desenvolvimento e demonstração local. Antes de disponibilizar publicamente, adicionar autenticação, limitação de requisições, controles de acesso, persistência e monitoramento de custos.
- Sem banco de dados, contas, cobrança ou memória entre dispositivos.

## Organização

`src/main.jsx`: interface e fluxo de missões. `src/style.css`: identidade e responsividade. `server/orchestrator.js`: catálogo, roteamento e demonstração. `server/index.js`: API e integração Anthropic. `test/`: validações do catálogo, roteamento e API.

## Publicar demonstração no Render

O arquivo `render.yaml` configura um serviço que hospeda interface e API juntas, com health check e Node.js 24.22.1. O build instala dependências de desenvolvimento para executar o Vite. A primeira publicação deve funcionar em modo demonstração, sem `ANTHROPIC_API_KEY`.

1. Envie os arquivos deste projeto para seu repositório GitHub. Arquivos presentes apenas no ambiente local não são lidos pelo Render.
2. Acesse https://dashboard.render.com/ e conecte sua conta GitHub.
3. Crie um **Blueprint**, selecione o repositório e a branch que contém `render.yaml`, confira o plano e faça o deploy.
4. Quando o deploy terminar, abra a URL HTTPS exibida no painel do serviço. O endereço é atribuído pelo Render; não há um endereço público confirmado antes disso.

Não configure uma chave paga na demonstração pública sem implementar autenticação e controles de uso. A configuração é para demonstração; o plano gratuito pode suspender o serviço por inatividade, conforme a disponibilidade e as condições do provedor.
