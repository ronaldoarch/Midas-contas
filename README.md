# Meta Saldo Monitor

Sistema de monitoramento de saldos e status de contas Meta (Facebook/Instagram).

## 🚀 Funcionalidades

- Monitoramento de saldos de contas PIX
- Verificação de status de cartões de crédito
- Alertas automáticos para saldos baixos e problemas com cartões
- Interface moderna com tema preto e dourado

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Conta Meta Business com acesso à API
- App ID, App Secret e Access Token do sistema

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd meta-saldo-monitor
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
```
PORT=3000
APP_ID=seu_app_id
APP_SECRET=seu_app_secret
ACCESS_TOKEN=seu_token_de_sistema
```

## 🚀 Executando o projeto

1. Inicie o servidor backend:
```bash
cd backend
npm start
```

2. Abra o arquivo `frontend/index.html` em seu navegador

## 📦 Estrutura do Projeto

```
meta-saldo-monitor/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   └── monitor.js
│   ├── services/
│   │   └── metaService.js
│   ├── utils/
│   │   └── alertUtils.js
│   └── .env
└── frontend/
    ├── index.html
    ├── styles.css
    └── scripts.js
```

## 🔍 Uso

1. Acesse a interface web
2. O sistema carregará automaticamente os dados das contas
3. Use o botão "Atualizar Agora" para atualizar os dados manualmente
4. Alertas serão exibidos em vermelho quando houver problemas

## ⚠️ Alertas

- Contas PIX com saldo abaixo de R$30,00
- Contas com cartão de crédito com status diferente de ACTIVE

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 