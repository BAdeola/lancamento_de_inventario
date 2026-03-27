// repositories/InventarioRepository.ts
import { poolPromise } from '../config/database';
import sql from 'mssql';

export class InventarioRepository {
    async getInventario() {
        const pool = await poolPromise;
        if (!pool) throw new Error("Não foi possível estabelecer conexão com o SQL Server (getInventarioPorData).");

        const result = await pool.request()
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
    };

    async updateItemInventario(data: string, item: any) {
        const pool = await poolPromise;
        if (!pool) throw new Error("Erro de conexão");

        // Tradução do EXEC SQL UPDATE
        await pool.request()
            .input('qtddsp', sql.Decimal(18, 2), item.qtddsp)
            .input('qtduni', sql.Decimal(18, 2), item.qtduni)
            .input('qtdinf', sql.Decimal(18, 2), item.qtdinf)
            .input('pestot', sql.Decimal(18, 2), item.pestot)
            .input('data', sql.DateTime, data)
            .input('codgru', sql.Int, item.codgru)
            .input('codpro', sql.Int, item.codpro)
            .query(`
                UPDATE INVENT1 
                SET qtddsp = @qtddsp, qtduni = @qtduni, qtdinf = @qtdinf, pestot = @pestot
                WHERE data = @data AND codgru = @codgru AND codpro = @codpro
            `);

        // Tradução do EXEC SQL SELECT SUM (Total Geral)
        const resultTotal = await pool.request()
            .input('data', sql.DateTime, data)
            .query('SELECT SUM(qtdinf * cusmed) as totalGeral FROM invent1 WHERE data = @data');

        return resultTotal.recordset[0].totalGeral;
    };
}