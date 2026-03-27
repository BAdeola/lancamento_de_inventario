// services/InventarioService.ts
import { IInventarioItem } from '../models/inventario.js';
import { InventarioRepository } from '../repositories/inventario.repository.js';

export class InventarioService {
    private repository = new InventarioRepository();

    async listarResumoPorGrupo(data: string) {
        const itens = await this.repository.getInventarioPorData(data);

        // Se não vier nada, já paramos aqui
        if (itens.length === 0) return null;
        const dataInventario = itens[0].data;

        // 1. Mapeamento e Cálculo (Substituindo o LER-INVENT1)
        const itensProcessados = itens.map((item: IInventarioItem) => {
            // Tradução do COMPUTE CUSTOT-WS
            const custoTotal = (item.qtddsp * item.qtduni_cadpro * item.cusmed) + (item.qtduni * item.cusmed);
            
            // Lógica do IF UNILOJ-WS para QTD vs PESO
            const isPeso = ["KG", "LITRO", "LT"].includes(item.uniloj?.toUpperCase());

            return {
                ...item,
                custoTotal,
                exibirQtd: isPeso ? 0 : item.qtdinf,
                exibirPeso: isPeso ? item.pestot : 0
            };
        });

        // 2. Agrupamento por nomgru (Para o clique no front-end)
        const grupos = itensProcessados.reduce((acc: any, item: any) => {
            if (!acc[item.nomgru]) acc[item.nomgru] = [];
            acc[item.nomgru].push(item);
            return acc;
        }, {});

        // Retornamos o "Envelope" completo
        return {
            dataInventario,
            totalItens: itens.length,
            grupos
        };
    }
}