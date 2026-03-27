import { useState, useCallback } from 'react';
import { api } from '../services/api';

// Tipagens baseadas no que o nosso Back-end retorna
export interface IInventarioItem {
    codgru: number;
    codpro: number;
    nomgru: string;
    nompro: string;
    qtddsp: number;
    qtduni: number;
    uniloj: string;
    gramatura: number;
    qtduni_cadpro: number;
    cusmed: number;
}

export interface IRespostaInventario {
    dataInventario: string;
    totalItens: number;
    grupos: Record<string, IInventarioItem[]>;
}

export function useInventario() {
    // Estados para gerenciar a interface
    const [dados, setDados] = useState<IRespostaInventario | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar o inventário (Usamos useCallback para evitar re-renderizações desnecessárias)
    const carregarInventario = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<IRespostaInventario>('/inventario');
            setDados(response.data);
        } catch (err: any) {
            const mensagem = err.response?.data?.message || err.response?.data?.error || "Erro ao carregar inventário.";
            setError(mensagem);
            setDados(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Função para salvar a conferência de um item
    const salvarItem = async (itemPayload: any) => {
        try {
            const response = await api.post('/inventario/gravar', itemPayload);
            return response.data; // Retorna o sucesso e o novo total geral
        } catch (err: any) {
            const mensagem = err.response?.data?.error || "Erro ao salvar item.";
            throw new Error(mensagem); // Jogamos o erro para a tela tratar (ex: mostrar um Toast)
        }
    };

    return {
        dados,
        loading,
        error,
        carregarInventario,
        salvarItem
    };
}