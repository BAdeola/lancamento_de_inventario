export interface SidebarProps {
    categorias: string[];
    categoriaSelecionada: string | null;
    onSelecionarCategoria: (categoria: string) => void;
}