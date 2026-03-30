import { api } from '../config/api'; // Importando a instância que você mandou
import type { IRespostaInventario, ILancamentoInput } from '../types/inventario';

export const inventarioService = {
  // Busca todos os itens agrupados por categoria (nomgru)
  async getDadosCompletos() {
    const { data } = await api.get<IRespostaInventario>('/inventario');
    return data;
  },

  // Envia o lançamento de um único produto para o SQL 2005
  async salvarLancamento(payload: ILancamentoInput) {
    const { data } = await api.post('/inventario/gravar', payload);
    return data;
  }
};