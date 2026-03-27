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
};

export interface IRespostaInventario {
    dataInventario: string;
    totalItens: number;
    grupos: Record<string, IInventarioItem[]>;
};

// models/Inventario.dto.ts
export interface ILancamentoInput {
    data: string;          // Chave primária no SQL 2005
    codgru: number;        // Chave primária
    codpro: number;        // Chave primária
    qtddsp: number;        // Display (informado pelo usuário)
    qtduni: number;        // Unidade (informado pelo usuário)
    uniloj: string;        // Necessário para o cálculo de peso
    gramatura: number;     // Fator de conversão
    qtduni_cadpro: number; // Unidades por display no cadastro
    cusmed: number;        // Custo médio para o Total Geral
};