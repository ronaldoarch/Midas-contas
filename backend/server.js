require('dotenv').config();
const express = require('express');
const cors = require('cors');
const monitorRoutes = require('./routes/monitor');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/monitor', monitorRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static('../frontend'));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 