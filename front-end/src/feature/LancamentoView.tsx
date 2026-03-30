import { useState, useEffect } from 'react';
import { Tabela, calcularTotaisItem } from '../components/Tabela/Tabela';
import { TouchInput } from '../components/Touch-Input/TouchInput';
import { Teclado } from '../components/Teclado/Teclado';
import { inventarioService } from '../services/inventario.service';
import type { IInventarioItem, ILancamentoInput } from '../types/inventario';
import { CheckCircle2, Loader2 } from 'lucide-react';

export interface LancamentoViewProps {
    categoria: string;
    itensIniciais: IInventarioItem[];
    dataInventario: string;
}

export function LancamentoView({ categoria, itensIniciais, dataInventario }: LancamentoViewProps) {
    // ESTADOS PRINCIPAIS
    const [itens, setItens] = useState<IInventarioItem[]>(itensIniciais);
    const [itemAtivoId, setItemAtivoId] = useState<number>(itensIniciais[0]?.codpro);
    const [inputAtivo, setInputAtivo] = useState<'emb' | 'disp'>('emb');
    const [visor, setVisor] = useState<string>("0");
    
    // ESTADOS DE FEEDBACK (UX)
    const [estaSalvando, setEstaSalvando] = useState(false);
    const [ultimoSalvo, setUltimoSalvo] = useState<number | null>(null);

    const itemAtual = itens.find(i => i.codpro === itemAtivoId) || itens[0];

    const handleMudarFoco = (novoFoco: 'emb' | 'disp') => {
        if (inputAtivo === novoFoco) return; // Se já está focado, não faz nada

        // 1. Muda o foco
        setInputAtivo(novoFoco);

        // 2. Já carrega o valor correto no visor NA MESMA HORA
        // Lembre-se da nossa regra: emb = qtddsp, disp = qtduni
        const valorOriginal = novoFoco === 'emb' ? itemAtual.qtddsp : itemAtual.qtduni;
        
        if (novoFoco === 'disp') {
            setVisor(String(Math.round(valorOriginal * 10000))); 
        } else {
            setVisor(String(valorOriginal));
        }
    };
    // Sincroniza o visor com o valor real do campo quando muda o foco ou o item
    useEffect(() => {
        if (!itemAtual) return;
        
        // AQUI ESTÁ A CORREÇÃO DA INVERSÃO:
        // Se for Embalagem, puxa o qtddsp. Se for Display/Peso, puxa o qtduni.
        const valorOriginal = inputAtivo === 'emb' ? itemAtual.qtddsp : itemAtual.qtduni;
        
        if (inputAtivo === 'disp') {
            // Se for o input de peso, multiplica por 100 para a máscara do teclado funcionar
            const valorNumerico = Math.round(valorOriginal * 100);
            setVisor(String(valorNumerico));
        } else {
            // Se for embalagem (inteiro), joga direto pro visor
            setVisor(String(valorOriginal));
        }
    }, [itemAtivoId, itemAtual]);

    // Máscara de Peso (ATM Style)
    const formatarMascaraPeso = (valorRaw: string) => {
        // Garante no mínimo 5 dígitos (ex: o número "1" vira "00001")
        const digits = valorRaw.replace(/\D/g, '').padStart(5, '0');
        
        // Pega os últimos 4 dígitos para os decimais
        const decimal = digits.slice(-4);
        
        // Pega tudo o que sobrar para o número inteiro
        const inteiro = parseInt(digits.slice(0, -4), 10).toLocaleString('pt-BR');
        
        return `${inteiro},${decimal}`;
    };

    const handleKeyPress = (key: string) => {
        setVisor(prev => {
            if (key === 'C') return '0';
            if (key === 'DEL') return prev.length <= 1 ? '0' : prev.slice(0, -1);
            if (prev === '0') return key;
            if (prev.length >= 8) return prev;
            return prev + key;
        });
    };

    // FUNÇÃO PARA SALVAR NO SQL 2005
    const handleConfirmarValor = async () => {
        // 1. Determina o valor numérico
        const valorDigitado = inputAtivo === 'disp' ? Number(visor) / 10000 : Number(visor);

        // 2. Criamos a nova lista atualizando o valor digitado
        const novosItens = itens.map(item => {
            if (item.codpro === itemAtivoId) {
                // Atualiza apenas o emb ou disp
                const itemModificado = { 
                    ...item, 
                    [inputAtivo === 'emb' ? 'qtddsp' : 'qtduni']: valorDigitado 
                };

                // 🌟 USA A FUNÇÃO QUE JÁ CRIAMOS PARA APLICAR A REGRA COBOL!
                const totais = calcularTotaisItem(itemModificado);
                
                // Atualiza o item com os cálculos exatos que vieram da função
                itemModificado.qtdinf = totais.qtdinf;
                itemModificado.pestot = totais.pestot;
                // Se precisar do custo médio no banco, pode passar também: itemModificado.cusmed = totais.custot;

                return itemModificado;
            }
            return item;
        });

        // Atualiza a tabela na tela
        setItens(novosItens);

        // Busca o item atualizado (sem erro de 'never')
        const itemCalculado = novosItens.find(i => i.codpro === itemAtivoId);

        // 3. SALVAMENTO IMEDIATO
        if (itemCalculado) {
            try {
                setEstaSalvando(true);
                const payload: ILancamentoInput = {
                    data: dataInventario,
                    codgru: itemCalculado.codgru,
                    codpro: itemCalculado.codpro,
                    qtddsp: itemCalculado.qtddsp,
                    qtduni: itemCalculado.qtduni,
                    qtdinf: itemCalculado.qtdinf,
                    pestot: itemCalculado.pestot,
                    uniloj: itemCalculado.uniloj,
                    gramatura: itemCalculado.gramatura,
                    qtduni_cadpro: itemCalculado.qtduni_cadpro,
                    cusmed: itemCalculado.cusmed
                };

                await inventarioService.salvarLancamento(payload);
                setUltimoSalvo(itemAtivoId);
                setTimeout(() => setUltimoSalvo(null), 2000);
            } catch (err) {
                console.error("Erro ao salvar no banco:", err);
            } finally {
                setEstaSalvando(false);
            }
        }

        // 4. PULO DE FOCO E CORREÇÃO DOS ZEROS
        const proximoFoco = inputAtivo === 'emb' ? 'disp' : 'emb';
        setInputAtivo(proximoFoco);

        if (itemCalculado) {
            const valorDoNovoFoco = proximoFoco === 'emb' ? itemCalculado.qtddsp : itemCalculado.qtduni;
            
            if (proximoFoco === 'disp') {
                setVisor(String(Math.round(valorDoNovoFoco * 10000)));
            } else {
                setVisor(String(valorDoNovoFoco));
            }
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 h-full overflow-hidden relative">
            <div className="px-6 py-4 border-b border-gray-50 bg-slate-50/30 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{categoria}</h2>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Listagem de Produtos
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-lg font-black text-orange-500">
                        {itens.length}
                    </span>
                    <span className="text-xs text-slate-400 ml-1 font-bold">ITENS</span>
                </div>
            </div>

            {/* Status de Salvamento (Overlay sutil) */}
            {estaSalvando && (
                <div className="absolute top-4 right-6 flex items-center gap-2 text-orange-500 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full animate-pulse z-20">
                    <Loader2 size={16} className="animate-spin" />
                    Gravando SQL...
                </div>
            )}

            {/* Metade Superior: Tabela */}
            <div className="h-1/2 min-h-37.5 overflow-y-auto border-b border-gray-100">
                <Tabela 
                    itens={itens} 
                    itemAtivoId={itemAtivoId} // Este estado deve conter o codpro
                    onSelecionarItem={setItemAtivoId} 
                />
            </div>

            {/* Metade Inferior: Controles */}
            <div className="h-1/2 shrink-0 bg-slate-50/40 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4 lg:gap-12 w-full h-full max-w-5xl mx-auto items-center">
                    
                    {/* Painel Esquerdo: Inputs e Feedback */}
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <div className="w-full max-w-75 relative">
                            <TouchInput 
                                label="Embalagem (Unidades)"
                                // Se ativo usa o visor, se inativo usa o qtddsp
                                valor={inputAtivo === 'emb' ? visor : String(itemAtual.qtddsp)} 
                                isAtivo={inputAtivo === 'emb'}
                                onClick={() => handleMudarFoco('emb')}
                            />
                        </div>
                        
                        <div className="w-full max-w-75 relative">
                            <TouchInput 
                                label="Display / Peso (kg)"
                                // Se ativo usa o visor, se inativo usa o qtduni formatado
                                valor={
                                    inputAtivo === 'disp' 
                                    ? formatarMascaraPeso(visor) 
                                    : formatarMascaraPeso(String(Math.round(itemAtual.qtduni * 10000)))
                                }
                                isAtivo={inputAtivo === 'disp'}
                                onClick={() => handleMudarFoco('disp')}
                            />
                        </div>

                        <button 
                            onClick={handleConfirmarValor}
                            disabled={estaSalvando}
                            className={`w-full max-w-75 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-2
                                ${ultimoSalvo === itemAtivoId 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'}
                                ${estaSalvando ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {ultimoSalvo === itemAtivoId ? (
                                <><CheckCircle2 size={24} /> SALVO!</>
                            ) : (
                                'CONFIRMAR'
                            )}
                        </button>
                    </div>

                    {/* Divisória Visual */}
                    <div className="absolute left-1/2 top-[75%] -translate-y-1/2 w-px h-1/3 bg-gray-200 hidden lg:block"></div>

                    {/* Painel Direito: Teclado */}
                    <div className="flex items-center justify-center">
                        <Teclado onKeyPress={handleKeyPress} />
                    </div>
                </div>
            </div>
        </div>
    );
}