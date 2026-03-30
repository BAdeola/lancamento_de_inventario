import { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { LancamentoView } from './feature/LancamentoView';
import { Menu } from 'lucide-react'; // Ícone das 3 barras

export default function App() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState<boolean>(true);

  const categoriasMock = ["Bebidas", "Cafés", "Doces", "Salgados"];

  const handleSelecionarCategoria = (categoria: string) => {
    setCategoriaSelecionada(categoria);
    // Fecha a sidebar automaticamente ao clicar em uma categoria (UX Mobile perfeita)
    setSidebarAberta(false); 
  };

  return (
    // relative e overflow-hidden garantem que nada vaze da tela
    <div className="h-screen w-full bg-gray-100 flex flex-col font-sans relative overflow-hidden">

      {/* =========================================================
          1. O BACKDROP (Fundo escurecido clicável)
          Isso é UX de alto nível. Se o cara clicar fora da aba, ela fecha.
          ========================================================= */}
      {sidebarAberta && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      {/* =========================================================
          2. A SIDEBAR OVERLAY (Flutuando por cima da tela)
          Usamos transform translate para fazer ela deslizar suavemente
          ========================================================= */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarAberta ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        {/* Envolvemos a sua Sidebar aqui dentro */}
        <div className="p-4 md:p-6 h-full">
          <Sidebar 
            categorias={categoriasMock}
            categoriaSelecionada={categoriaSelecionada}
            onSelecionarCategoria={handleSelecionarCategoria}
            onClose={() => setSidebarAberta(false)}
          />
        </div>
      </div>


      {/* =========================================================
          3. O CABEÇALHO SUPERIOR (Empurra a tela para baixo)
          ========================================================= */}
      <header className="w-full p-4 md:px-6 flex items-center gap-4 shrink-0 h-20">
        <button 
          onClick={() => setSidebarAberta(true)}
          className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-300 transition-colors"
          title="Abrir Menu de Categorias"
        >
          <Menu size={24} /> 
        </button>

        {/* Um título extra no topo ajuda o operador a saber onde está */}
        <div>
          <h1 className="text-xl font-bold text-gray-700">
            {categoriaSelecionada ? `Categoria: ${categoriaSelecionada}` : 'Inventário Geral'}
          </h1>
          <p className="text-xs text-gray-500 font-medium">Selecione os itens e lance as quantidades</p>
        </div>
      </header>


      {/* =========================================================
          4. A ÁREA PRINCIPAL
          Agora ela tem o espaço dela e nunca é esmagada!
          ========================================================= */}
      <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 overflow-hidden">
        {categoriaSelecionada ? (
          <LancamentoView 
            categoria={categoriaSelecionada}
          />
        ) : (
          <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400">
            {/* Um ícone gigante aqui ficaria legal */}
            <Menu size={64} className="mb-4 text-gray-300 opacity-50" />
            <p className="text-xl font-medium">Abra o menu e selecione uma categoria.</p>
          </div>
        )}
      </main>

    </div>
  );
}