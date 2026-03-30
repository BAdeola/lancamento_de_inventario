import type { IInventarioItem } from '../../types/inventario';
export interface TabelaProps {
  itens: IInventarioItem[]; // <-- Mude de IItemInventario para IInventarioItem
  itemAtivoId: number;
  onSelecionarItem: (id: number) => void;
}