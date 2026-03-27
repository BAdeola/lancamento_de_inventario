import { Request, Response } from 'express';
import { InventarioService } from '../services/inventario.service';

const inventarioService = new InventarioService();

export class InventarioController {
    async getDadosParaConferencia(req: Request, res: Response) {
        try {
            const { data } = req.query;

            if (!data) {
                return res.status(400).json({ error: "A data do inventário é obrigatória." });
            }

            const resultado = await inventarioService.listarResumoPorGrupo(data.toString());
            
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
    }
}