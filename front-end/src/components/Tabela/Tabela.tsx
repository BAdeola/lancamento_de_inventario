import type { TabelaProps } from "./interface";

export const calcularTotaisItem = (item: any) => {
  const uniloj = item.uniloj?.trim().toUpperCase() || '';
  const isPesoOuLitro = uniloj === 'KG' || uniloj === 'LITRO' || uniloj === 'LT';

  let qtdinf = 0;
  let pestot = 0;
  let custot = 0;
  
  // Variáveis para exibição visual na tabela (MOVE 0 TO TABLECELLS...)
  let displayQtdTotal = 0;
  let displayPesoTotal = 0;

  if (isPesoOuLitro) {
    // COBOL: IF UNILOJ-WS = "KG" OR ...
    qtdinf = (item.qtddsp * item.qtduni_cadpro * item.gramatura) + item.qtduni;
    pestot = qtdinf; // No COBOL, a fórmula do PESTOT aqui é idêntica à do QTDINF
    custot = qtdinf * item.cusmed;

    // COBOL: MOVE 0 TO NUMERO-LINHA 7 (Qtd Total) e MOVE PESTOT TO 8 (Peso)
    displayQtdTotal = 0; 
    displayPesoTotal = pestot;
  } else {
    // COBOL: ELSE
    qtdinf = (item.qtddsp * item.qtduni_cadpro) + item.qtduni;
    pestot = 0;
    custot = (item.qtddsp * item.qtduni_cadpro * item.cusmed) + (item.qtduni * item.cusmed);

    // COBOL: MOVE 0 TO PESTOT (Linha 8) e MOVE QTDINF TO Linha 7
    displayQtdTotal = qtdinf;
    displayPesoTotal = 0;
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
            // Verifica a unidade de medida
            const uniloj = item.uniloj?.trim().toUpperCase() || '';
            const isPesoOuLitro = uniloj === 'KG' || uniloj === 'LITRO' || uniloj === 'LT';

            // Se for KG, QTD fica zerada/traço. Se for UN, PESO fica zerado/traço.
            const displayQtdTotal = isPesoOuLitro ? '-' : item.qtdinf;
            const displayPesoTotal = isPesoOuLitro ? item.pestot : '-';

            // Lembre-se que as variáveis do Custo Total devem bater com a inversão
            const custoTotal = (item.qtduni * item.qtddsp_cadpro * item.cusmed) + (item.qtddsp * item.cusmed);

            return (
              <tr 
                key={item.codpro}
                onClick={() => onSelecionarItem(item.codpro)} 
                className={`border-b border-gray-100 cursor-pointer transition-colors 
                ${itemAtivoId === item.codpro ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
              >
                <td className="py-4 px-2 font-medium text-gray-800">{item.nompro}</td>
                
                {/* Mostra as colunas invertidas corretamente */}
                <td className="py-4 px-2 text-center">{item.qtddsp}</td>
                <td className="py-4 px-2 text-center font-medium text-slate-600">
                  {item.qtduni.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                
                {/* Aplica a regra visual que você pediu */}
                <td className="py-4 px-2 text-center font-bold text-blue-600">{displayQtdTotal}</td>
                <td className="py-4 px-2 text-center font-bold text-purple-600">{displayPesoTotal}</td>
                
                <td className="py-4 px-2 text-right text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}