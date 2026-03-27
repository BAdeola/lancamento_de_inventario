import axios from 'axios';

// 1. Criação da Instância
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Interceptador de Resposta (Tratamento Global de Erros)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`[API Error] Status: ${error.response.status} -`, error.response.data);
            
            // Aqui poderíamos disparar um Toast (notificação na tela) global futuramente
        } else if (error.request) {
            console.error('[API Error] Sem resposta do servidor. O Back-end está rodando?');
        } else {
            console.error('[API Error] Erro ao configurar a requisição:', error.message);
        }
        return Promise.reject(error);
    }
);