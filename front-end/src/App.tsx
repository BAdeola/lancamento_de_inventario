import { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';

export default function App() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  
  // Simulando as categorias que virão do seu back-end (nomgru)
  const categoriasMock = ["Bebidas", "Cafés", "Doces", "Salgados"];

  return (
    // Fundo cinza bem claro para dar contraste com os cards brancos
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex gap-6 font-sans">
      
      {/* Menu Lateral Fixo */}
      <Sidebar 
        categorias={categoriasMock}
        categoriaSelecionada={categoriaSelecionada}
        onSelecionarCategoria={setCategoriaSelecionada}
      />

      {/* Área Principal (O quadrado grande da direita na sua imagem) */}
      <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full overflow-hidden">
        {categoriaSelecionada ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{categoriaSelecionada}</h2>
            {/* Aqui vai entrar a lista de itens e o teclado numérico! */}
            <p className="text-gray-500">Renderizar os itens de {categoriaSelecionada} aqui...</p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p className="text-lg">Selecione uma categoria ao lado para iniciar a conferência.</p>
          </div>
        )}
      </main>

    </div>
  );
}