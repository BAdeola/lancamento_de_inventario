import express from 'express';
import cors from 'cors';
// Importaremos as rotas e a conexão do banco aqui depois

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para o Express entender JSON no corpo das requisições

// Rota de Teste (Health Check)
app.get('/status', (req, res) => {
    res.status(200).json({ message: 'Servidor rodando e pronto para o inventário!' });
});

// Aqui entraremos com as rotas de inventário (ex: app.use('/api/inventario', inventarioRoutes))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});

export default app;