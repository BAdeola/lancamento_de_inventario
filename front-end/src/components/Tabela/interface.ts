export interface IItemInventario {
  id: number;
  nome: string;
  emb: number;
  dispPeso: number;
  qtdTotal: number;
  pesoTotal: number;
  totRs: number;
}

export interface TabelaProps {
  itens: IItemInventario[];
  itemAtivoId: number | null;
  onSelecionarItem: (id: number) => void;
}