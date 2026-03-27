
import type { SidebarProps } from "./interfaces";

export function Sidebar({ 
  categorias, 
  categoriaSelecionada, 
  onSelecionarCategoria 
}: SidebarProps) {
  return (
    <aside className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="pb-4 border-b-2 border-gray-100">
        <h1 className="text-2xl font-bold text-orange-500 tracking-tight">
          Lançamento de Inventário
        </h1>
      </div>
      
      <div className="mt-6 mb-2">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Categorias
        </h2>
      </div>

      {/* Lista de Categorias */}
      <nav className="flex-1 overflow-y-auto pr-2">
        <ul className="flex flex-col">
          {categorias.map((categoria) => {
            const isAtiva = categoriaSelecionada === categoria;

            return (
              <li key={categoria}>
                <button
                  onClick={() => onSelecionarCategoria(categoria)}
                  // O py-4 garante o "Touch Target" grande para o dedo no tablet
                  className={`w-full text-left py-4 border-b border-gray-100 transition-colors duration-200 
                    ${isAtiva 
                      ? 'text-orange-500 font-bold border-orange-200' // Estilo quando clicado
                      : 'text-gray-600 hover:text-orange-400 font-medium' // Estilo padrão
                    }`}
                >
                  {categoria}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
    </aside>
  );
}