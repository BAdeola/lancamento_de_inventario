import { useState, useEffect } from 'react';
import { Tabela } from '../components/Tabela/Tabela';
import { TouchInput } from '../components/Touch-Input/TouchInput';
import type { IItemInventario } from '../components/Tabela/interface';
import { Teclado } from '../components/Teclado/Teclado';

const itensIniciais: IItemInventario[] = [
    { id: 1, nome: 'Café Torrado 500g', emb: 10, dispPeso: 5, qtdTotal: 50, pesoTotal: 25, totRs: 1250.00 },
    { id: 2, nome: 'Açúcar Refinado 1kg', emb: 20, dispPeso: 2.5, qtdTotal: 40, pesoTotal: 40, totRs: 200.00 },
];

export function LancamentoView({ categoria }: { categoria: string }) {
    const [itens, setItens] = useState<IItemInventario[]>(itensIniciais);
    const [itemAtivo, setItemAtivo] = useState<number>(itensIniciais[0].id);
    const [inputAtivo, setInputAtivo] = useState<'emb' | 'disp'>('emb');

    const [visor, setVisor] = useState<string>("0");
    const itemAtual = itens.find(i => i.id === itemAtivo) || itens[0];

    // =======================================================================
    // FUNÇÃO DA MÁSCARA (ATM Style)
    // Transforma "5" em "0,05" | "50" em "0,50" | "1025" em "10,25"
    // =======================================================================
    const formatarMascaraPeso = (valorRaw: string | number) => {
        // Se receber um número do banco (ex: 2.5), multiplica por 100 para virar "250"
        let digits = typeof valorRaw === 'number' ? (valorRaw * 100).toFixed(0) : valorRaw;
        
        // Garante que só tem números e preenche com zeros à esquerda se tiver menos de 3 dígitos
        digits = digits.replace(/\D/g, '').padStart(3, '0');
        
        const inteiro = digits.slice(0, -2); // Pega tudo, exceto os dois últimos
        const decimal = digits.slice(-2);    // Pega os dois últimos
        
        // Adiciona ponto de milhar no número inteiro (ex: 1.000,00)
        const inteiroFormatado = parseInt(inteiro, 10).toLocaleString('pt-BR');
        
        return `${inteiroFormatado},${decimal}`;
    };

    // Sincroniza o visor quando o usuário clica em um campo ou item diferente
    useEffect(() => {
        const valorAtualDoCampo = itemAtual[inputAtivo === 'emb' ? 'emb' : 'dispPeso'];
        
        if (inputAtivo === 'disp') {
            // Se for peso, transforma "5" em "500" para a máscara iniciar como "5,00"
            setVisor((valorAtualDoCampo * 100).toFixed(0));
        } else {
            setVisor(String(valorAtualDoCampo));
        }
    }, [itemAtivo, inputAtivo, itemAtual]);

    // Lida com a digitação do teclado
    const handleKeyPress = (key: string) => {
        setVisor(prev => {
            if (key === 'C') return '0';
            if (key === 'DEL') return prev.length <= 1 ? '0' : prev.slice(0, -1);
            if (prev === '0') return key; // Substitui o 0 inicial
            if (prev.length >= 8) return prev; // Trava de segurança de caracteres
            return prev + key;
        });
    };

    // Grava o valor no estado da Tabela
    const handleConfirmarValor = () => {
        // Se for embalagem, salva o número puro. Se for peso, divide por 100.
        const novoValor = inputAtivo === 'disp' ? Number(visor) / 100 : Number(visor);

        setItens(itensAnteriores => 
            itensAnteriores.map(item => {
                if (item.id === itemAtivo) {
                    return {
                        ...item,
                        [inputAtivo === 'emb' ? 'emb' : 'dispPeso']: novoValor,
                    };
                }
                return item;
            })
        );
        
        // Pulo automático de foco
        if (inputAtivo === 'emb') setInputAtivo('disp');
        else setInputAtivo('emb'); 
    };

    return (
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden">
            
            <div className="px-6 pt-4 pb-3 shrink-0 border-b border-gray-50">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{categoria}</h2>
            </div>

            <div className="flex-1 flex flex-col min-h-0">

                <div className="flex-1 min-h-37.5 overflow-y-auto border-b border-gray-200">
                    <Tabela 
                        itens={itens} 
                        itemAtivoId={itemAtivo} 
                        onSelecionarItem={setItemAtivo} 
                    />
                </div>

                <div className="shrink-0 bg-slate-50/50 p-4 sm:p-6 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 lg:gap-8 w-full max-w-4xl mx-auto relative">
                        
                        {/* ====================================================
                            LADO ESQUERDO: INPUTS
                            ==================================================== */}
                        <div className="flex flex-col items-center justify-center gap-3 w-full px-2 sm:px-4">
                            
                            <TouchInput 
                                label="Embalagem"
                                // Embalagem continua sem máscara (Número inteiro)
                                valor={inputAtivo === 'emb' ? visor : itemAtual.emb}
                                isAtivo={inputAtivo === 'emb'}
                                onClick={() => setInputAtivo('emb')}
                            />
                            <TouchInput 
                                label="Display/Peso (kg)"
                                // O SEGREDO NA TELA: Aplicamos a máscara aqui!
                                valor={inputAtivo === 'disp' 
                                    ? formatarMascaraPeso(visor) 
                                    : formatarMascaraPeso(itemAtual.dispPeso)
                                }
                                isAtivo={inputAtivo === 'disp'}
                                onClick={() => setInputAtivo('disp')}
                            />

                            <button 
                                onClick={handleConfirmarValor}
                                className="w-full max-w-70 py-3 lg:py-4 mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg lg:text-xl font-bold shadow-md active:bg-orange-700 transition-colors"
                            >
                                CONFIRMAR
                            </button>

                        </div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gray-200 hidden sm:block"></div>

                        {/* ====================================================
                            LADO DIREITO: TECLADO
                            ==================================================== */}
                        <div className="flex items-center justify-center w-full px-2 sm:px-4">
                            <Teclado onKeyPress={handleKeyPress} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}