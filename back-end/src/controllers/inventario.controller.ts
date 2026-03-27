import { Request, Response } from 'express';
import { InventarioService } from '../services/inventario.service';
import { ILancamentoInput } from '../models/inventario';

const inventarioService = new InventarioService();

export class InventarioController {
    async getDadosParaConferencia(req: Request, res: Response) {
        try {
            const resultado = await inventarioService.listarResumoPorGrupo();
            
            // Verificamos se o resultado existe e se tem grupos dentro dele
            if (!resultado || Object.keys(resultado.grupos).length === 0) {
                return res.status(404).json({ 
                    message: "Nenhum inventário 'Em Aberto' encontrado para esta data." 
                });
            }

            // Agora o React recebe: { dataInventario, totalItens, grupos: { ... } }
            return res.status(200).json(resultado);

        } catch (error: any) {
            // Em uma entrevista para a Hanyang, você diria que aqui 
            // deveria ter um Logger (como Winston ou Pino) para rastrear erros no servidor.
            return res.status(500).json({ 
                error: "Erro interno ao processar inventário.",
                details: error.message 
            });
        }
    };

    async salvarItem(req: Request, res: Response) {
        try {
            const dados: ILancamentoInput = req.body;

            // Validação básica de segurança
            if (!dados.data || dados.codpro === undefined) {
                return res.status(400).json({ error: "Dados incompletos para gravação." });
            }

            const resultado = await inventarioService.gravarLancamento(dados.data, dados);

            // Retornamos 200 OK com o novo total do inventário e os cálculos
            return res.status(200).json(resultado);

        } catch (error: any) {
            console.error("Erro ao gravar no SQL 2005:", error);
            return res.status(500).json({ 
                error: "Falha na gravação do item.",
                details: error.message 
            });
        }
    };
}