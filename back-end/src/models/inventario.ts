export interface IInventarioItem {
    codgru: number;
    codpro: number;
    nomgru: string;
    nompro: string;
    uniloj: string;
    gramatura: number;
    qtddsp: number;
    qtduni: number;
    qtdinf: number;
    qtduni_cadpro: number;
    cusmed: number;
    pestot: number;
    situac: string;
}

export interface IRespostaInventario {
    dataInventario: string;
    totalItens: number;
    grupos: Record<string, IInventarioItem[]>;
}