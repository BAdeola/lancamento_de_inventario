// repositories/InventarioRepository.ts
import { poolPromise } from '../config/database';
import sql from 'mssql';

export class InventarioRepository {
    async getInventario() {
        const pool = await poolPromise;

        if (!pool) {
            throw new Error("Conexão com o banco de dados não disponível.");
        }

        const result = await pool.request().query(`
            SELECT 
                I.codgru, I.codpro, I.nomgru, I.nompro, I.uniloj, 
                I.gramatura, I.qtddsp, I.qtduni, I.qtdinf, 
                I.qtddsp_cadpro, I.qtduni_cadpro, I.cusmed, I.pestot,
                I.data, I.sequencia_dia
            FROM INVENT1 AS I (NOLOCK)
            INNER JOIN INVENT AS C (NOLOCK) ON I.sequencia_dia = C.sequencia_dia
            WHERE C.situac = 'ABERTA'
        `);

        // MAPEAMENTO EXPLÍCITO: Isso evita que colunas "pulem" de lugar
        return result.recordset.map((row: any) => ({
            data: row.data,
            codgru: Number(row.codgru),
            codpro: Number(row.codpro),
            nomgru: row.nomgru?.trim(),
            nompro: row.nompro?.trim(),
            uniloj: row.uniloj?.trim(),
            gramatura: Number(row.gramatura),
            qtddsp: Number(row.qtddsp),
            qtduni: Number(row.qtduni),
            qtdinf: Number(row.qtdinf),
            qtddsp_cadpro: Number(row.qtddsp_cadpro),
            qtduni_cadpro: Number(row.qtduni_cadpro),
            cusmed: Number(row.cusmed),
            pestot: Number(row.pestot)
        }));
    }

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