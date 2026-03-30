import { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { LancamentoView } from './feature/LancamentoView';
import { useInventario } from './hooks/useInventario';
import { Menu, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState<boolean>(true);

  // 1. Consumindo o Hook que conecta ao seu Service/API
  const { dados, categorias, isLoading, error, refresh } = useInventario();

  const handleSelecionarCategoria = (categoria: string) => {
    setCategoriaSelecionada(categoria);
    setSidebarAberta(false); // Fecha a aba para dar espaço ao teclado
  };

  // 2. TELA DE CARREGAMENTO (UX Industrial)
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 size={48} className="animate-spin text-orange-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 tracking-tight">
          Sincronizando com SQL 2005...
        </h2>
        <p className="text-gray-400">Buscando lista de inventário atualizada</p>
      </div>
    );
  }

  // 3. TELA DE ERRO (Resiliência)
  if (error) {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center font-sans p-6 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado</h2>
        <p className="text-gray-500 max-w-md mb-6">{error}</p>
        <button 
          onClick={refresh}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-md hover:bg-orange-600 transition-colors"
        >
          <RefreshCw size={20} />
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans relative overflow-hidden">

      {/* BACKDROP: Escurece o fundo quando a sidebar abre */}
      {sidebarAberta && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setSidebarAberta(false)} 
        />
      )}

      {/* SIDEBAR: Desliza por cima (Overlay) */}
      <div className={`fixed inset-y-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
        sidebarAberta ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          categorias={categorias}
          categoriaSelecionada={categoriaSelecionada}
          onSelecionarCategoria={handleSelecionarCategoria}
          onClose={() => setSidebarAberta(false)}
        />
      </div>

      {/* HEADER: Fixado no topo, nunca some */}
      <header className="w-full p-4 md:px-6 flex items-center gap-4 shrink-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <button 
          onClick={() => setSidebarAberta(true)}
          className="w-12 h-12 shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-300 transition-all active:scale-95"
        >
          <Menu size={24} /> 
        </button>

        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-800 leading-tight">
            {categoriaSelecionada ? `Categoria: ${categoriaSelecionada}` : 'Inventário Geral'}
          </h1>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {dados?.dataInventario ? `Ref: ${dados.dataInventario}` : 'Aguardando Seleção'}
          </p>
        </div>
      </header>

      {/* ÁREA PRINCIPAL: Ocupa o resto da tela */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        {categoriaSelecionada && dados ? (
          <LancamentoView 
            key={categoriaSelecionada} 
            categoria={categoriaSelecionada} 
            itensIniciais={dados.grupos[categoriaSelecionada]} 
            dataInventario={dados.dataInventario} // <--- ADICIONE ESTA LINHA
          />
        ) : (
          <div className="h-full bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Menu size={48} className="opacity-20" />
            </div>
            <p className="text-lg font-medium">Toque no menu para escolher uma categoria</p>
            <p className="text-sm">Os itens serão carregados automaticamente.</p>
          </div>
        )}
      </main>

    </div>
  );
}