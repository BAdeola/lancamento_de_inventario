import type { TabelaProps } from "./interface";

export const calcularTotaisItem = (item: any) => {
  const uniloj = item.uniloj?.trim().toUpperCase() || '';
  const isPesoOuLitro = ['KG', 'LITRO', 'LT', 'L'].includes(uniloj);

  let qtdinf = 0;
  let pestot = 0;
  let custot = 0;
  
  // Variáveis para exibição visual na tabela
  let displayQtdTotal: number | string = 0;
  let displayPesoTotal: number | string = 0;

  if (isPesoOuLitro) {
    // COBOL: COMPUTE QTDINF-WS = (QTDDSP-WS * QTDUNI_CADPRO-WS * GRAMATURA-WS) + QTDUNI-WS
    qtdinf = (item.qtddsp * item.qtduni_cadpro * item.gramatura) + item.qtduni;
    
    // 🌟 TRAVA 1 (Matemática): Arredonda o valor real para no máximo 4 casas, cortando sujeiras do JavaScript
    pestot = Number(qtdinf.toFixed(4)); 
    
    // COBOL: COMPUTE CUSTOT-WS = QTDINF-WS * CUSMED-WS
    custot = qtdinf * item.cusmed;

    displayQtdTotal = '-'; // Tabela visual (Traço para Qtd Total)
    
    // 🌟 TRAVA 2 (Visual): Força a tabela a exibir sempre exatas 4 casas decimais (ex: 3,0000 ou 14,8445)
    displayPesoTotal = pestot.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  } else {
    // COBOL: COMPUTE QTDINF-WS = (QTDDSP-WS * QTDUNI_CADPRO-WS) + QTDUNI-WS
    qtdinf = (item.qtddsp * item.qtduni_cadpro) + item.qtduni;
    
    // Unidade não tem peso
    pestot = 0;
    
    // COBOL: COMPUTE CUSTOT-WS = (QTDDSP-WS * QTDUNI_CADPRO-WS * CUSMED-WS) + (QTDUNI-WS * CUSMED-WS)
    custot = (item.qtddsp * item.qtduni_cadpro * item.cusmed) + (item.qtduni * item.cusmed);

    displayQtdTotal = qtdinf;
    displayPesoTotal = '-'; // Tabela visual (Traço para Peso Total)
  }

  return { qtdinf, pestot, custot, displayQtdTotal, displayPesoTotal };
};

export function Tabela({ itens, itemAtivoId, onSelecionarItem }: TabelaProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
            <th className="py-3 px-2">Nome</th>
            <th className="py-3 px-2 text-center">Emb</th>
            <th className="py-3 px-2 text-center">Disp/Peso</th>
            <th className="py-3 px-2 text-center">Qtd. Total</th>
            <th className="py-3 px-2 text-center">Peso Total</th>
            <th className="py-3 px-2 text-right">Tot. R$</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => {
            // 1. CHAMA A FUNÇÃO MESTRA AQUI DENTRO
            const totais = calcularTotaisItem(item);
            
            // 🌟 O PULO DO GATO: Descobrir a formatação correta do Disp/Peso para a tabela
            const uniloj = item.uniloj?.trim().toUpperCase() || '';
            const isPesoOuLitro = ['KG', 'LITRO', 'LT', 'L'].includes(uniloj);
            
            // Se for peso, força 4 casas (0,0000). Se for unidade, não usa casas decimais (0).
            const displayFormatado = isPesoOuLitro 
              ? item.qtduni.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
              : item.qtduni.toString();

            return (
              <tr 
                key={item.codpro}
                onClick={() => onSelecionarItem(item.codpro)}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${itemAtivoId === item.codpro ? 'bg-orange-100' : 'hover:bg-gray-50'}`}
              >
                <td className="py-4 px-2 font-medium text-gray-800">{item.nompro}</td>
                
                {/* Colunas de Embalagem e Display */}
                <td className="py-4 px-2 text-center">{item.qtddsp}</td> 
                
                {/* 🌟 A CORREÇÃO ESTÁ AQUI: Usa a variável que criamos acima */}
                <td className="py-4 px-2 text-center font-medium text-slate-600">
                  {displayFormatado}
                </td>
                
                {/* QTD TOTAL e PESO TOTAL */}
                <td className="py-4 px-2 text-center font-bold text-blue-600">{totais.displayQtdTotal}</td>
                <td className="py-4 px-2 text-center font-bold text-purple-600">{totais.displayPesoTotal}</td>
                
                {/* R$ TOTAL */}
                <td className="py-4 px-2 text-right text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.custot)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}