import { useState, useEffect } from 'react';
import { inventarioService } from '../services/inventario.service';
import type { IInventarioItem, IRespostaInventario } from '../types/inventario';

export function useInventario() {
  const [dados, setDados] = useState<IRespostaInventario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🌟 Adicionamos a variável 'silencioso'
  const carregarDados = async (silencioso = false) => {
    try {
      // Só mostra a tela de carregamento se NÃO for silencioso
      if (!silencioso) setIsLoading(true); 
      
      const resultado = await inventarioService.getDadosCompletos();
      setDados(resultado);
      setError(null);
    } catch (err) {
      setError('Erro ao conectar com o servidor SQL 2005.');
    } finally {
      if (!silencioso) setIsLoading(false);
    }
  };

  const atualizarItemLocal = (categoria: string, itemAtualizado: IInventarioItem) => {
    setDados(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        grupos: {
          ...prev.grupos,
          // Procura o item antigo e substitui pelo novo calculado
          [categoria]: prev.grupos[categoria].map(item => 
            item.codpro === itemAtualizado.codpro ? itemAtualizado : item
          )
        }
      };
    });
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const categorias = dados ? Object.keys(dados.grupos) : [];

  return { dados, categorias, isLoading, error, refresh: carregarDados, atualizarItemLocal };
}