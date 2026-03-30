import { useState, useEffect } from 'react';
import { inventarioService } from '../services/inventario.service';
import type { IRespostaInventario } from '../types/inventario';

export function useInventario() {
  const [dados, setDados] = useState<IRespostaInventario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setIsLoading(true);
      const resultado = await inventarioService.getDadosCompletos();
      setDados(resultado);
      setError(null);
    } catch (err) {
      setError('Erro ao conectar com o servidor SQL 2005.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const categorias = dados ? Object.keys(dados.grupos) : [];

  return { dados, categorias, isLoading, error, refresh: carregarDados };
}