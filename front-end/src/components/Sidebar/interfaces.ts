export interface SidebarProps {
    categorias: string[];
    categoriaSelecionada: string | null;
    onSelecionarCategoria: (categoria: string) => void;
    // NOVO: Função para fechar a sidebar
    onClose: () => void; 
}