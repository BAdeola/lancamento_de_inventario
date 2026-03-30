import { Delete } from 'lucide-react'; 

interface TecladoProps {
  onKeyPress: (key: string) => void;
}

export function Teclado({ onKeyPress }: TecladoProps) {
  
  // Mantivemos o tamanho seguro: fica ótimo no celular e perfeito no tablet
  const btnStyle = "w-full aspect-square max-w-[4.5rem] rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold bg-white shadow-sm border border-gray-200 text-gray-700 active:bg-orange-100 active:text-orange-600 active:border-orange-300 transition-all select-none";

  return (
    // O container agora só centraliza os botões, sem visor ou confirmar
    <div className="flex items-center justify-center w-full h-full">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-70 justify-items-center">
        
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button 
            key={num} 
            onClick={() => onKeyPress(String(num))} 
            className={btnStyle}
          >
            {num}
          </button>
        ))}
        
        <button onClick={() => onKeyPress('C')} className={`${btnStyle} text-red-500 text-xl`}>C</button>
        <button onClick={() => onKeyPress('0')} className={btnStyle}>0</button>
        <button onClick={() => onKeyPress('DEL')} className={`${btnStyle} text-orange-500`}>
          <Delete className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>
        
      </div>
    </div>
  );
}