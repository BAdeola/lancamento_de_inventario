// repositories/InventarioRepository.ts
import { poolPromise } from '../config/database';
import sql from 'mssql';

export class InventarioRepository {
    async getInventarioPorData(data: string) {
        const pool = await poolPromise;
        if (!pool) throw new Error("Não foi possível estabelecer conexão com o SQL Server (getInventarioPorData).");

        const result = await pool.request()
            .input('data', sql.DateTime, data)
            .query(`
                SELECT 
                    codgru, codpro, nomgru, nompro, uniloj, gramatura, 
                    qtddsp, qtduni, qtdinf, qtddsp_cadpro, qtduni_cadpro, 
                    cusmed, pestot, situac
                FROM INVENT1
                WHERE situac = 'ABERTO'
                ORDER BY nomgru, nompro
            `);
        return result.recordset;
    }
}