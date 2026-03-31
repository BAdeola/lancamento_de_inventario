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
    
    // Peso total é igual a qtdinf quando é KG
    pestot = qtdinf; 
    
    // COBOL: COMPUTE CUSTOT-WS = QTDINF-WS * CUSMED-WS
    custot = qtdinf * item.cusmed;

    displayQtdTotal = '-'; // Tabela visual (Traço para Qtd Total)
    displayPesoTotal = pestot;
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
            // 1. CHAMA A FUNÇÃO MESTRA AQUI DENTRO (Ela já traz o custot certinho)
            const totais = calcularTotaisItem(item);

            return (
              <tr 
                key={item.codpro}
                onClick={() => onSelecionarItem(item.codpro)}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${itemAtivoId === item.codpro ? 'bg-orange-100' : 'hover:bg-gray-50'}`}
              >
                <td className="py-4 px-2 font-medium text-gray-800">{item.nompro}</td>
                
                {/* Colunas de Embalagem e Display */}
                <td className="py-4 px-2 text-center">{item.qtddsp}</td> 
                <td className="py-4 px-2 text-center font-medium text-slate-600">
                  {item.qtduni.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                
                {/* QTD TOTAL e PESO TOTAL (Usando os valores que saíram da função) */}
                <td className="py-4 px-2 text-center font-bold text-blue-600">{totais.displayQtdTotal}</td>
                <td className="py-4 px-2 text-center font-bold text-purple-600">{totais.displayPesoTotal}</td>
                
                {/* 🌟 A CORREÇÃO ESTÁ AQUI: R$ TOTAL 🌟 */}
                {/* Tem que usar "totais.custot" para ele respeitar a multiplicação do COBOL */}
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