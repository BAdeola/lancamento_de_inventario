import type { TabelaProps } from "./interface";


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
          {itens.map((item) => (
            <tr 
              key={item.id}
              onClick={() => onSelecionarItem(item.id)}
              className={`border-b border-gray-100 cursor-pointer transition-colors 
                ${itemAtivoId === item.id ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
            >
              <td className="py-4 px-2 font-medium text-gray-800">{item.nome}</td>
              <td className="py-4 px-2 text-center">{item.emb}</td>
              <td className="py-4 px-2 text-center">{item.dispPeso}</td>
              <td className="py-4 px-2 text-center font-bold text-blue-600">{item.qtdTotal}</td>
              <td className="py-4 px-2 text-center">{item.pesoTotal}</td>
              <td className="py-4 px-2 text-right text-green-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totRs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}