// services/InventarioService.ts
import { IInventarioItem } from '../models/inventario.js';
import { InventarioRepository } from '../repositories/inventario.repository.js';

export class InventarioService {
    private repository = new InventarioRepository();

    async listarResumoPorGrupo() {
        const itens = await this.repository.getInventario();

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
    };

    async gravarLancamento(data: string, dados: any) {
        let { 
            uniloj, gramatura, qtddsp, qtduni, 
            qtduni_cadpro, cusmed, codgru, codpro 
        } = dados;

        const unidadesPeso = ["KG", "LITRO", "LT"];
        const isPeso = unidadesPeso.includes(uniloj?.toUpperCase());
        
        if (!isPeso) {
            gramatura = 1;
        }

        let qtdinf = 0;
        let pestot = 0;
        let custot = 0;

        if (isPeso) {
            qtdinf = (qtddsp * qtduni_cadpro * gramatura) + qtduni;
            pestot = qtdinf;
            custot = qtdinf * cusmed;
        } else {
            qtdinf = (qtddsp * qtduni_cadpro) + qtduni;
            custot = (qtddsp * qtduni_cadpro * cusmed) + (qtduni * cusmed);
            pestot = 0;
        }

        const novoTotalGeral = await this.repository.updateItemInventario(data, {
            qtddsp, qtduni, qtdinf, pestot, codgru, codpro
        });

        return {
            success: true,
            itemAtualizado: { qtdinf, pestot, custot },
            totalGeralSistema: novoTotalGeral
        };
    };
}