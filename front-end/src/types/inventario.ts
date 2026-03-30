// src/types/inventario.ts

export interface IInventarioItem {
    // --- CAMPOS QUE JÁ ESTAVAM ---
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
    qtddsp_cadpro: number;
    data: string;
    sequencia_dia: number;
    cod_prod_bx?: number; 
}

export interface IRespostaInventario {
    dataInventario: string;
    totalItens: number;
    grupos: Record<string, IInventarioItem[]>;
}

export interface ILancamentoInput {
    data: string;          
    codgru: number;        
    codpro: number;        
    qtddsp: number;        
    qtduni: number;
    qtdinf: number; 
    pestot: number;     
    uniloj: string;        
    gramatura: number;     
    qtduni_cadpro: number; 
    cusmed: number;        
}