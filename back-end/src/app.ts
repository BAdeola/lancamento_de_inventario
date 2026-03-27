// src/app.ts
import express from 'express';
import cors from 'cors';
import router from './routes/inventario.route.js';

const app = express();

// Middlewares essenciais
app.use(cors()); // Permite que o React (geralmente porta 5173) fale com o Node (3000)
app.use(express.json()); // Habilita o recebimento de JSON no body das requisições

// Prefixo opcional /api para manter organizado
app.use('/api', router);

// Rota de erro para caminhos não encontrados
app.use((req, res) => {
    res.status(404).json({ message: "Rota não encontrada no servidor de inventário." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Back-end conectado ao SQL 2005 rodando na porta ${PORT}`);
    console.log(`📍 Endpoint base: http://localhost:${PORT}/api/inventario`);
});

export default app;